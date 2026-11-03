import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { PATTERNS, applyAllowlist, compareToBaseline, countHits, describeChanges, formatBaseline, loadAllowlist, loadBaseline, scanSite, scanSource, stripComments, totalOf, type AllowEntry, type Baseline, type PatternId } from "../../scripts/style-check";

// docs/style.md §5. A ratchet: docs/style-baseline.json records the hits per file and per pattern. The test
// fails if a count goes up or a new file gets a hit, and when a count goes down it asks for the baseline to be
// lowered in the same commit. Never raise the baseline to pass: fix the copy. A hit is also fixed by recording
// it in docs/style-allowlist.json with a one-line reason that Ivan reviews; nothing is allowlisted automatically.
// Run `bunx tsx scripts/style-check.ts` for the full report, `--lower` to write lowered counts.

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

describe("style checker: what is not a theatrical fragment", () => {
  const fragments = (source: string) => scanSource("src/content/x.ts", source).filter((h) => h.pattern === "theatrical-fragment");
  it("excludes a project status label", () => {
    expect(fragments('const a = "Pilot-ready. Staged on Fly.io and connected to the Apaleo sandbox.";')).toEqual([]);
    expect(fragments('const a = "Compliance Gated. Deployment is frozen until the assessment clears.";')).toEqual([]);
  });
  it("excludes an evidence marker and the Synthetic PoC opener", () => {
    expect(fragments('const a = "Design. Named in the contract, no code.";')).toEqual([]);
    expect(fragments('const a = "Synthetic PoC. Architecture ready, deployment frozen.";')).toEqual([]);
  });
  it("excludes a UI control label", () => {
    expect(fragments('const a = "Show details. The panel opens below the card.";')).toEqual([]);
  });
  it("excludes a metadata line that carries a date stamp", () => {
    expect(fragments("const meta = (date: string) => `Public. Read-only. No key. Last updated ${date}.`;")).toEqual([]);
  });
  it("still catches a real fragment", () => {
    expect(fragments('const a = "Every grader passed. Six yeses.";').map((h) => h.text)).toEqual(["Six yeses."]);
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

describe("style checker: the ratchet", () => {
  const base: Baseline = { "src/a.ts": { "em-dash": 2, italic: 1 }, "src/b.ts": { "mood-word": 1 } };
  it("passes an equal count, and lists a lowered one, including a file that reached 0", () => {
    expect(compareToBaseline(base, base)).toEqual({ raised: [], lowered: [] });
    const now: Baseline = { "src/a.ts": { "em-dash": 1, italic: 1 } };
    expect(compareToBaseline(now, base).lowered).toEqual([
      { file: "src/a.ts", pattern: "em-dash", was: 2, now: 1 },
      { file: "src/b.ts", pattern: "mood-word", was: 1, now: 0 },
    ]);
    expect(compareToBaseline(now, base).raised).toEqual([]);
  });
  it("fails a raised count, a new pattern in a known file and a new file", () => {
    const now: Baseline = { "src/a.ts": { "em-dash": 3, italic: 1, "dot-chain": 1 }, "src/b.ts": { "mood-word": 1 }, "src/c.ts": { italic: 1 } };
    expect(compareToBaseline(now, base).raised).toEqual([
      { file: "src/a.ts", pattern: "em-dash", was: 2, now: 3 },
      { file: "src/a.ts", pattern: "dot-chain", was: 0, now: 1 },
      { file: "src/c.ts", pattern: "italic", was: 0, now: 1 },
    ]);
  });
  it("counts hits per file and per pattern, and writes them sorted without zeros", () => {
    const hits = [
      { file: "b.ts", line: 1, pattern: "italic" as const, text: "" },
      { file: "a.ts", line: 1, pattern: "em-dash" as const, text: "" },
      { file: "a.ts", line: 9, pattern: "em-dash" as const, text: "" },
    ];
    expect(countHits(hits)).toEqual({ "b.ts": { italic: 1 }, "a.ts": { "em-dash": 2 } });
    expect(totalOf(countHits(hits))).toBe(3);
    expect(formatBaseline(countHits(hits))).toBe('{\n  "a.ts": {\n    "em-dash": 2\n  },\n  "b.ts": {\n    "italic": 1\n  }\n}\n');
  });
  it("the committed baseline is well formed: known patterns, positive whole counts", () => {
    for (const [file, row] of Object.entries(loadBaseline())) {
      for (const [pattern, n] of Object.entries(row)) {
        expect(Object.keys(PATTERNS), `${file}: ${pattern}`).toContain(pattern);
        expect(Number.isInteger(n) && (n as number) > 0, `${file}: ${pattern}`).toBe(true);
      }
    }
  });
});

describe("site copy follows docs/style.md §2 and §3", () => {
  const { remaining, unused } = applyAllowlist(scanSite(), loadAllowlist());
  const baseline = loadBaseline();
  const { raised, lowered } = compareToBaseline(countHits(remaining), baseline);

  it("has no stale allowlist entry", () => {
    expect(unused, "allowlist entries that match nothing: remove them").toEqual([]);
  });
  it("has no style hit above the baseline, and no new file with a hit", () => {
    expect(raised, `\nFix the copy. Never raise docs/style-baseline.json.\n${describeChanges(raised)}\n`).toEqual([]);
  });
  it("has locked every gain: lower docs/style-baseline.json in the same commit", () => {
    expect(lowered, `\nCounts went down. Run: bunx tsx scripts/style-check.ts --lower, and commit docs/style-baseline.json.\n${describeChanges(lowered)}\n`).toEqual([]);
  });
  it("reports what remains", () => {
    console.log(`Style hits remaining: ${remaining.length} (baseline ${totalOf(baseline)}, ${Object.keys(countHits(remaining)).length} file(s))`);
    expect(remaining.length).toBeLessThanOrEqual(totalOf(baseline));
  });
});
