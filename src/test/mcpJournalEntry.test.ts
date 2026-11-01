import { describe, expect, it } from "vitest";
import { JOURNAL_ENTRIES } from "../content/journal";
import tool, { renderEntryMarkdown, tableKey, tableRuns } from "../lib/mcp/tools/get-journal-entry";

type Result = { content: { type: string; text: string }[]; structuredContent: Record<string, unknown>; isError?: boolean };
const call = (slug: string) => (tool as unknown as { handler: (a: { slug: string }) => Result }).handler({ slug });

describe("get_journal_entry payload", () => {
  it("returns the entry once, as Markdown in the text content", () => {
    for (const e of JOURNAL_ENTRIES) {
      const r = call(e.slug);
      expect(r.content).toHaveLength(1);
      expect(r.content[0].text).toBe(renderEntryMarkdown(e));
      expect(r.content[0].text).toContain(`Source: https://ivandemurard.com/journal/${e.slug}`);
    }
  });
  it("keeps only the short metadata in structuredContent, with no body in any form", () => {
    for (const e of JOURNAL_ENTRIES) {
      const s = call(e.slug).structuredContent;
      expect(Object.keys(s).sort()).toEqual(
        ["category", "date", "excerpt", "markdown_url", "reading_minutes", "slug", "subtitle", "title", "url"],
      );
      expect(s).not.toHaveProperty("body");
      expect(s).not.toHaveProperty("body_text");
    }
  });
  it("keeps the harnesses response under 55,000 characters", () => {
    expect(JSON.stringify(call("harnesses-graders-closed-loops")).length).toBeLessThan(55_000);
  });
  it("still reports an unknown slug as an error", () => {
    const r = call("no-such-note");
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toContain("Unknown Field Note slug");
  });
});

describe("Field Note Markdown: no table is emitted twice", () => {
  for (const e of JOURNAL_ENTRIES) {
    it(`${e.slug} has no repeated table`, () => {
      const tables = tableRuns(renderEntryMarkdown(e)).map(tableKey);
      const repeated = tables.filter((t, i) => tables.indexOf(t) !== i);
      expect(repeated.map((t) => t.split("\n")[0])).toEqual([]);
    });
  }
  it("prints the first table of whose-truth-is-the-ground-truth once", () => {
    const e = JOURNAL_ENTRIES.find((x) => x.slug === "whose-truth-is-the-ground-truth")!;
    const md = renderEntryMarkdown(e);
    const header = "| Line | Station | Kind of truth | What it is | When |";
    expect(md.split(header)).toHaveLength(2);
    expect(md).toContain("| Aetherix | Next day | Observed | real covers | next day |");
  });
  it("treats tables that differ only in spacing or apostrophes as the same table", () => {
    expect(tableKey("| a |\n|---|\n| it’s |")).toBe(tableKey("| a |\n| --- |\n| it's |"));
    expect(tableKey("| a |\n| --- |\n| 1 |")).not.toBe(tableKey("| a |\n| --- |\n| 2 |"));
  });
  it("tableRuns splits adjacent tables separated by text", () => {
    expect(tableRuns("a\n\n| x |\n| --- |\n| 1 |\n\nb\n\n| y |")).toEqual(["| x |\n| --- |\n| 1 |", "| y |"]);
  });
});
