import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { MILESTONES } from "@/components/rose/RoseCaseStudy";

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
  it("contains no em-dashes", () => {
    expect(JSON.stringify(MILESTONES)).not.toContain("—");
  });
});
