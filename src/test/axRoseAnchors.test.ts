import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { NOTES_INTRO, ROSE_CHAPTERS } from "@/components/rose/RoseCaseStudy";
import { JOURNAL_ENTRIES } from "@/content/journal";

// The Field Note "One text, three readers" links into the Rose case study by chapter, and never repeats its content.
// Every /rose#... anchor of the note must be an id that the page really renders (the chapters of RoseCaseStudy.tsx).
// No anchor is invented: the ones in use are listed here with the chapter they mean.
const SLUG = "one-text-three-readers";
const entry = JOURNAL_ENTRIES.find((e) => e.slug === SLUG)!;
const page = readFileSync("src/components/rose/RoseCaseStudy.tsx", "utf8");
const mirror = readFileSync(`public/${SLUG}.md`, "utf8");

const anchorsIn = (text: string): string[] =>
  [...text.matchAll(/\/rose#([A-Za-z0-9_-]+)/g)].map((m) => m[1]);

const MEANING: Record<string, string> = {
  "ch-00": "Rose's notes: the first one is in chapter 00, and the line that credits co-existence.ai follows it",
  "ch-06": "Answer formats, where the map 'What Rose can relate' sits",
  "ch-07": "Trust has two separate contracts.",
  "ch-08": "Caught in testing",
};

describe("One text, three readers: links into /rose", () => {
  const anchors = [...new Set(anchorsIn(JSON.stringify(entry)))].sort();

  it("uses the four chapters it points to", () => {
    expect(anchors).toEqual(["ch-00", "ch-06", "ch-07", "ch-08"]);
  });

  it("every /rose#... anchor of the note is a chapter id the page renders", () => {
    const ids = ROSE_CHAPTERS.map((c) => c.id);
    for (const a of anchors) expect(ids, `/rose#${a}`).toContain(a);
    // The page puts the chapter id on its section: that is what the anchor lands on.
    expect(page).toContain("<section id={c.id}");
  });

  it("every anchor of the Markdown mirror exists too, as a full URL", () => {
    const inMirror = [...new Set(anchorsIn(mirror))].sort();
    expect(inMirror).toEqual(anchors);
    expect(mirror).toContain("https://ivandemurard.com/rose#ch-08");
  });

  it("each anchor means the chapter the sentence names", () => {
    const heading = (id: string) => ROSE_CHAPTERS.find((c) => c.id === id)?.heading;
    expect(heading("ch-07")).toBe("Trust has two separate contracts.");
    expect(heading("ch-08")).toBe("Caught in testing");
    expect(heading("ch-06")).toBe("Answers that point into the page");
    // The relation map sits in chapter 06 (it has no id of its own). Rose's notes start in chapter 00, which carries the first one.
    expect(heading("ch-00")).toBe("A portfolio that can answer questions");
    expect(page).toMatch(/c\.id === "ch-06" && <SixBody/);
    expect(page).toContain('<RoseCue id="ch-00"');
    expect(NOTES_INTRO).toContain("Rose's notes");
    for (const a of anchors) expect(MEANING[a], a).toBeTruthy();
  });

  it("names each target in the sentence that links to it", () => {
    const text = JSON.stringify(entry);
    expect(text).toContain("[Caught in testing](/rose#ch-08)");
    expect(text).toContain("[her trust contracts](/rose#ch-07)");
    expect(text).toContain("[What Rose can relate](/rose#ch-06)");
    expect(text).toContain("[her notes](/rose#ch-00)");
  });

  it("no link to /rose is left without a chapter where a chapter is named", () => {
    // Whole-page links ("her case study", the Sources list) stay plain /rose; no bare https://ivandemurard.com/rose in the note.
    expect(JSON.stringify(entry)).not.toContain("https://ivandemurard.com/rose");
  });
});
