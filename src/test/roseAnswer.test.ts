import { describe, expect, it } from "vitest";
import { bookingSafeAnswer, normalizeRoseText, roseCvHref } from "@/components/rose/roseAnswer";
import { CAL_URL } from "@/components/rose/roseConfig";

describe("One booking destination", () => {
  it("removes a raw calendar destination when the booking card owns the action", () => {
    expect(bookingSafeAnswer(`Ivan can discuss the pilot.\n\n${CAL_URL}`, true))
      .toBe("Ivan can discuss the pilot.");
  });
  it("removes a Markdown calendar action without removing portfolio evidence", () => {
    expect(bookingSafeAnswer(`[Book a call](${CAL_URL})\n\n[Aetherix](/aetherix)`, true))
      .toBe("[Aetherix](/aetherix)");
  });
  it("preserves the calendar destination without a booking card", () => {
    expect(bookingSafeAnswer(CAL_URL, false)).toBe(CAL_URL);
  });
});

describe("Generated Rose prose", () => {
  it("replaces em-dashes in answers, follow-ups and card reasons", () => {
    expect(normalizeRoseText("Built\u2014in sandbox. Why \u2014 now?"))
      .toBe("Built, in sandbox. Why, now?");
  });
  it("preserves code and destinations while normalizing link labels", () => {
    expect(normalizeRoseText("[CV\u2014read](/cv) `a\u2014b` https://example.com/a\u2014b"))
      .toBe("[CV, read](/cv) `a\u2014b` https://example.com/a\u2014b");
  });
  it("routes nonexistent CV mirrors to the human CV page", () => {
    expect(roseCvHref("/cv.md")).toBe("/cv");
    expect(roseCvHref("https://ivandemurard.com/cv.md")).toBe("/cv");
    expect(roseCvHref("/Ivan_de_Murard_CV.md")).toBe("/Ivan_de_Murard_CV.md");
  });
});