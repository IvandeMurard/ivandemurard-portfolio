/**
 * Aetherix's published quantitative evidence, used to constrain Rose's
 * attribution on project-focused turns. These records are not independent
 * experimental verification: public/aetherix.md remains the source of truth.
 * Every sourceQuote is asserted by tests and checked against the fetched
 * reference before being included in a live prompt.
 */
export type AetherixMeasurementFact = {
  id: string;
  model: string;
  metric: string;
  result: string;
  comparator: string;
  horizon: string;
  evidenceScope: "public_restaurant_benchmark" | "sandbox_simulation";
  sourceQuote: string;
  interpretation: string;
};

export const AETHERIX_MEASUREMENT_FACTS = [
  {
    id: "prophet_mean_mape",
    model: "Prophet",
    metric: "mean MAPE (forecast error, lower is better)",
    result: "49.71%",
    comparator: "55.86% for the naive same-weekday baseline",
    horizon: "aggregate across scored public-restaurant observations, not the J+1 result",
    evidenceScope: "public_restaurant_benchmark",
    sourceQuote: "Prophet against a naive same-weekday baseline: mean MAPE 49.71% vs 55.86%",
    interpretation: "The mean error is lower on this public benchmark; this is not accuracy, satisfaction, hotel validation or business impact.",
  },
  {
    id: "prophet_median_mdape",
    model: "Prophet",
    metric: "MdAPE (median absolute percentage error)",
    result: "27.0%",
    comparator: "27.6% for the naive same-weekday baseline",
    horizon: "benchmark median; not the aggregate mean or the J+1 result",
    evidenceScope: "public_restaurant_benchmark",
    sourceQuote: "MdAPE 27.0% vs 27.6%. At J+1, 28.5% vs 27.9%.",
    interpretation: "Keep the median's metric name MdAPE distinct from mean MAPE.",
  },
  {
    id: "prophet_j1",
    model: "Prophet",
    metric: "J+1 (next-day) forecast error",
    result: "28.5%",
    comparator: "27.9% for the naive same-weekday baseline",
    horizon: "J+1, the product's next-day forecast horizon",
    evidenceScope: "public_restaurant_benchmark",
    sourceQuote: "MdAPE 27.0% vs 27.6%. At J+1, 28.5% vs 27.9%.",
    interpretation: "Prophet is slightly WORSE than the baseline at J+1. Do not describe these as live hotel outcomes.",
  },
  {
    id: "gradient_boosted_median",
    model: "a separate gradient-boosted alternative, NOT Prophet",
    metric: "median forecast error (MdAPE)",
    result: "25.6%",
    comparator: "no paired comparator stated for this alternative",
    horizon: "public-restaurant benchmark median; not specifically J+1",
    evidenceScope: "public_restaurant_benchmark",
    sourceQuote: "A gradient-boosted model reaches 25.6% on the median.",
    interpretation: "NEVER attribute 25.6% to Prophet or generically call it Aetherix's main forecast without naming the alternative model.",
  },
  {
    id: "sandbox_recalibration",
    model: "sandbox recalibration loop",
    metric: "forecast error under an injected demand shift",
    result: "15.9% before, 12.3% after weekly recalibration",
    comparator: "same sandbox scenario before/after recalibration",
    horizon: "simulated 25% jump in demand, not a live hotel outcome",
    evidenceScope: "sandbox_simulation",
    sourceQuote: "After a simulated 25% jump in demand, weekly recalibration cut the forecast error from 15.9% to 12.3%.",
    interpretation: "Simulation only. Do not present the result as hotel-level learning, customer impact or a measured staffing benefit.",
  },
] as const satisfies readonly AetherixMeasurementFact[];

export const AETHERIX_SAMPLE_SOURCE =
  "Kaggle Recruit, 30 Japanese restaurants out of 829, 1,193 scored points";

export function aetherixEvidenceRegistryMatches(source: string): boolean {
  return source.includes(AETHERIX_SAMPLE_SOURCE) &&
    AETHERIX_MEASUREMENT_FACTS.every(fact => source.includes(fact.sourceQuote));
}

export function aetherixMeasurementEvidenceContext(): string {
  const records = AETHERIX_MEASUREMENT_FACTS.map(fact =>
    [
      fact.id + ":",
      "model=" + fact.model + "; metric=" + fact.metric + "; result=" + fact.result + ";",
      "comparator=" + fact.comparator + "; horizon=" + fact.horizon + ";",
      "scope=" + fact.evidenceScope + ". " + fact.interpretation,
    ].join(" ")
  );
  return [
    "Aetherix measurement evidence (attribution contract, backed by the fetched case-study reference):",
    "Source population: " + AETHERIX_SAMPLE_SOURCE + ". Protocol not pre-registered.",
    ...records,
    "Operational boundaries: the daily covers forecast runs on sandbox data. Manager accept/reject/override and the observed outcome are recorded in the sandbox. Staffing recommendations are a PILOT HYPOTHESIS and waste reduction is a TARGET outcome, not measured deployed improvements.",
    "Guardrail trips have machine-readable reasons and a deliberately implausible 850-cover input was rejected in a test. No guardrail-frequency KPI or 85% detection rate is documented.",
    "Evaluation gates exist for changes affecting forecasting, providers, memory or prompts. Do not broaden that into measured performance of every code change.",
    "There is no live hotel connected, no signed pilot and no demonstrated hotel business impact. For an open-ended measurement question on /aetherix, lead with what is actually evaluated and its evidence limits, not with projected staffing/waste benefits.",
  ].join("\n");
}
