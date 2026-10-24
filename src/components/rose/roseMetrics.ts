export const MEASUREMENT_FROM = "2026-10-24T14:55:10Z";
export type Breakdown = { label: string; count: number };
export type RoseMetrics = {
  measurement_from: string; window_days: number;
  opened: number; activated: number; question_sessions: number; continued: number;
  answered_sessions: number; reference_sessions: number; contact_sessions: number;
  proposed_sessions: number; card_clicked_sessions: number; card_proposed_sessions: number;
  submitted: number; completed: number; failed: number; reference_clicks: number;
  destinations: Breakdown[]; per_page: Breakdown[];
};
/** No invented percentage for absent or tiny denominators. Counts remain visible. */
export const rateLabel = (numerator: number, denominator: number): string => {
  if (denominator === 0) return "Not yet measurable";
  if (denominator < 20) return "Insufficient data for a rate";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
};