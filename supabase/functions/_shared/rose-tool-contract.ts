/** Shared, runtime-equivalent Rose tool descriptions.
 * The synthetic harness must use the same tool contracts as the edge handler.
 * UI-only tools have no execute callback; the visitor triggers any booking.
 */
export const ROSE_BOOKING_TOOL_DESCRIPTION =
  "Render a booking CTA card in the chat when the visitor's intent is clear enough to warrant a 30-minute call with Ivan. A request for Rose to access, review or test the visitor's code is not such intent. The reason must never promise a service Ivan does not offer (for example a review of the visitor's private repository). No execute: the human clicks the rendered card.";

export const ROSE_FOLLOWUPS_TOOL_DESCRIPTION =
  "Optional, call at most once, after the answer text. Up to two short follow-up questions the visitor could ask Rose. Form: a polite question to Rose that names Ivan in the third person (\"he\", \"his\"), never \"you\" or \"your\" for Ivan. Each question is about something the answer you just wrote mentioned, concerns content that exists on this site, and advances the visitor's current question. Write the questions yourself; do not reuse wording from these instructions. Rendered as chips under the answer.";

/**
 * Profile questions get an answer, not a booking card. The booking tool is offered
 * only when the visitor explicitly asks for a call, a meeting or a way to talk to Ivan.
 */
export const isRoseExplicitMeetingRequest = (question: string): boolean =>
  /\b(?:call|calls|meeting|meet|book|booking|schedule|appointment|calendar|talk to (?:ivan|him)|speak (?:to|with) (?:ivan|him)|chat with (?:ivan|him)|get in touch|contact (?:ivan|him)|reach (?:ivan|him)|interview)\b/i.test(question);

export const ROSE_NO_BOOKING_NOTICE =
  "For this turn the propose_booking tool is not available. The interface adds a booking line under your answer itself: do not invite a call or mention booking in the answer.";

export type RoseFollowupContext = { question: string; pagePath?: string };
export type RoseFollowupRejection = "addresses_ivan" | "unrequested_implementation" | "unsupported_outcome_learning" | "unfocused_technical";

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

/**
 * A chip is read by Rose, so "you" means Rose. "Your projects", "your CV", "did you build" or
 * "your role" address Ivan as if he were the reader: rejected. "Would you tell me more about his..." is allowed.
 */
const IVAN_AS_YOU = /\b(?:your|yours|yourself)\b|\byou\s+(?:built|build|designed|design|worked|work|shipped|ship|led|lead|founded|co-?founded|studied|learned|measured|measure|tested|test|chose|choose|decided|decide|managed|manage|delivered|deliver|are looking|looking)\b|\b(?:did|have|were|are)\s+you\s+(?:build|built|design|designed|work|worked|ship|shipped|lead|led|found|founded|study|studied|test|tested|choose|chose|decide|decided|deliver|delivered|open|looking)\b/i;
export const addressesIvanAsYou = (item: string): boolean => IVAN_AS_YOU.test(item);

/** Shared policy for live tool validation, client rendering, and offline review. */
export function roseFollowupRejection(item: string, context: RoseFollowupContext): RoseFollowupRejection | null {
  if (addressesIvanAsYou(item)) return "addresses_ivan";
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

export const ROSE_FOLLOWUP_VOICE =
  "Phrase each follow-up as a polite question to Rose that names Ivan in the third person (\"he\", \"his\"), about something the answer mentioned. Never use \"you\" or \"your\" for Ivan.";

export function roseFollowupPolicyDescription(context: RoseFollowupContext): string {
  if (plainAetherixMeasurementQuestion(context.question, context.pagePath)) {
    return `${ROSE_FOLLOWUP_VOICE} ` + "For this plain-language Aetherix measurement question, suggest only the comparison, evidence limit, or operational consequence. Do not mention evaluation, CI, gates, datasets, harnesses, or graders.";
  }
  if (isRoseTechnicalEvaluationQuestion(context)) {
    return `${ROSE_FOLLOWUP_VOICE} ` + "For this technical Aetherix evaluation question, every follow-up must stay on gates, case sets, exit codes, guardrails, forecast, parser, providers, memory, or prompts. Do not suggest restaurant benchmarks or claim that a manager override improves a forecast.";
  }
  return `${ROSE_FOLLOWUP_VOICE} Advance the visitor's current question with a topic covered on this site.`;
}
