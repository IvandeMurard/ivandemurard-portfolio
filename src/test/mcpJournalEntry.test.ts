import { describe, expect, it } from "vitest";
import { JOURNAL_ENTRIES } from "../content/journal";
import tool, { renderEntryBody, renderEntryHeader, renderEntryMarkdown, tableKey, tableRuns } from "../lib/mcp/tools/get-journal-entry";

type Result = { content: { type: string; text: string }[]; structuredContent?: unknown; isError?: boolean };
const call = (slug: string) => (tool as unknown as { handler: (a: { slug: string }) => Result }).handler({ slug });

describe("get_journal_entry payload", () => {
  it("returns one text content: the header, a blank line, then the body once", () => {
    for (const e of JOURNAL_ENTRIES) {
      const r = call(e.slug);
      expect(r.content).toHaveLength(1);
      expect(r.content[0].type).toBe("text");
      expect(r.content[0].text).toBe(`${renderEntryHeader(e)}\n\n${renderEntryBody(e)}`);
      expect(r.content[0].text.split(renderEntryBody(e))).toHaveLength(2);
      expect(r.content[0].text).toContain(`Source: https://ivandemurard.com/journal/${e.slug}`);
    }
  });
  it("has no structuredContent and no outputSchema", () => {
    expect(tool).not.toHaveProperty("outputSchema");
    for (const e of JOURNAL_ENTRIES) expect(call(e.slug)).not.toHaveProperty("structuredContent");
  });
  it("starts with seven fixed Key: value lines a program can parse", () => {
    const keys = ["Title", "Subtitle", "Date", "Category", "Reading time", "URL", "Markdown URL"];
    for (const e of JOURNAL_ENTRIES) {
      const lines = call(e.slug).content[0].text.split("\n");
      expect(lines.slice(0, 7).map((l) => l.slice(0, l.indexOf(": ")))).toEqual(keys);
      expect(lines[7]).toBe("");
      const value = (k: string) => lines[keys.indexOf(k)].slice(k.length + 2);
      expect(value("Title")).toBe(e.title);
      expect(value("Date")).toBe(e.date);
      expect(value("Category")).toBe(e.category);
      expect(value("URL")).toBe(`https://ivandemurard.com/journal/${e.slug}`);
    }
  });
  it("shows none for an absent optional field and the full URL for a mirror", () => {
    const base = { ...JOURNAL_ENTRIES[0], subtitle: undefined, readingMinutes: undefined, mirror: undefined };
    const header = renderEntryHeader(base).split("\n");
    expect(header[1]).toBe("Subtitle: none");
    expect(header[4]).toBe("Reading time: none");
    expect(header[6]).toBe("Markdown URL: none");
    expect(renderEntryHeader({ ...base, readingMinutes: 12, mirror: "/journal/x.md" }).split("\n").slice(4).filter((_, i) => i !== 1))
      .toEqual(["Reading time: 12 min", "Markdown URL: https://ivandemurard.com/journal/x.md"]);
  });
  it("keeps the markdown mirror format unchanged: heading, subtitle, dateline, then the body", () => {
    for (const e of JOURNAL_ENTRIES) {
      const md = renderEntryMarkdown(e);
      expect(md.startsWith(`# ${e.title}\n\n`)).toBe(true);
      expect(md.endsWith(renderEntryBody(e))).toBe(true);
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
      const tables = tableRuns(call(e.slug).content[0].text).map(tableKey);
      const repeated = tables.filter((t, i) => tables.indexOf(t) !== i);
      expect(repeated.map((t) => t.split("\n")[0])).toEqual([]);
    });
  }
  it("prints the first table of whose-truth-is-the-ground-truth once", () => {
    const e = JOURNAL_ENTRIES.find((x) => x.slug === "whose-truth-is-the-ground-truth")!;
    const md = call(e.slug).content[0].text;
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
