import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JOURNAL_ENTRIES } from "../content/journal";
import getAbout from "../lib/mcp/tools/get-about";
import getCaseStudy from "../lib/mcp/tools/get-case-study";
import getJournalEntry from "../lib/mcp/tools/get-journal-entry";
import listCaseStudies from "../lib/mcp/tools/list-case-studies";
import listJournal from "../lib/mcp/tools/list-journal";

// Contract: a tool that returns structuredContent must not make clients choose between two payloads.
// 1. Every field of structuredContent also appears in the text content.
// 2. The text holds nothing that structuredContent lacks.
// The text is an optional header of "Key: value" lines, a blank line, then either JSON (compared by its
// leaf values) or Markdown (which must be contained in one structured string).

type Result = { content: { type: string; text: string }[]; structuredContent?: unknown; isError?: boolean };
type Call = { name: string; run: () => Promise<Result> | Result };

const run = (tool: unknown, args: object = {}) => async () => (tool as { handler: (a: object) => Promise<Result> | Result }).handler(args);

const CASE_STUDIES = ["sonor", "aetherix", "tacet", "lore", "anima", "compass"];

const CALLS: Call[] = [
  { name: "get_about", run: run(getAbout) },
  { name: "list_case_studies", run: run(listCaseStudies) },
  { name: "list_journal_entries", run: run(listJournal) },
  ...CASE_STUDIES.map((slug) => ({ name: `get_case_study (${slug})`, run: run(getCaseStudy, { slug }) })),
  ...JOURNAL_ENTRIES.map((e) => ({ name: `get_journal_entry (${e.slug})`, run: run(getJournalEntry, { slug: e.slug }) })),
];

const leaves = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === "string" || typeof value === "number") out.push(String(value));
  else if (Array.isArray(value)) value.forEach((v) => leaves(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => leaves(v, out));
  return out;
};

const KEY_VALUE = /^[A-Z][A-Za-z ]*: (.*)$/;

/** Splits a text into its leading "Key: value" lines (ended by a blank line) and the rest. */
const splitHeader = (text: string): { values: string[]; rest: string } => {
  const lines = text.split("\n");
  const end = lines.indexOf("");
  const head = end > 0 ? lines.slice(0, end) : [];
  if (head.length === 0 || !head.every((l) => KEY_VALUE.test(l))) return { values: [], rest: text };
  return { values: head.map((l) => l.match(KEY_VALUE)![1]), rest: lines.slice(end + 1).join("\n") };
};

/** What the contract finds wrong with one tool result; empty when it holds. */
export const violations = (result: Result): string[] => {
  if (result.structuredContent === undefined) return [];
  const text = result.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
  const structured = new Set(leaves(result.structuredContent));
  const { values, rest } = splitHeader(text);
  const found: string[] = [];
  let parsed: unknown;
  try { parsed = JSON.parse(rest); } catch { parsed = undefined; }

  const inText = new Set(values);
  if (parsed !== undefined) {
    for (const v of leaves(parsed)) inText.add(v);
    for (const v of inText) if (!structured.has(v)) found.push(`in text, not in structuredContent: ${v.slice(0, 60)}`);
    for (const v of structured) if (!inText.has(v)) found.push(`in structuredContent, not in text: ${v.slice(0, 60)}`);
  } else {
    for (const v of values) if (!structured.has(v)) found.push(`in text, not in structuredContent: ${v.slice(0, 60)}`);
    if (rest.trim() && ![...structured].some((v) => v.includes(rest))) found.push("the Markdown is not contained in any structuredContent field");
    for (const v of structured) if (!text.includes(v)) found.push(`in structuredContent, not in text: ${v.slice(0, 60)}`);
  }
  return found;
};

afterEach(() => vi.unstubAllGlobals());

/** Serves the real published Markdown from public/ instead of the network. */
const stubFetchWithRealBodies = () =>
  vi.stubGlobal("fetch", async (url: string) => {
    const file = new URL(url).pathname.slice(1);
    return new Response(readFileSync(`public/${file}`, "utf8"), { status: 200 });
  });

describe("MCP tools: text and structuredContent carry the same information", () => {
  it("detects a field that only structuredContent has, and text that only the text has", () => {
    const json = (o: unknown) => ({ type: "text", text: JSON.stringify(o) });
    expect(violations({ content: [json({ a: 1 })], structuredContent: { a: 1, b: "x" } })).toHaveLength(1);
    expect(violations({ content: [json({ a: 1, b: "x" })], structuredContent: { a: 1 } })).toHaveLength(1);
    expect(violations({ content: [json({ a: 1 })], structuredContent: { a: 1 } })).toEqual([]);
    expect(violations({ content: [{ type: "text", text: "plain" }] })).toEqual([]);
  });

  it("detects a header line or a Markdown body that structuredContent lacks", () => {
    const md = (text: string) => ({ content: [{ type: "text", text }], structuredContent: { slug: "s", markdown: "# Body" } });
    expect(violations(md("Slug: s\n\n# Body"))).toEqual([]);
    expect(violations(md("Slug: s\nExtra: yes\n\n# Body"))).toHaveLength(1);
    expect(violations(md("Slug: s\n\n# Body\n\nand more"))).toHaveLength(1);
    expect(violations(md("# Body"))).toHaveLength(1);
  });

  for (const { name, run: go } of CALLS) {
    it(name, async () => {
      stubFetchWithRealBodies();
      expect(violations(await go())).toEqual([]);
    });
  }
});

describe("get_case_study and list_journal_entries text header", () => {
  it("get_case_study starts with Slug, Group when present, Source URL, Canonical URL, then the Markdown once", async () => {
    stubFetchWithRealBodies();
    for (const slug of CASE_STUDIES) {
      const r = await run(getCaseStudy, { slug })();
      const sc = r.structuredContent as { markdown: string };
      const lines = r.content[0].text.split("\n");
      const keys = slug === "compass" ? ["Slug", "Group", "Source URL", "Canonical URL"] : ["Slug", "Source URL", "Canonical URL"];
      expect(lines.slice(0, keys.length).map((l) => l.slice(0, l.indexOf(": ")))).toEqual(keys);
      expect(lines[keys.length]).toBe("");
      expect(r.content[0].text.endsWith(`\n\n${sc.markdown}`)).toBe(true);
      expect(r.content[0].text.split(sc.markdown)).toHaveLength(2);
    }
  });
  it("list_journal_entries starts with Index URL, Corpus URL, Reading note, then the entries", async () => {
    const r = await run(listJournal)();
    const lines = r.content[0].text.split("\n");
    expect(lines.slice(0, 3).map((l) => l.slice(0, l.indexOf(": ")))).toEqual(["Index URL", "Corpus URL", "Reading note"]);
    expect(lines[3]).toBe("");
    const entries = (r.structuredContent as { entries: unknown[] }).entries;
    expect(JSON.parse(lines.slice(4).join("\n"))).toEqual(entries);
  });
});
