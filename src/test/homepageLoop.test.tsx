import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import LOOP from "@/content/homepage-loop.json";
import { AetherixHomepageLoop, LOOP_TABS } from "@/components/atherix/AetherixHomepageLoop";

const numbersIn = (s: string) => (s.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);

describe("homepage loop numbers match the JSON", () => {
  LOOP.days.forEach((d, i) => {
    it(`day ${d.day}`, () => {
      const { container, getByText } = render(<AetherixHomepageLoop initialTab={0} />);
      fireEvent.click(getByText(LOOP_TABS[i]));
      const text = container.querySelector("[role=tabpanel]")!.textContent ?? "";
      const shown = numbersIn(text);
      const expected = [d.evening.predicted, ...d.evening.range, d.evening.confidence, d.reply.counter, d.morning.actual];
      if (d.morning.ape_pct === null) expect(d.morning.kind).toBe("quarantine");
      expected.forEach((n) => expect(shown).toContain(n));
      // Every number on screen must come from the JSON day record.
      const allowed = new Set(numbersIn(JSON.stringify(d)));
      shown.forEach((n) => expect(allowed.has(n)).toBe(true));
    });
  });

  it("day 10 shows the quarantine reason", () => {
    const { getByText } = render(<AetherixHomepageLoop initialTab={1} />);
    expect(getByText("reason: implausible_feedback")).toBeInTheDocument();
  });

  it("no em-dashes in the dataset", () => {
    expect(JSON.stringify(LOOP)).not.toContain("—");
  });
});
