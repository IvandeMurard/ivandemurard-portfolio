import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { CLOSE, GOT_WRONG, IDEA, MILESTONES, NEXT, QUESTIONS, REPO_URL, SIX, TRUST, replyHref } from "@/components/rose/RoseCaseStudy";
import { CONTACT } from "@/content/site";

// Copy deck v2 is the copy source. What v2 leaves unchanged (vignettes, source lines, dates, the evaluation block,
// the data contract) is still checked against v1, and the four open questions against the brief (§6.8).
const norm = (x: string) => x.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
const deck = norm(readFileSync("docs/rose-case-study-copy-v2.md", "utf8"));
const deckV1 = readFileSync("docs/rose-case-study-copy.md", "utf8");
const brief = readFileSync("docs/rose-case-study.md", "utf8");

const vignetteStrings = (m: (typeof MILESTONES)[string]) => [
  m.source,
  m.vignette.caption, m.vignette.b, m.vignette.a, m.vignette.mb, m.vignette.ma,
  ...[...m.vignette.before, ...m.vignette.after].flatMap((i) => ("chips" in i ? i.chips : [i.text])),
];

describe("Rose case study §6.3 chapters 01 to 05", () => {
  it("has exactly the five milestones, in order", () => {
    expect(Object.keys(MILESTONES)).toEqual(["ch-01", "ch-02", "ch-03", "ch-04", "ch-05"]);
  });
  it("uses only copy that appears in deck v2, and vignettes and sources as in v1", () => {
    for (const m of Object.values(MILESTONES)) {
      for (const s of [m.brief, m.tension, m.decision, m.result, m.note, ...(m.tradeoff ? [m.tradeoff] : [])]) expect(deck, s).toContain(norm(s));
      for (const s of vignetteStrings(m)) expect(deckV1, s).toContain(s);
    }
  });
  it("adds the business trade-off to chapter 01 only", () => {
    expect(Object.entries(MILESTONES).filter(([, m]) => m.tradeoff).map(([id]) => id)).toEqual(["ch-01"]);
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
    for (const s of [IDEA.p1, IDEA.p2, p3, IDEA.note, IDEA.p3.anchor.text]) expect(deck, s).toContain(norm(s));
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
  it("uses only text that appears in deck v2", () => {
    for (const s of [CLOSE.askLabel, CLOSE.askQuestion, CLOSE.line, CONTACT.kicker, CONTACT.heading, CONTACT.subline]) expect(deck, s).toContain(s);
    expect(deck).toContain(Object.values(CONTACT.buttons).join(" · "));
  });
  it("hard-codes no destination in the Ask Rose block and has no em-dashes", () => {
    expect(JSON.stringify(CLOSE)).not.toMatch(/https?:|mailto:|\.pdf/);
    expect(JSON.stringify(CLOSE) + JSON.stringify(CONTACT)).not.toContain("\u2014");
  });
});

describe("Rose case study §6.6 chapter 08", () => {
  const g = GOT_WRONG;
  const v2 = [g.intro, ...g.labels, g.note, g.cost.text, g.cost.source, ...g.cases.flatMap((c) => [c.said, c.changed, c.result.join("")])];
  const v1 = [...g.cases.map((c) => c.meta), g.judgedLabel, g.judged, g.dimensions.join(", "), g.campaign, g.campaignLink, ...g.rules.flatMap(([t, d]) => [t, d])];
  it("uses only text that appears in deck v2, and the unchanged evaluation block as in v1", () => {
    for (const s of v2) expect(deck, s).toContain(norm(s));
    for (const s of v1) expect(deckV1, s).toContain(s);
  });
  it("prints the three cases as a table of three columns, and the cost block after it", () => {
    expect(g.labels).toEqual(["She said", "What I changed", "Result"]);
    expect(g.cases).toHaveLength(3);
    expect(g.cost.text).toContain("0.015 Lovable credits");
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
    expect(deckV1).toContain(`${g.sourcesLead}${g.sources.map((s) => s.label).join(", ")}${g.sourcesTail}`);
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

describe("Rose case study §6.5 chapter 07", () => {
  const t = TRUST;
  it("uses only text that appears in deck v2, and the unchanged data items as in v1", () => {
    expect(deck).toContain(t.intro);
    for (const c of t.contracts) {
      expect(deck, c.title).toContain(c.title);
    }
    expect(t.contracts.map((c) => c.kicker)).toEqual(["Data", "Knowledge"]);
    for (const it of t.contracts[0].items) expect(deckV1, it.parts.join("")).toContain(it.parts.join(""));
    for (const it of t.contracts[1].items) expect(deck, it.parts.join("")).toContain(norm(it.parts.join("")));
    const r = t.rule;
    expect(deck).toContain(r.heading);
    expect(deck).toContain(r.intro);
    expect(deck).toContain(r.question);
    for (const a of r.answers) {
      expect(deck, a.text).toContain(`"${a.text}"`);
      expect(deck, a.note).toContain(a.note);
      expect(deck, a.label).toContain(a.label);
    }
    expect(deck).toContain(norm(r.caption));
  });
  it("marks the chapter items as in the deck: Built, Built, Built, Built, Built, Validation", () => {
    expect(t.contracts.flatMap((c) => c.items.map((i) => i.mark))).toEqual(["Built", "Built", "Built", "Built", "Built", "Validation"]);
  });
  it("states the validation item and links only the word tested, to the evaluation file", () => {
    const v = t.contracts[1].items[2].parts;
    expect(v.join("")).toBe("Released on 24 Oct after 15 synthetic cases. Since 29 Oct, each change is tested with 5 samples per case and 20 per high-risk case.");
    expect(v[1]).toBe("tested");
    expect(existsSync(t.evalDoc)).toBe(true);
  });
  it("keeps the answer-rule caption free of file names and links", () => {
    expect(t.rule.caption).not.toMatch(/rose-context|\.ts\b|https?:|\/\//);
  });
  it("links the data sources to files that exist, as the deck states", () => {
    const d = t.contracts[0];
    expect(deck).toContain(`${d.sourcesLead}${d.sources.map((s) => s.label).join(" and ")}`);
    for (const s of d.sources) expect(existsSync(s.path), s.path).toBe(true);
  });
  it("contains no em-dashes", () => {
    expect(JSON.stringify(t)).not.toContain("—");
  });
});

describe("Rose case study chapters 06, 09 and 10", () => {
  it("prints the chapter 06 and 09 words of deck v2", () => {
    for (const x of [SIX.intro, SIX.influence, NEXT.intro, NEXT.transfers, ...NEXT.items.map(([t, d]) => `${t} ${d}`)]) expect(deck, x).toContain(norm(x));
  });
  it("keeps the four questions as in the brief, with the two v2 rewrites", () => {
    expect(QUESTIONS.map((q) => q.title)).toEqual(["Value", "Measure", "Role", "Modality"]);
    const rewritten = new Set(["The numbers would flatter Rose and hide how narrow her real use is.", "I would maintain a feature that nobody uses."]);
    for (const q of QUESTIONS) {
      for (const x of [q.question, q.hypothesis, q.signal, q.decision, q.cost]) {
        if (rewritten.has(x)) expect(deck, x).toContain(x);
        else expect(brief, x).toContain(x);
      }
    }
  });
  it("replies by mailto with the subject Open question 01 to 04, and stores nothing", () => {
    expect(QUESTIONS.map((q) => replyHref(q.n))).toEqual([1, 2, 3, 4].map((n) => `mailto:ivandemurard@gmail.com?subject=Open%20question%200${n}`));
  });
});
