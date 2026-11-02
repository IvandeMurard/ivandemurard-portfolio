import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { PATTERNS, applyAllowlist, loadAllowlist, report, scanSite, scanSource, stripComments, type AllowEntry, type PatternId } from "../../scripts/style-check";

// docs/style.md §5. This test is red while the site copy has hits. A hit is fixed in the copy, or recorded in
// docs/style-allowlist.json with a one-line reason that Ivan reviews. The list starts empty and nothing is
// allowlisted automatically. Run `bunx tsx scripts/style-check.ts` for the same report outside vitest.

const patternsIn = (file: string, source: string): PatternId[] => [...new Set(scanSource(file, source).map((h) => h.pattern))];

describe("style checker: it finds the examples in docs/style.md §2", () => {
  const caught: Array<[PatternId, string]> = [
    ["theatrical-fragment", 'const a = "Rose is a project. Not selling. Explaining, reformulating, contextualising.";'],
    ["theatrical-fragment", 'const a = "Rose offers a call. His call.";'],
    ["self-aware-aside", 'const a = "I would rather say so.";'],
    ["self-aware-aside", 'const a = "We show results rather than calling them features.";'],
    ["rhythm-triad", 'const a = "One platform. Fully configurable. Ready for your team.";'],
    ["contrast-reflex", 'const a = "Contact is an optional outcome, not the goal of every answer.";'],
    ["contrast-reflex", 'const a = "It is not a demo, but a working loop.";'],
    ["colon-reveal", 'const a = "What I changed: her goal.";'],
    ["mood-word", 'const a = "A quiet dock.";'],
    ["mood-word", 'const a = "An honest account.";'],
    ["mood-word", 'const a = "Narrow on purpose.";'],
    ["mood-word", 'const a = "The part everyone skips.";'],
    ["dot-chain", 'const a = "Case study · AI service design · Rose";'],
    ["em-dash", 'const a = "A pause — and a second.";'],
  ];
  for (const [pattern, source] of caught) {
    it(`${pattern}: ${source.slice(11, 60)}`, () => expect(patternsIn("src/content/x.ts", source)).toContain(pattern));
  }

  it("leaves the replacements in docs/style.md alone", () => {
    const clean = [
      'const a = "Rose explains, rephrases and puts the work in context; she does not sell.";',
      'const a = "I changed her goal.";',
      'const a = "Aetherix ran from 2025 · 4 min read";',
    ];
    for (const source of clean) expect(scanSource("src/content/x.ts", source)).toEqual([]);
  });

  it("does not take abbreviations, comments or URLs for style hits", () => {
    expect(scanSource("src/content/x.ts", 'const a = "Use a model, e.g. The Prophet model fits well here. See https://example.com/a for more.";')).toEqual([]);
    expect(scanSource("src/content/x.ts", "// A pause — in a comment. Quiet.\n/* honest — */\nconst a = 1;")).toEqual([]);
    expect(stripComments("a // b\nc /* d\ne */ f")).toBe("a     \nc     \n     f");
  });
});

describe("style checker: italic", () => {
  it("flags italic outside a hero headline, in classes and tags", () => {
    expect(patternsIn("src/pages/X.tsx", '<h2 className="font-headline italic text-3xl">Title</h2>')).toContain("italic");
    expect(patternsIn("src/pages/X.tsx", '<p className="md:italic">Body</p>')).toContain("italic");
    expect(patternsIn("src/pages/X.tsx", "<p>Some <em>stress</em></p>")).toContain("italic");
  });
  it("allows italic inside the page <h1>, and ignores not-italic", () => {
    const hero = '<h1 className="font-headline">\n  A message <span className="italic">in one phrase</span>\n</h1>';
    expect(scanSource("src/pages/X.tsx", hero)).toEqual([]);
    expect(scanSource("src/pages/X.tsx", '<p className="not-italic">Body</p>')).toEqual([]);
  });
  it("flags Markdown italics but not bold, list markers or code", () => {
    expect(patternsIn("public/x.md", "A line with *emphasis* in it.")).toContain("italic");
    expect(patternsIn("public/x.md", "A line with _emphasis_ in it.")).toContain("italic");
    expect(scanSource("public/x.md", "A **bold** line.\n* a list item\n`code *x* here`\n```\n*x*\n```\nfile_name_here")).toEqual([]);
  });
});

describe("style checker: allowlist", () => {
  it("is a list, starts empty and holds only entries with a reason", () => {
    const allow = loadAllowlist();
    expect(Array.isArray(allow)).toBe(true);
    for (const entry of allow) {
      expect(entry.reason.trim().length, JSON.stringify(entry)).toBeGreaterThan(0);
      expect(Object.keys(PATTERNS)).toContain(entry.pattern);
    }
  });
  it("is committed empty: nothing is allowlisted until Ivan reviews an entry", () => {
    expect(readFileSync("docs/style-allowlist.json", "utf8").trim()).toBe("[]");
  });
  it("removes a recorded hit and reports an entry that no longer matches anything", () => {
    const hits = [{ file: "src/content/x.ts", line: 3, pattern: "mood-word" as const, text: "quiet" }];
    const match: AllowEntry = { file: "src/content/x.ts", pattern: "mood-word", text: "quiet", reason: "product term" };
    const stale: AllowEntry = { file: "src/content/y.ts", pattern: "mood-word", text: "quiet", reason: "gone" };
    expect(applyAllowlist(hits, [match, stale])).toEqual({ remaining: [], unused: [stale] });
    expect(applyAllowlist(hits, [])).toEqual({ remaining: hits, unused: [] });
  });
});

describe("site copy follows docs/style.md §2 and §3", () => {
  it("has no hit that is not allowlisted, and no stale allowlist entry", () => {
    const { remaining, unused } = applyAllowlist(scanSite(), loadAllowlist());
    expect(unused, "allowlist entries that match nothing: remove them").toEqual([]);
    expect(remaining.length, `\n${report(remaining)}\n`).toBe(0);
  });
});
