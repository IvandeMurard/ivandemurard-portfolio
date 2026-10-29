import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { ROSE_CHAPTERS } from "@/components/rose/RoseCaseStudy";

const deck = readFileSync("docs/rose-case-study-copy.md", "utf8");

describe("Rose case study §6.0 page-wide", () => {
  it("lists the eleven chapters of the copy deck table of contents, in order", () => {
    expect(ROSE_CHAPTERS.map((c) => c.toc).join(" · ")).toBe(
      "00 The idea · 01 Qualify · 02 Listen to the page · 03 Know where you are · 04 One quiet dock · 05 Earn trust · 06 What Rose can do now · 07 Trust · 08 What she got wrong · 09 Next steps · 10 Open questions",
    );
  });
  it("uses only transition sentences that appear verbatim in the copy deck", () => {
    for (const c of ROSE_CHAPTERS) if (c.transition) expect(deck).toContain(`"${c.transition}"`);
  });
  it("contains no em-dashes", () => {
    expect(JSON.stringify(ROSE_CHAPTERS)).not.toContain("\u2014");
  });
});
