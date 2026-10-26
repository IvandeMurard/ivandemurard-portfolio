import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { auditAetherixQuantitativeAnswer, AETHERIX_EVIDENCE_ANCHORS } from "../lib/roseEvidenceAudit";

const source = readFileSync("public/aetherix.md", "utf8");

describe("Rose Aetherix quantitative evidence audit (offline, advisory)", () => {
  it("keeps the evidence registry anchored to the published Markdown source", () => {
    for (const anchor of AETHERIX_EVIDENCE_ANCHORS) expect(source).toContain(anchor);
    expect(auditAetherixQuantitativeAnswer("", source).missingEvidenceAnchors).toEqual([]);
  });

  it("flags the exact invented figures observed in the failed gateway evaluation", () => {
    const result = auditAetherixQuantitativeAnswer(
      "Prophet averaged 5.6% error versus 12.7% baseline. The evaluation caught 85% of errors and error fell by 56%.",
      source,
    );
    expect(result.unsupportedPercentages.map(item => item.value)).toEqual([5.6, 12.7, 85, 56]);
    expect(result.numericallyPresentPercentages).toEqual([]);
    expect(result.requiresSemanticReview).toBe(true);
  });

  it("accepts documented numeric values only as candidates for semantic review", () => {
    const result = auditAetherixQuantitativeAnswer(
      "On the 30 restaurants benchmark, mean MAPE was 49.71% vs 55.86%; J+1 MdAPE was 28.5% vs 27.9%.",
      source,
    );
    expect(result.unsupportedPercentages).toEqual([]);
    expect(result.unsupportedCounts).toEqual([]);
    expect(result.numericallyPresentPercentages.map(item => item.value)).toEqual([49.71, 55.86, 28.5, 27.9]);
    expect(result.numericallyPresentCounts.map(item => item.value)).toContain(30);
    expect(result.requiresSemanticReview).toBe(true);
  });

  it("normalizes decimal commas but rejects undocumented counts and invented percentages", () => {
    const result = auditAetherixQuantitativeAnswer(
      "It reached 49,71 % MAPE in 999 hotels, with an 85 percent catch rate.",
      source,
    );
    expect(result.numericallyPresentPercentages.map(item => item.value)).toEqual([49.71]);
    expect(result.unsupportedPercentages.map(item => item.value)).toEqual([85]);
    expect(result.unsupportedCounts.map(item => item.value)).toEqual([999]);
  });

  it("does not mistake numerical presence for actual grounding or validated hotel outcomes", () => {
    const result = auditAetherixQuantitativeAnswer(
      "49.71% of hotels were satisfied with Aetherix.",
      source,
    );
    expect(result.unsupportedPercentages).toEqual([]);
    expect(result.requiresSemanticReview).toBe(true);
  });

  it("does not reject a qualitative answer without percentages or counts", () => {
    const result = auditAetherixQuantitativeAnswer(
      "The public-restaurant benchmark measures forecast error, not business value or results in a hotel.",
      source,
    );
    expect(result.unsupportedPercentages).toEqual([]);
    expect(result.unsupportedCounts).toEqual([]);
    expect(result.requiresSemanticReview).toBe(false);
  });
  it("flags a sourced 25.6% value attributed to an unspecified main system rather than gradient boosting", () => {
    const answer = "In the 30-restaurant benchmark, the system reached 25.6% median absolute percentage error (MdAPE).";
    const result = auditAetherixQuantitativeAnswer(answer, source);
    expect(result.unsupportedPercentages).toEqual([]);
    expect(result.attributionWarnings.map(warning => warning.code)).toContain("gradient_boosted_attribution");
  });

  it("does not flag correct gradient-boosted model attribution", () => {
    const answer = "A separate gradient-boosted model achieved a 25.6% median forecast error on public restaurant data.";
    const result = auditAetherixQuantitativeAnswer(answer, source);
    expect(result.attributionWarnings.map(warning => warning.code)).not.toContain("gradient_boosted_attribution");
  });

  it("flags unsupported guardrail-frequency and all-code-change claims without inventing numbers", () => {
    const answer = "The system measures the frequency of guardrail trips. Every code change must pass versioned golden datasets before merging.";
    const warnings = auditAetherixQuantitativeAnswer(answer, source).attributionWarnings.map(warning => warning.code);
    expect(warnings).toContain("guardrail_frequency");
    expect(warnings).toContain("all_code_changes");
  });

  it("flags measured staffing claims and imprecise median MAPE wording", () => {
    const answer = "He compares covers and staffing against actual outcomes daily, with median MAPE of 27.0%.";
    const warnings = auditAetherixQuantitativeAnswer(answer, source).attributionWarnings.map(warning => warning.code);
    expect(warnings).toContain("staffing_outcome");
    expect(warnings).toContain("median_mape_label");
  });

  it("keeps correctly qualified limitations free of those attribution warnings", () => {
    const answer = "Guardrail trips have machine-readable reasons, but no guardrail rate is documented. Staffing remains a pilot hypothesis, not a measured benefit. Prophet MdAPE is 27.0%; a separate gradient-boosted alternative reaches 25.6%.";
    const warnings = auditAetherixQuantitativeAnswer(answer, source).attributionWarnings;
    expect(warnings).toEqual([]);
  });


});
