import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { NOTES_INTRO, ROSE_CHAPTERS } from "@/components/rose/RoseCaseStudy";

const deck = readFileSync("docs/rose-case-study-copy-v2.md", "utf8");

describe("Rose case study §6.0 page-wide", () => {
  it("lists the eleven chapters of the copy deck table of contents, in order", () => {
    expect(ROSE_CHAPTERS.map((c) => c.toc).join(" · ")).toBe(
      "00 The idea · 01 Qualify · 02 Listen to the page · 03 Know where you are · 04 One dock · 05 Earn trust · 06 Answer formats · 07 Trust · 08 What she got wrong · 09 Next steps · 10 Open questions",
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
    expect(ROSE_CHAPTERS.find((c) => c.id === "ch-06")?.kicker).toBe("06 · Answer formats");
    for (const c of ROSE_CHAPTERS) expect(deck, c.heading).toContain(c.heading.replace(/\.$/, ""));
  });
  it("credits co-existence.ai above chapter 01 with the deck's words", () => {
    expect(deck).toContain(NOTES_INTRO.replace("co-existence.ai's", "co-existence.ai's"));
  });
  it("contains no em-dashes", () => {
    expect(JSON.stringify(ROSE_CHAPTERS)).not.toContain("\u2014");
  });
});
