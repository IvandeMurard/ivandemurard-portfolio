/**
 * Stage B offline QA, not a runtime guardrail.
 *
 * Numerical presence in a source is NECESSARY but not SUFFICIENT evidence:
 * the metric, comparator, scope and experiment still need human review.
 */
export type QuantitativeMention = {
  text: string;
  value: number;
  snippet: string;
};

export type AetherixEvidenceAudit = {
  unsupportedPercentages: QuantitativeMention[];
  numericallyPresentPercentages: QuantitativeMention[];
  unsupportedCounts: QuantitativeMention[];
  numericallyPresentCounts: QuantitativeMention[];
  missingEvidenceAnchors: string[];
  requiresSemanticReview: boolean;
};

/** Canonical snippets from public/aetherix.md. Tests fail when the source drifts. */
export const AETHERIX_EVIDENCE_ANCHORS = [
  "After a simulated 25% jump in demand, weekly recalibration cut the forecast error from 15.9% to 12.3%.",
  "Kaggle Recruit, 30 Japanese restaurants out of 829, 1,193 scored points",
  "Prophet against a naive same-weekday baseline: mean MAPE 49.71% vs 55.86%",
  "MdAPE 27.0% vs 27.6%. At J+1, 28.5% vs 27.9%.",
  "A gradient-boosted model reaches 25.6% on the median.",
  "The protocol was not pre-registered for this run.",
] as const;

const percentagePattern = /(?<![\d.,])(\d+(?:[.,]\d+)?)\s*(?:%|\bpercent(?:age)?\b|\bper cent\b)/gi;
const countPattern = /(?<![\d.,])(\d{1,3}(?:,\d{3})+|\d+(?:[.,]\d+)?)\s+(restaurants?|hotels?|properties|scored points|points?|users?|clients?|staff|venues|cities|days?)\b/gi;

function normalizePercentage(text: string): number {
  return Number(text.replace(",", "."));
}

function normalizeCount(text: string): number {
  return Number(text.replaceAll(",", ""));
}

function snippet(text: string, index: number, length: number): string {
  return text.slice(Math.max(0, index - 80), Math.min(text.length, index + length + 80))
    .replace(/\s+/g, " ").trim();
}

function extractPercentages(text: string): QuantitativeMention[] {
  return [...text.matchAll(percentagePattern)].map(match => ({
    text: match[0],
    value: normalizePercentage(match[1]),
    snippet: snippet(text, match.index ?? 0, match[0].length),
  }));
}

function extractCounts(text: string): Array<QuantitativeMention & { unit: string }> {
  return [...text.matchAll(countPattern)].map(match => ({
    text: match[0],
    value: normalizeCount(match[1]),
    unit: match[2].toLowerCase().replace(/^scored /, "").replace(/s$/, ""),
    snippet: snippet(text, match.index ?? 0, match[0].length),
  }));
}

/**
 * Exact value/unit matching only. Values matching the document still need a
 * semantic check: e.g. a documented MAPE is NOT hotel-level accuracy.
 */
export function auditAetherixQuantitativeAnswer(answer: string, source: string): AetherixEvidenceAudit {
  const sourcePercentages = new Set(extractPercentages(source).map(mention => mention.value));
  const sourceCounts = new Set(extractCounts(source).map(mention => String(mention.value) + ":" + mention.unit));
  const percentages = extractPercentages(answer);
  const counts = extractCounts(answer);

  const unsupportedPercentages = percentages.filter(mention => !sourcePercentages.has(mention.value));
  const numericallyPresentPercentages = percentages.filter(mention => sourcePercentages.has(mention.value));
  const unsupportedCounts = counts.filter(mention => !sourceCounts.has(String(mention.value) + ":" + mention.unit));
  const numericallyPresentCounts = counts.filter(mention => sourceCounts.has(String(mention.value) + ":" + mention.unit));

  return {
    unsupportedPercentages,
    numericallyPresentPercentages,
    unsupportedCounts,
    numericallyPresentCounts,
    missingEvidenceAnchors: AETHERIX_EVIDENCE_ANCHORS.filter(anchor => !source.includes(anchor)),
    requiresSemanticReview: percentages.length + counts.length > 0,
  };
}
