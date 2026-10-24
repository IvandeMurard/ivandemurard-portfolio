import { describe, expect, it } from "vitest";
import { bookingSafeAnswer } from "@/components/rose/roseAnswer";
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