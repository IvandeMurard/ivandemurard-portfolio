import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// MCP_TRACKING_SINCE is null in the repository until deployment. The mock lets each test choose its value.
const since = vi.hoisted(() => ({ value: null as string | null }));
vi.mock("../content/agents", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../content/agents")>()),
  get MCP_TRACKING_SINCE() {
    return since.value;
  },
}));

import mcp from "../lib/mcp";
import { MCP_WRITES_PER_MINUTE, resetBudget, tracked } from "../lib/mcp/track";

type Handler = (args: { slug: string }) => Promise<{ content: unknown[]; isError?: boolean }>;
const tool = (name: string) => (mcp.tools as unknown as { name: string; handler: Handler }[]).find((t) => t.name === name)!;

const SERVICE_KEY = "service-role-test-key";
const stubEnv = (vars: Record<string, string> = { SUPABASE_URL: "https://db.example", SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY }) =>
  vi.stubGlobal("Deno", { env: { get: (k: string) => vars[k] } });

/** fetch that serves the site Markdown from public/ and records every write to mcp_calls. */
const stubFetch = (onWrite: () => Promise<Response> | Response = () => new Response(null, { status: 201 })) => {
  const writes: { url: string; init: RequestInit }[] = [];
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url.includes("/rest/v1/mcp_calls")) {
      writes.push({ url, init: init ?? {} });
      return onWrite();
    }
    return new Response(readFileSync(`public/${new URL(url).pathname.slice(1)}`, "utf8"), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  return { writes, fetchMock };
};

beforeEach(() => {
  resetBudget();
  since.value = "2026-11-21";
});
afterEach(() => vi.unstubAllGlobals());

describe("Tracking before the start date", () => {
  it("writes nothing while MCP_TRACKING_SINCE is null, even with the service role key in the environment", async () => {
    since.value = null;
    stubEnv();
    const { writes } = stubFetch();
    const result = await tool("get_case_study").handler({ slug: "sonor" });
    expect(result.content.length).toBeGreaterThan(0);
    expect(writes).toHaveLength(0);
  });
});

describe("Server-side MCP call tracking", () => {
  it("writes one content-free row per call, with the service role, never the anon key", async () => {
    stubEnv({ SUPABASE_URL: "https://db.example", SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY, SUPABASE_ANON_KEY: "anon-key" });
    const { writes } = stubFetch();
    const result = await tool("get_case_study").handler({ slug: "sonor" });
    expect(result.content.length).toBeGreaterThan(0);
    expect(writes).toHaveLength(1);
    const headers = writes[0].init.headers as Record<string, string>;
    expect(headers.apikey).toBe(SERVICE_KEY);
    expect(headers.Authorization).toBe(`Bearer ${SERVICE_KEY}`);
    expect(JSON.parse(writes[0].init.body as string)).toEqual({ tool: "get_case_study", ok: true });
  });

  it("records ok=false when the tool answers with an error", async () => {
    stubEnv();
    const { writes } = stubFetch();
    const failing = tracked({ name: "get_about", handler: async () => ({ content: [], isError: true }) });
    await failing.handler();
    expect(JSON.parse(writes[0].init.body as string)).toEqual({ tool: "get_about", ok: false });
  });

  it("ignores a tool outside the whitelist", async () => {
    stubEnv();
    const { writes } = stubFetch();
    await tracked({ name: "something_else", handler: async () => ({ content: [] }) }).handler();
    expect(writes).toHaveLength(0);
  });

  it("writes nothing when the service role key is absent", async () => {
    stubEnv({ SUPABASE_URL: "https://db.example" });
    const { writes } = stubFetch();
    const result = await tool("get_case_study").handler({ slug: "sonor" });
    expect(result.content.length).toBeGreaterThan(0);
    expect(writes).toHaveLength(0);
  });

  it("a rejected write does not change the answer", async () => {
    stubEnv();
    const baseline = await (async () => {
      stubFetch();
      return tool("get_case_study").handler({ slug: "sonor" });
    })();
    resetBudget();
    stubFetch(() => Promise.reject(new Error("db down")));
    const withFailure = await tool("get_case_study").handler({ slug: "sonor" });
    expect(withFailure).toEqual(baseline);
  });

  it("a write that throws synchronously does not change the answer", async () => {
    stubEnv();
    const fetchMock = vi.fn((url: string) => {
      if (url.includes("/rest/v1/mcp_calls")) throw new Error("boom");
      return Promise.resolve(new Response(readFileSync(`public/${new URL(url).pathname.slice(1)}`, "utf8"), { status: 200 }));
    });
    vi.stubGlobal("fetch", fetchMock);
    const result = await tool("get_case_study").handler({ slug: "sonor" });
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.isError).toBeUndefined();
  });

  it(`stops writing after ${MCP_WRITES_PER_MINUTE} rows in a minute and still answers`, async () => {
    stubEnv();
    const { writes } = stubFetch();
    const handler = tool("get_case_study").handler;
    for (let i = 0; i < MCP_WRITES_PER_MINUTE + 5; i++) {
      const result = await handler({ slug: "sonor" });
      expect(result.content.length).toBeGreaterThan(0);
    }
    expect(writes).toHaveLength(MCP_WRITES_PER_MINUTE);
  });
});

describe("The counter cannot be written from outside", () => {
  const sql = readFileSync("drizzle/migrations/0010_mcp_calls_server_side.sql", "utf8");

  it("migration: RLS on, no policy, nothing granted to anon or authenticated", () => {
    expect(sql).toMatch(/ALTER TABLE public\.mcp_calls ENABLE ROW LEVEL SECURITY/);
    expect(sql).not.toMatch(/CREATE POLICY/i);
    expect(sql).toMatch(/REVOKE ALL ON public\.mcp_calls FROM PUBLIC, anon, authenticated/);
    expect(sql).not.toMatch(/GRANT[^;]*mcp_calls[^;]*\b(anon|authenticated)\b/i);
    expect(sql).toMatch(/REVOKE INSERT[^;]*ON public\.mcp_events FROM[^;]*anon/);
  });

  it("migration: stores the tool (whitelisted), the success flag and the time, nothing else", () => {
    const columns = [...sql.matchAll(/^\s{2}(\w+) (uuid|timestamptz|text|boolean)/gm)].map((m) => m[1]);
    expect(columns).toEqual(["id", "created_at", "tool", "ok"]);
    expect(sql).toMatch(/CHECK \(tool IN \('list_case_studies','get_case_study','get_about','list_journal_entries','get_journal_entry'\)\)/);
  });

  it("MCP sources never use the public anon key", () => {
    const source = readFileSync("src/lib/mcp/track.ts", "utf8");
    expect(source).not.toMatch(/ANON/);
    expect(source).toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
  });
});
