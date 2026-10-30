import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { CLOSE, IDEA, MILESTONES } from "@/components/rose/RoseCaseStudy";

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
