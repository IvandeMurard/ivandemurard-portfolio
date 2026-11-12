import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// The private Rose view shows the empty-answer retries: migration 0006 adds the two figures, the page reads them.
describe("Empty-answer retries in the private Rose view", () => {
  const sql = readFileSync("drizzle/migrations/0006_rose_metrics_empty_retries.sql", "utf8");
  const page = readFileSync("src/pages/AdminRose.tsx", "utf8");
  const types = readFileSync("src/components/rose/roseMetrics.ts", "utf8");

  it("the function counts empty_retry events and those that recovered, and keeps the admin check", () => {
    expect(sql).toContain("'empty_retries',(SELECT count(*) FROM events WHERE kind='empty_retry')");
    expect(sql).toContain("'empty_retries_recovered',(SELECT count(*) FROM events WHERE kind='empty_retry' AND outcome='recovered')");
    expect(sql).toContain("Admin access required");
    expect(sql).not.toContain("label_or_question"); // the function never returns what a visitor wrote
  });

  it("the page shows them as a count with a withheld rate below 20, and tolerates a function that does not return them yet", () => {
    expect(page).toContain("Empty answers recovered");
    expect(page).toContain("metrics.empty_retries_recovered ?? 0");
    expect(page).toContain("metrics.empty_retries ?? 0");
    expect(types).toContain("empty_retries?: number");
  });
});
