import { describe, expect, it } from "vitest";
import { median, summarise } from "../../scripts/rose-empty-retry-report";

describe("The empty-retry report", () => {
  it("takes the median of an odd and an even list, and nothing from an empty one", () => {
    expect(median([5, 1, 3])).toBe(3);
    expect(median([4, 2, 8, 6])).toBe(5);
    expect(median([])).toBeNull();
  });

  it("counts empty answers before and after the retry, and the latency the retry added", () => {
    const ok = (n: number, extra = {}) => ({ case: "career-scope-rose", sample: n, text: "He is open to roles.", bookingLine: true, totalMs: 2000, retry: null, ...extra });
    const answers = [
      ok(1),
      ok(2, { totalMs: 5200, retry: { outcome: "recovered", firstMs: 1800, retryMs: 3000 } }),
      ok(3, { text: "", bookingLine: false, totalMs: 6000, retry: { outcome: "still_empty", firstMs: 2000, retryMs: 4000 } }),
      { case: "portfolio-1", text: "", retry: null },
    ];
    const s = summarise(answers);
    expect(s).toMatchObject({ answers: 3, emptyBefore: 2, recovered: 1, stillEmpty: 1, emptyAfter: 1 });
    expect(s.retryLatencyMs).toEqual({ median: 3500, max: 4000 });
    expect(s.flags).toEqual([]);
  });

  it("flags a text that invites a call, a booking card, and a line on an empty answer", () => {
    const s = summarise([
      { case: "career-scope-note", sample: 1, text: "Feel free to book a call with Ivan.", bookingLine: true },
      { case: "career-scope-note", sample: 2, text: "Roles.", bookingLine: true, tools: [{ toolName: "propose_booking" }] },
      { case: "career-scope-note", sample: 3, text: "", bookingLine: true },
    ]);
    expect(s.flags).toHaveLength(3);
  });
});
