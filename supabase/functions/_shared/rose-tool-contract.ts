/** Shared, runtime-equivalent Rose tool descriptions.
 * The synthetic harness must use the same tool contracts as the edge handler.
 * UI-only tools have no execute callback; the visitor triggers any booking.
 */
export const ROSE_BOOKING_TOOL_DESCRIPTION =
  "Render a booking CTA card in the chat when the visitor's intent is clear enough to warrant a 30-minute call with Ivan. No execute: the human clicks the rendered card.";

export const ROSE_FOLLOWUPS_TOOL_DESCRIPTION =
  "Optional, call at most once, after the answer text. Up to two short follow-up questions in the visitor's voice (imperative, never 'Ivan' in the third person), each about content that exists on this site. Each must advance the visitor's current question. Rendered as chips under the answer.";

export type RoseFollowupContext = { question: string; pagePath?: string };
export type RoseFollowupRejection = "unrequested_implementation" | "unsupported_outcome_learning" | "unfocused_technical";

const plainAetherixMeasurementQuestion = (question: string, pagePath = ""): boolean =>
  pagePath.split(/[?#]/)[0] === "/aetherix" &&
  /^(?:what does (?:ivan|he) measure(?: here)?|what (?:is|are) (?:ivan's|his|the) (?:main )?metrics?)\s*\??$/i.test(question.trim()) &&
  !/\b(?:CI|pipeline|release|code changes?|tests?|harness|graders?|golden datasets?|technical|implementation)\b/i.test(question);

export const isRoseTechnicalEvaluationQuestion = ({ question, pagePath = "" }: RoseFollowupContext): boolean =>
  pagePath.split(/[?#]/)[0] === "/aetherix" &&
  /\b(?:evaluation|eval|CI|pipeline|release|merge|gates?|golden datasets?|harness|graders?|tests?)\b/i.test(question);

/**
 * Suggestions are useful elsewhere, but the Aetherix evaluation prompts need a
 * compact, evidence-led answer. Omitting this optional UI tool avoids irrelevant
 * chips. The system prompt says so (ROSE_NO_FOLLOWUPS_NOTICE) so the model does
 * not call a tool it was not given.
 */
export const shouldSuppressRoseFollowups = ({ question, pagePath = "" }: RoseFollowupContext): boolean =>
  plainAetherixMeasurementQuestion(question, pagePath) ||
  isRoseTechnicalEvaluationQuestion({ question, pagePath });

export const ROSE_NO_FOLLOWUPS_NOTICE =
  "For this turn the suggest_followups tool is not available. Do not call it and do not write follow-up questions in the answer.";

/** Shared policy for live tool validation, client rendering, and offline review. */
export function roseFollowupRejection(item: string, context: RoseFollowupContext): RoseFollowupRejection | null {
  if (plainAetherixMeasurementQuestion(context.question, context.pagePath) &&
      /\b(?:CI|(?:evaluation|release) gates?|golden datasets?|test harness(?:es)?|graders?)\b/i.test(item)) {
    return "unrequested_implementation";
  }
  if (isRoseTechnicalEvaluationQuestion(context)) {
    if (/\b(?:manager['’]s? override|override).{0,70}\b(?:improve|improves|improvement|better)\b/i.test(item)) {
      return "unsupported_outcome_learning";
    }
    if (!/\b(?:evaluation|eval(?:[_\s-]?gate)?|CI|pipeline|release|merge|gate|exit code|case sets?|guardrail|forecast|parser|provider|memory|prompt)\b/i.test(item)) {
      return "unfocused_technical";
    }
  }
  return null;
}

export const isRoseFollowupAllowed = (item: string, context: RoseFollowupContext): boolean =>
  roseFollowupRejection(item, context) === null;

export function roseFollowupPolicyDescription(context: RoseFollowupContext): string {
  if (plainAetherixMeasurementQuestion(context.question, context.pagePath)) {
    return "For this plain-language Aetherix measurement question, suggest only the comparison, evidence limit, or operational consequence. Do not mention evaluation, CI, gates, datasets, harnesses, or graders.";
  }
  if (isRoseTechnicalEvaluationQuestion(context)) {
    return "For this technical Aetherix evaluation question, every follow-up must stay on gates, case sets, exit codes, guardrails, forecast, parser, providers, memory, or prompts. Do not suggest restaurant benchmarks or claim that a manager override improves a forecast.";
  }
  return "Advance the visitor's current question with a topic covered on this site.";
}
