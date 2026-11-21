import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { NOTES_INTRO, ROSE_CHAPTERS } from "@/components/rose/RoseCaseStudy";

const deck = readFileSync("docs/rose-case-study-copy-v2.md", "utf8");

describe("Rose case study §6.0 page-wide", () => {
  it("lists the twelve chapters of the copy deck table of contents, in order", () => {
    expect(ROSE_CHAPTERS.map((c) => c.toc).join(" · ")).toBe(
      "00 The idea · 01 Qualify · 02 Listen to the page · 03 Know where you are · 04 One dock · 05 Earn trust · 06 Read aloud · 07 Answer formats · 08 Trust · 09 What she got wrong · 10 Next steps · 11 Open questions",
    );
  });
  it("has no transition sentence: a chapter carries no closing line", () => {
    for (const c of ROSE_CHAPTERS) expect(Object.keys(c).sort(), c.id).toEqual(["heading", "id", "kicker", "toc"]);
  });
  it("prints the chapter headings of copy deck v2", () => {
    const heading = (id: string) => ROSE_CHAPTERS.find((c) => c.id === id)?.heading;
    expect(heading("ch-00")).toBe("A portfolio that can answer questions");
    expect(heading("ch-04")).toBe("One dock");
    expect(heading("ch-06")).toBe("Answers that point into the page");
    expect(heading("ch-08")).toBe("Caught in testing");
    expect(heading("ch-09")).toBe("Next: help readers move across the whole site");
    expect(heading("ch-10")).toBe("Four questions that have yet to be answered. Have an answer to one of them? Tell me.");
    expect(ROSE_CHAPTERS.find((c) => c.id === "ch-06")?.kicker).toBe("07 · Answer formats");
    // The sixth decision has its own anchor; the chapters after it keep theirs, so existing links still reach the same content.
    expect(heading("ch-voice")).toBe("Read aloud");
    expect(ROSE_CHAPTERS.map((c) => c.id)).toEqual(["ch-00", "ch-01", "ch-02", "ch-03", "ch-04", "ch-05", "ch-voice", "ch-06", "ch-07", "ch-08", "ch-09", "ch-10"]);
    for (const c of ROSE_CHAPTERS) expect(deck, c.heading).toContain(c.heading.replace(/\.$/, ""));
  });
  it("credits co-existence.ai above chapter 01 with the deck's words", () => {
    expect(deck).toContain(NOTES_INTRO.replace("co-existence.ai's", "co-existence.ai's"));
  });
  it("contains no em-dashes", () => {
    expect(JSON.stringify(ROSE_CHAPTERS)).not.toContain("\u2014");
  });
});
