import { getRoseCuratedAnswer } from "./rose-curated-answers.ts";

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
  /\b(?:call|calls|meeting|meet|book|booking|schedule|appointment|calendar|talk to (?:ivan|him)|speak (?:to|with) (?:ivan|him)|chat with (?:ivan|him)|get in touch|contact (?:ivan|him)|reach (?:ivan|him)|interview)\b/i.test(question)
  // The same request in French: an appel, a rendez-vous, a réservation, an entretien, a way to talk to or contact Ivan.
  || /(?<![\p{L}])(?:appel|appeler|rendez-vous|réserver|réservation|entretien|échanger avec (?:ivan|lui)|parler (?:à|avec) (?:ivan|lui)|contacter (?:ivan|lui)|prendre contact)(?![\p{L}])/iu.test(question);

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
/**
 * French chips follow the same rule: "vous", "tu", "votre", "ton", "tes", "vos" address Ivan as the reader. The one
 * exception mirrors "Would you tell me more about his...": a polite request to Rose in the first person
 * ("Pourriez-vous m'en dire plus sur ses projets ?"). Only that opening is set aside; "...sur vos projets" is still refused.
 */
const FR_POLITE_TO_ROSE = /(?<![\p{L}])(?:pourriez|pouvez|voudriez|voulez|auriez|sauriez)-vous\s+(?:me|m['’])/giu;
const FR_IVAN_AS_YOU = /(?<![\p{L}])(?:vous|tu|votre|ton|tes|vos)(?![\p{L}])/iu;
export const addressesIvanAsYou = (item: string): boolean =>
  IVAN_AS_YOU.test(item) || FR_IVAN_AS_YOU.test(item.replace(FR_POLITE_TO_ROSE, " "));

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

/** A request for Rose to access, inspect, review or test the visitor's code, files, repositories or systems. */
export function isRoseCodeAccessRequest(question: string): boolean {
  const verb = /\b(?:access|accessing|inspect|inspecting|review|reviewing|audit|auditing|test|testing|check|checking|look at|looking at|read|reading|scan|scanning|run|running|debug|debugging|analy[sz]e|analy[sz]ing)\b/i;
  const target = /\b(?:my|our|this|the|a|private)\s+(?:own\s+)?(?:private\s+)?(?:code(?:base)?|files?|repo(?:sitory|sitories|s)?|systems?|project|pull requests?|PRs?|app(?:lication)?)\b|\bgithub\.com\/|\bgitlab\.com\//i;
  return verb.test(question) && target.test(question);
}

/**
 * A question about Ivan's profile: the roles he wants, his background, skills or how he describes his work.
 * Matches on any page, including Rose's own, where no CV is otherwise loaded.
 */
export function isRoseCareerQuestion(question: string): boolean {
  return /\b(?:roles?|looking for|hiring|hire|jobs?|positions?|open to|available|background|experience|skills?|cv|resume|résumé|what does (?:he|ivan) do|work with (?:him|ivan)|describe (?:his|ivan.s) work)\b/i.test(question)
    || FRENCH_CAREER.test(question);
}

/** The same profile questions in French (the visitor's language, 15 Nov): poste, rôle, parcours, ouvert à, son travail... */
const FRENCH_CAREER = /(?<![\p{L}])(?:postes?|rôles?|emplois?|embauch\p{L}*|recrut\p{L}*|parcours|expériences?|compétences?|disponibles?|ouverte?s? à|ouverte?s? aux|que fait (?:ivan|il)|(?:son|ses) (?:travail|métier|profil)|décrit-il|recherche-t-il|cherche-t-il)(?![\p{L}])/iu;

/**
 * The register of a turn. The server chooses it before the model is called, from the visitor's words alone (no model
 * call, no history): "factual" or "light". Rose is free only inside the register she is given.
 *
 * Factual is the default. A turn is light only when nothing in it asks for a fact, a source, a status, a figure, a
 * date, a technical answer, a career answer, a privacy answer or anything about Ivan or a named project, and
 * something in it is plainly about Rose herself, her name, the site, a greeting or a question off the portfolio's
 * subject. Any doubt is factual. Prepared answers and anything meant for Listen (voice) are always factual.
 */
export type RoseRegister = "factual" | "light";
export type RoseRegisterContext = { question: string; pagePath?: string; /** The text is meant for Listen (voice). */ listen?: boolean };

export const ROSE_REGISTER_LINES: Record<RoseRegister, string> = {
  factual: "Register: factual. No humour. Neutral, precise, warm.",
  light: "Register: light. At most one dry, self-aware touch, never inside a sentence that carries a fact, never at the visitor's expense. Facts stay exact.",
};

const FACTUAL_SIGNALS: RegExp[] = [
  // A summary of a page, a Field Note or an article.
  /\b(?:summar\w*|tl;?\s?dr|recap\w*|sum (?:it )?up|key points?|main points?|in (?:short|brief|a nutshell)|overview)\b/i,
  /(?<![\p{L}])(?:résum\p{L}*|synthèse|en bref)(?![\p{L}])/iu,
  // A status, a figure, a date, a proof.
  /\b(?:status(?:es)?|production|pilot|deploy\w*|live|shipped|released?|proven|prove|proof|evidence|validat\w*|metrics?|measur\w*|accura\w*|errors?|mape|benchmarks?|baseline|how (?:many|much|long|often)|percent\w*|figures?|numbers?|stats?|statistics|when|dates?|years?|since|launch\w*|real (?:hotels?|users?|customers?|clients?|data|outcomes?)|paying|customers?|clients?|users?|sources?|cite|citation|verif\w*|true|false|correct)\b|\d/i,
  /(?<![\p{L}])(?:statuts?|chiffres?|pourcentage|combien|quand|preuves?|prouv\p{L}*|valid\p{L}*|mesur\p{L}*|vrai|faux|sources?)(?![\p{L}])/iu,
  // A technical or evaluation question, what Rose is made of, how she learns.
  /\b(?:evaluat\w*|evals?|ci|pipelines?|merge|gates?|golden|harness\w*|graders?|tests?|testing|architecture|mcp|api|stack|forecast\w*|prophet|apaleo|llm|models?|guardrails?|algorithm\w*|code|repos?|repository|github|database|supabase|latency|tokens?|learn\w*|feedback|boundar\w*|decisions?|decides?|authority|ground truth|approv\w*)\b/i,
  /(?<![\p{L}])(?:évalu\p{L}*|technique|architecture)(?![\p{L}])/iu,
  // Career, recruiting, the profile, a way to reach Ivan.
  /\b(?:recruit\w*|candidates?|salary|interview|profile|linkedin|email|contact|availability|freelance|consult\w*)\b/i,
  // Privacy, data, security, her instructions.
  /\b(?:privacy|private|data|stor(?:e|es|ed|age)|logs?|logged|logging|remember\w*|memory|gdpr|personal|confidential|secur\w*|tracking|tracked|cookies?|consent|mask\w*|purge|retain|retention|delet\w*|instructions?|system prompt|prompt|secrets?|passwords?|keys?)\b/i,
  /(?<![\p{L}])(?:confidentialité|données|sécurité|stock\p{L}*|mémoire|vie privée)(?![\p{L}])/iu,
  // Ivan, a named project, a Field Note.
  /\b(?:ivan|he|his|him|aetherix|tacet|lore|anima|compass|sonor|field notes?|journal|articles?|cv|case studies)\b/i,
];

const LIGHT_SIGNALS: RegExp[] = [
  // Rose herself: what she is, her name, being inside her own case study.
  /\b(?:who|what) are you\b|\bare you (?:real|human|a (?:bot|robot|person|machine|ai|human)|alive|aware|conscious|self-aware|sentient|there|ok|okay)\b|\bwhy (?:are|were) you\b|\bwhy (?:is|are) (?:she|rose)\b|\bwho(?:'s| is) rose\b|\byour name\b|\bcalled\b|\bfourth wall\b|\bown case study\b|\bhow are you\b|\bdo you (?:feel|know you)\b/i,
  /(?<![\p{L}])(?:comment t['’]appelles-tu|pourquoi t['’]appelles-tu|es-tu (?:réelle?|humaine?|un robot))(?![\p{L}])/iu,
  // The site: what it is, its look, its controls.
  /\b(?:this (?:site|website)|the (?:site|website|header|dock|lights?|toggle|footer|menu)|dark mode|light mode|dusk|theme|fonts?|typeface|colou?rs?|animations?|who (?:built|made|designed) (?:this|the) (?:site|website)|(?:play|put on) (?:some )?(?:music|a record)|dim the lights)\b/i,
  // Off the portfolio's subject.
  /\b(?:weather|jokes?|recipes?|football|soccer|capital of|movies?|songs?|poems?|sing|bitcoin|horoscope|translate|tell me a story|meaning of life|who won|president|news)\b/i,
];

/** A greeting or a bit of chat: short, and it opens with a greeting or a reaction. */
const GREETING = /^(?:hi|hello|hey|hiya|yo|bonjour|salut|bonsoir|good (?:morning|afternoon|evening)|thanks?|thank you|merci|cheers|lol|haha|ok(?:ay)?|cool|nice|wow|what'?s up|ça va)$/i;
const isGreeting = (question: string): boolean => {
  const words = question.toLowerCase().replace(/[^\p{L}\p{N}'’ ]+/gu, " ").trim().split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 6) return false;
  return GREETING.test(words[0]) || (words.length > 1 && GREETING.test(`${words[0]} ${words[1]}`));
};

/** Pure: factual or light for this turn. No model, no history. Uncertain means factual. */
export function roseRegister(ctx: RoseRegisterContext): RoseRegister {
  const question = (ctx.question ?? "").slice(0, 2000);
  if (ctx.listen) return "factual";
  if (getRoseCuratedAnswer({ question, pagePath: ctx.pagePath }) !== null) return "factual";
  if (isRoseTechnicalEvaluationQuestion({ question, pagePath: ctx.pagePath }) ||
      isRoseCareerQuestion(question) || isRoseExplicitMeetingRequest(question) || isRoseCodeAccessRequest(question) ||
      FACTUAL_SIGNALS.some(re => re.test(question))) return "factual";
  if (LIGHT_SIGNALS.some(re => re.test(question)) || isGreeting(question)) return "light";
  return "factual";
}

/** The one line the turn's prompt carries. */
export const roseRegisterLine = (ctx: RoseRegisterContext): string => ROSE_REGISTER_LINES[roseRegister(ctx)];
