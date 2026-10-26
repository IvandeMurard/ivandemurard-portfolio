import { describe, expect, it } from "vitest";
import { bookingSafeAnswer, normalizeRoseText, roseCvHref, stripLeakedRoseToolCalls } from "@/components/rose/roseAnswer";
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
describe("Stray model tool syntax", () => {
  it("removes a leaked follow-up invocation without hiding the substantive answer", () => {
    const raw = "In August 2026, Rose adopted contextual starters.\n\nsuggest_followups(items: [\"How did that work?\"])";
    expect(stripLeakedRoseToolCalls(raw)).toBe("In August 2026, Rose adopted contextual starters.");
  });
  it("removes a leaked booking-tool call, not the actual visitor-facing explanation", () => {
    const raw = "I can explain Ivan's work.\npropose_booking(intent: \"product\", reason: \"A call\")";
    expect(stripLeakedRoseToolCalls(raw)).toBe("I can explain Ivan's work.");
  });
  it("also suppresses an incomplete tool invocation during streaming", () => {
    const partial = "The change was implemented in August.\nsuggest_followups(items: [";
    expect(stripLeakedRoseToolCalls(partial)).toBe("The change was implemented in August.");
  });
  it("preserves a legitimate fenced-code example", () => {
    const raw = "Example syntax:\n\n```text\nsuggest_followups(items: [\"Example?\"])\n```";
    expect(stripLeakedRoseToolCalls(raw)).toBe(raw);
  });
  it("does not remove ordinary discussions of tools or follow-up questions", () => {
    const raw = "I may suggest follow-ups, but only when you want to explore more.";
    expect(stripLeakedRoseToolCalls(raw)).toBe(raw);
  });
});
