import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import LOOP from "@/content/homepage-loop.json";
import { AetherixHomepageLoop, LOOP_TABS } from "@/components/atherix/AetherixHomepageLoop";

const numbersIn = (s: string) => (s.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);

describe("homepage loop numbers match the JSON", () => {
  LOOP.days.forEach((d, i) => {
    it(`day ${d.day}`, () => {
      const { container, getByText, getByRole } = render(<AetherixHomepageLoop initialTab={0} />);
      fireEvent.click(getByRole("tab", { name: LOOP_TABS[i] }));
      const text = container.querySelector("[role=tabpanel]")!.textContent ?? "";
      const shown = numbersIn(text);
      const expected = [d.evening.predicted, ...d.evening.range, d.evening.baseline, d.reply.counter, d.morning.actual];
      if (d.morning.ape_pct === null) expect(d.morning.kind).toBe("quarantine");
      expected.forEach((n) => expect(shown).toContain(n));
      // Every number on screen must come from the JSON day record.
      const allowed = new Set(numbersIn(JSON.stringify(d)));
      shown.forEach((n) => expect(allowed.has(n)).toBe(true));
    });

    it(`day ${d.day}: baseline + drivers = predicted`, () => {
      const sum = d.evening.drivers.reduce((a, x) => a + x.covers, d.evening.baseline);
      expect(sum).toBe(d.evening.predicted);
    });
  });

  it("signals per day", () => {
    expect(LOOP.days.map((d) => [d.reply.signal, d.morning.signal])).toEqual([["warn", "go"], ["go", "stop"], ["go", "warn"]]);
  });

  it("day 10 hides the internal reason code", () => {
    const { container, getByText } = render(<AetherixHomepageLoop initialTab={1} />);
    expect(getByText(/Outlier guard/)).toBeInTheDocument();
    expect(container.textContent).not.toContain("implausible_feedback");
  });

  it("no em-dashes in the dataset", () => {
    expect(JSON.stringify(LOOP)).not.toContain("—");
  });
});
