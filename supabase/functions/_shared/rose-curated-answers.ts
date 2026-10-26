/**
 * Source-backed answers for the two Stage B Aetherix evidence questions.
 *
 * These are deliberately narrow. They keep a visitor from receiving a
 * plausible but unsupported rewrite of a public, high-precision claim while
 * leaving Rose's ordinary portfolio exploration model-led.
 */
export type RoseCuratedAnswerContext = { question: string; pagePath?: string };

const onAetherix = (pagePath = "") => pagePath.split(/[?#]/)[0] === "/aetherix";
const normalized = (question: string) => question.trim().replace(/\s+/g, " ").toLowerCase();

const MEASUREMENT_QUESTION = "what does ivan measure?";
const TECHNICAL_EVALUATION_QUESTION =
  "how do evaluation gates protect aetherix changes to forecasting, providers, memory or prompts before merge?";

export const ROSE_AETHERIX_MEASUREMENT_ANSWER = `Ivan measures Aetherix's forecast error against a naive baseline, then states where that comparison stops. On the public 30-restaurant benchmark, Prophet's mean MAPE was 49.71% versus 55.86%. At the actual J+1 horizon, it was 28.5% versus 27.9%. In an Apaleo sandbox experiment with a 25% demand shift, weekly recalibration moved error from 15.9% to 12.3%. Those are public-data and sandbox forecast results, not proof that a staffing recommendation was right or that a real hotel is connected.`;

export const ROSE_AETHERIX_TECHNICAL_EVALUATION_ANSWER = `For changes to forecasting, providers, memory or prompts, the documented evaluation gate runs before merge. Forecasting is checked with a synthetic series; separately, the reply parser is checked with a rule-based stand-in. A failing evaluation exit code blocks a merge. A guardrail trip only records a machine-readable reason: it is not the merge decision. The gate catches known scenarios, not every possible failure or a live-hotel outcome. [Evaluate](/journal/harnesses-graders-closed-loops)`;

export function getRoseCuratedAnswer({ question, pagePath = "" }: RoseCuratedAnswerContext): string | null {
  if (!onAetherix(pagePath)) return null;
  const value = normalized(question);
  if (value === MEASUREMENT_QUESTION) return ROSE_AETHERIX_MEASUREMENT_ANSWER;
  if (value === TECHNICAL_EVALUATION_QUESTION) return ROSE_AETHERIX_TECHNICAL_EVALUATION_ANSWER;
  return null;
}
