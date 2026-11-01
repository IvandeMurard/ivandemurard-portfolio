import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { CLOSE, GOT_WRONG, IDEA, MILESTONES, REPO_URL } from "@/components/rose/RoseCaseStudy";

const deck = readFileSync("docs/rose-case-study-copy.md", "utf8");

const strings = (m: (typeof MILESTONES)[string]) => [
  m.brief, m.tension, m.decision, m.result, m.source, m.note,
  m.vignette.caption, m.vignette.b, m.vignette.a, m.vignette.mb, m.vignette.ma,
  ...[...m.vignette.before, ...m.vignette.after].flatMap((i) => ("chips" in i ? i.chips : [i.text])),
];

describe("Rose case study §6.3 chapters 01 to 05", () => {
  it("has exactly the five milestones, in order", () => {
    expect(Object.keys(MILESTONES)).toEqual(["ch-01", "ch-02", "ch-03", "ch-04", "ch-05"]);
  });
  it("uses only text that appears in the copy deck", () => {
    for (const m of Object.values(MILESTONES)) for (const s of strings(m)) expect(deck, s).toContain(s);
  });
  it("writes each Rose note as a single sentence", () => {
    for (const m of Object.values(MILESTONES)) {
      expect(m.note, m.note).toMatch(/[.!?]$/);
      expect(m.note.slice(0, -1), m.note).not.toMatch(/[.!?]/);
    }
  });
  it("contains no em-dashes", () => {
    expect(JSON.stringify(MILESTONES)).not.toContain("—");
  });
});

describe("Rose case study §6.2 chapter 00", () => {
  const p3 = Object.values(IDEA.p3).map((v) => (typeof v === "string" ? v : v.text)).join("");
  it("uses only text that appears in the copy deck", () => {
    for (const s of [IDEA.p1, IDEA.p2, p3, IDEA.note, IDEA.p3.anchor.text]) expect(deck, s).toContain(s);
  });
  it("writes the Rose note as a single sentence", () => {
    expect(IDEA.note).toMatch(/[.!?]$/);
    expect(IDEA.note.slice(0, -1)).not.toMatch(/[.!?]/);
  });
  it("links to https addresses and contains no em-dashes", () => {
    expect([IDEA.p3.anchor.href, IDEA.p3.second.href].every((h) => h.startsWith("https://"))).toBe(true);
    expect(JSON.stringify(IDEA)).not.toContain("—");
  });
});

describe("Rose case study §6.9 close", () => {
  it("uses only text that appears in the copy deck", () => {
    for (const s of [CLOSE.askLabel, CLOSE.askQuestion, CLOSE.line, CLOSE.kicker, CLOSE.headingLead + CLOSE.headingEm, CLOSE.subline]) expect(deck, s).toContain(s);
    for (const b of CLOSE.buttons) expect(deck, b).toContain(`"${b}"`);
  });
  it("starts the italic copper part of the heading at \"I design\" and has no em-dashes", () => {
    expect(CLOSE.headingEm.startsWith("I design")).toBe(true);
    expect(JSON.stringify(CLOSE)).not.toContain("\u2014");
  });
  it("hard-codes no destination", () => {
    expect(JSON.stringify(CLOSE)).not.toMatch(/https?:|mailto:|\.pdf/);
  });
});

describe("Rose case study §6.6 chapter 08", () => {
  const g = GOT_WRONG;
  const texts = [
    g.intro, ...g.labels.map((l) => l), g.note, g.judgedLabel, g.judged, g.dimensions.join(", "), g.campaign, g.campaignLink,
    ...g.cases.flatMap((c) => [c.meta, c.said, c.changed, c.result.join("")]),
    ...g.rules.flatMap(([t, d]) => [t, d]),
  ];
  it("uses only text that appears in the copy deck", () => {
    for (const s of texts) expect(deck, s).toContain(s);
  });
  it("writes the case 2 note as a single sentence", () => {
    expect(g.note).toMatch(/[.!?]$/);
    expect(g.note.slice(0, -1)).not.toMatch(/[.!?]/);
  });
  it("states the Limit line and the campaign line as validated", () => {
    expect(g.rules[2]).toEqual(["Limit", "Ordinary cases: 5 samples, pass at 4. High-risk cases: 20 samples, no critical failure allowed. Usage logs are not proof of correctness."]);
    expect(g.campaign).toBe("29 Oct campaign · 105 answers · 10 cases · 2 high-risk cases, 0 critical failures in 20 samples each");
    expect(g.judged.endsWith("Answers are graded with AI assistance against the published sources, then reviewed by me.")).toBe(true);
  });
  it("links exactly the two cited figures, both to the evaluation file", () => {
    const linked = g.cases.filter((c) => c.result.length === 3).map((c) => c.result[1]);
    expect(linked).toEqual(["9 of 10", "15 open-ended answers"]);
  });
  it("matches its figures to the committed evaluation file", () => {
    const evalDoc = readFileSync(g.evalDoc, "utf8");
    expect(evalDoc).toContain("105 answers, 10 cases");
    expect(evalDoc).toContain("0 wrong answers in 20");
    expect(evalDoc).toContain("0 access claims and 0 unwanted booking cards in 20");
    expect(evalDoc).toContain("she passed 9 of 10");
    const answers = JSON.parse(readFileSync("docs/rose-eval-2026-10-29.answers.json", "utf8")) as { case: string; page: string }[];
    expect(answers).toHaveLength(105);
    const openEnded = answers.filter((a) => a.page === "/aetherix" && a.case !== "referent-aetherix");
    expect(openEnded).toHaveLength(15);
  });
  it("prints the sources line as in the deck and links only files that exist", () => {
    expect(deck).toContain(`${g.sourcesLead}${g.sources.map((s) => s.label).join(", ")}${g.sourcesTail}`);
    for (const s of g.sources) expect(existsSync(s.path), s.path).toBe(true);
    expect(existsSync(g.evalDoc)).toBe(true);
    expect(REPO_URL).toBe("https://github.com/IvandeMurard/ivandemurard-portfolio");
  });
  it("contains no em-dashes", () => {
    expect(JSON.stringify(g)).not.toContain("\u2014");
  });
});

describe("Rose reports: 'Read this first' anchors", () => {
  // GitHub heading slug: lowercase, keep letters, digits, spaces, hyphens, underscores; spaces become hyphens; repeats get -1, -2.
  const slugsOf = (file: string) => {
    const seen: Record<string, number> = {};
    return readFileSync(file, "utf8").split(/\r?\n/).flatMap((line) => {
      const m = line.match(/^#{1,6}\s+(.*)$/);
      if (!m) return [];
      const base = m[1].trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
      const n = seen[base] ?? 0;
      seen[base] = n + 1;
      return [n ? `${base}-${n}` : base];
    });
  };
  for (const file of ["docs/rose-p4-evaluation.md", "docs/rose-p5-verification.md", "docs/rose-stage-b-remediation.md"]) {
    it(`${file}: every link in the block resolves`, () => {
      const lines = readFileSync(file, "utf8").split(/\r?\n/);
      const block = lines.slice(lines.findIndex((l) => l.startsWith("**Read this first.**"))).slice(0, 4).join("\n");
      const links = [...block.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
      expect(links.length).toBeGreaterThan(0);
      for (const href of links) {
        const [target, anchor] = href.split("#");
        const targetFile = target ? `docs/${target}` : file;
        expect(existsSync(targetFile), href).toBe(true);
        if (anchor) expect(slugsOf(targetFile), href).toContain(anchor);
      }
    });
  }
});
