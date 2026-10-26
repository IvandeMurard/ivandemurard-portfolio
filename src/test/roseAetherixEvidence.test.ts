import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  AETHERIX_MEASUREMENT_FACTS,
  AETHERIX_SAMPLE_SOURCE,
  aetherixEvidenceRegistryMatches,
  aetherixMeasurementEvidenceContext,
} from "../../supabase/functions/_shared/rose-aetherix-evidence";

const source = readFileSync("public/aetherix.md", "utf8");

describe("Rose's typed Aetherix measurement evidence", () => {
  it("keeps each model-metric-horizon record traceable to the canonical case-study Markdown", () => {
    expect(source).toContain(AETHERIX_SAMPLE_SOURCE);
    for (const fact of AETHERIX_MEASUREMENT_FACTS) {
      expect(source).toContain(fact.sourceQuote);
      expect(fact.model.length).toBeGreaterThan(0);
      expect(fact.metric.length).toBeGreaterThan(0);
      expect(fact.result.length).toBeGreaterThan(0);
      expect(fact.comparator.length).toBeGreaterThan(0);
      expect(fact.horizon.length).toBeGreaterThan(0);
    }
    expect(aetherixEvidenceRegistryMatches(source)).toBe(true);
  });

  it("refuses to inject the ledger when the fetched source loses a documented claim", () => {
    const drifted = source.replace("A gradient-boosted model reaches 25.6% on the median.", "An alternative model is being researched.");
    expect(aetherixEvidenceRegistryMatches(drifted)).toBe(false);
    expect(aetherixEvidenceRegistryMatches("")).toBe(false);
  });

  it("attaches 25.6% to gradient boosting and distinguishes Prophet, J+1 and sandbox recalibration", () => {
    const facts = AETHERIX_MEASUREMENT_FACTS;
    const boosted = facts.find(fact => fact.id === "gradient_boosted_median");
    expect(boosted?.model).toMatch(/gradient-boosted/);
    expect(boosted?.result).toBe("25.6%");
    expect(boosted?.interpretation).toMatch(/NEVER attribute 25\.6% to Prophet/);

    const j1 = facts.find(fact => fact.id === "prophet_j1");
    expect(j1?.result).toBe("28.5%");
    expect(j1?.comparator).toContain("27.9%");
    expect(j1?.interpretation).toContain("WORSE");

    const recalibration = facts.find(fact => fact.id === "sandbox_recalibration");
    expect(recalibration?.evidenceScope).toBe("sandbox_simulation");
    expect(recalibration?.result).toContain("15.9%");
    expect(recalibration?.result).toContain("12.3%");
  });

  it("separates the measured covers forecast from pilot staffing and target waste", () => {
    const context = aetherixMeasurementEvidenceContext();
    expect(context).toContain("daily covers forecast runs on sandbox data");
    expect(context).toContain("Staffing recommendations are a PILOT HYPOTHESIS");
    expect(context).toContain("waste reduction is a TARGET outcome");
    expect(context).toContain("No guardrail-frequency KPI");
    expect(context).toContain("no demonstrated hotel business impact");
  });
});
