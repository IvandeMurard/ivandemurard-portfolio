import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import mcp from "../lib/mcp";

afterEach(() => vi.unstubAllGlobals());

describe("Suspended MCP tracking", () => {
  for (const tool of mcp.tools) {
    it(`${tool.name} answers without submitting a tracking event`, async () => {
      const fetchMock = vi.fn(async (url: string) => {
        const path = new URL(url).pathname.slice(1);
        return new Response(readFileSync(`public/${path}`, "utf8"), { status: 200 });
      });
      vi.stubGlobal("fetch", fetchMock);
      vi.stubGlobal("Deno", { env: { get: (key: string) => key === "SUPABASE_URL" ? "https://tracking.example" : "public-test-key" } });
      const slug = tool.name === "get_case_study" ? "sonor" : "harnesses-graders-closed-loops";
      const handler = tool.handler as unknown as (args: { slug: string }) => Promise<{ content: unknown[] }>;
      const result = await handler({ slug });
      expect(result.content.length).toBeGreaterThan(0);
      for (const call of fetchMock.mock.calls) {
        expect(new URL(call[0]).pathname).not.toContain("/rest/v1/");
      }
    });
  }
});