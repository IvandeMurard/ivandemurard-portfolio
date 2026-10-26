import { roseFollowupRejection } from "../../supabase/functions/_shared/rose-tool-contract";

/**
 * Lightweight offline QA hints for visitor usefulness.
 * These are review cues, not a measure of actual visitor comprehension.
 * A human reviewer must decide whether the answer helps the visitor.
 */
export type RoseReaderValueWarning = {
  code: "unrequested_implementation_detail" | "unrequested_implementation_followup" | "noncanonical_field_note_link" | "unsupported_guardrail_reliability" | "forecast_recommendation_boundary" | "inflated_delivery_status" | "unscoped_evaluation_gate" | "unsupported_gate_guarantee" | "mixed_evaluation_layers" | "guardrail_merge_conflation" | "misleading_evaluation_link" | "transferred_lore_evaluation" | "release_not_merge" | "missing_merge_exit_code" | "invented_evaluation_detail" | "unsupported_outcome_learning_followup" | "unfocused_technical_followup";
  excerpt: string;
  reason: string;
};

const ALIASED_FIELD_NOTES = [
  "/agent-boundaries-aetherix",
  "/harnesses-graders-closed-loops",
  "/whose-truth-is-the-ground-truth",
];

function excerptAround(text: string, index: number, length: number): string {
  return text.slice(Math.max(0, index - 65), Math.min(text.length, index + length + 90))
    .replace(/\s+/g, " ").trim();
}

function isPlainAetherixMeasurementQuestion(question: string, pagePath: string): boolean {
  const simpleMeasurementQuestion = /^(?:what does (?:ivan|he) measure(?: here)?|what (?:is|are) (?:ivan's|his|the) (?:main )?metrics?)\s*\??$/i.test(question.trim());
  const technicalIntent = /\b(?:CI|pipeline|release|code changes?|tests?|harness|graders?|golden datasets?|technical|implementation)\b/i.test(question);
  return pagePath.split(/[?#]/)[0] === "/aetherix" && simpleMeasurementQuestion && !technicalIntent;
}

function isAetherixTechnicalEvaluationQuestion(question: string, pagePath: string): boolean {
  const technicalEvaluationIntent = /\b(?:evaluation|eval|CI|pipeline|release|merge|gates?|golden datasets?|harness|graders?|tests?)\b/i.test(question);
  return pagePath.split(/[?#]/)[0] === "/aetherix" && technicalEvaluationIntent;
}

/** Detect only obvious answer-design regressions observed in scoped QA. */
export function flagRoseReaderValue(question: string, answer: string, pagePath = ""): RoseReaderValueWarning[] {
  const warnings: RoseReaderValueWarning[] = [];

  if (isPlainAetherixMeasurementQuestion(question, pagePath)) {
    const mention = /\b(?:golden datasets?|versioned datasets?|CI (?:gate|pipeline)|every code change|unit tests?|release pipeline)\b/i.exec(answer);
    if (mention) warnings.push({
      code: "unrequested_implementation_detail",
      excerpt: excerptAround(answer, mention.index, mention[0].length),
      reason: "A plain-language measurement question should lead with what is measured, a useful comparison and its limits, not unsolicited software-release mechanisms.",
    });
  }

  if (pagePath.split(/[?#]/)[0] === "/aetherix") {
    const mention = /\b(?:forecast|prediction) error\s+(?:of|for)\s+(?:the\s+)?(?:agent['’]s\s+)?recommendations?\b/i.exec(answer);
    if (mention) warnings.push({
      code: "forecast_recommendation_boundary",
      excerpt: excerptAround(answer, mention.index, mention[0].length),
      reason: "The published benchmark measures forecast error. A recommendation can be recorded beside an outcome without creating a measured recommendation-accuracy metric.",
    });
  }

  if (isAetherixTechnicalEvaluationQuestion(question, pagePath)) {
    const flag = (code: RoseReaderValueWarning["code"], pattern: RegExp, reason: string) => {
      const mention = pattern.exec(answer);
      if (mention) warnings.push({ code, excerpt: excerptAround(answer, mention.index, mention[0].length), reason });
    };
    flag(
      "unscoped_evaluation_gate",
      /\b(?:(?:block|blocks)\s+(?:any|all)\s+changes?|before\s+any\s+code\s+is\s+merged|core logic)\b/i,
      "The published technical scope is forecasting, providers, memory and prompts. Do not widen it to every possible change.",
    );
    flag(
      "unsupported_gate_guarantee",
      /\b(?:ensure|ensures|guarantee|guarantees).{0,100}\b(?:silent failures?|do not introduce|never introduce)\b/i,
      "A gate catches known regression cases. It does not guarantee that a change cannot introduce a silent failure.",
    );
    flag(
      "mixed_evaluation_layers",
      /\bsynthetic (?:data )?series\b.{0,100}\b(?:a\s+)?(?:rule-?based|stand-?in) parser\b/i,
      "Forecast evaluation on a synthetic series and reply-parser evaluation with a rule-based stand-in are separate layers.",
    );
    flag(
      "invented_evaluation_detail",
      /\b(?:response format|retrieval of historical context (?:remains|stays) relevant|refusal contract|safety guardrails?)\b/i,
      "Do not invent layer-specific checks. The documented Aetherix scope names forecasting, providers, memory and prompts, but does not document those provider, retrieval or refusal checks.",
    );
    flag(
      "guardrail_merge_conflation",
      /\b(?:any|every)\s+(?:trip|trigger|activation).{0,100}\bguardrails?\b.{0,100}\bblocks?\s+(?:the\s+)?merge\b/i,
      "Guardrail trips carry machine-readable reasons. A failing evaluation exit code blocks a merge; do not present every guardrail trip as that verdict.",
    );
    flag(
      "misleading_evaluation_link",
      /\[[^\]]*(?:architecture|evaluation|gate)[^\]]*\]\(https?:\/\/ivandemurard\.com\/journal\/agent-boundaries-aetherix\)/i,
      "The Agent Boundaries note explains responsibility. Link evaluation-gate explanations to the Evaluate Field Note instead.",
    );
    flag(
      "transferred_lore_evaluation",
      /\b(?:real model path|deterministic graders|recovery procedure)\b/i,
      "Recorded real-model grader runs, deterministic graders and recovery-procedure refusal cases are Lore evidence, not documented Aetherix gate evidence.",
    );
    flag(
      "release_not_merge",
      /\bblocks?\s+(?:the\s+)?release\b/i,
      "The documented Aetherix gate decision is before merge. Do not silently broaden it to a release verdict.",
    );
    if (!/\b(?:failing|failed|failure|non-?zero)\b.{0,70}\b(?:evaluation\s+)?exit code\b.{0,70}\bblocks?\s+(?:a\s+|the\s+)?merge\b/i.test(answer)) {
      warnings.push({
        code: "missing_merge_exit_code",
        excerpt: answer.slice(0, 180).replace(/\s+/g, " ").trim(),
        reason: "The documented merge decision is a failing evaluation exit code. A passing exit code or generic CI language does not state that failure path.",
      });
    }
  }

  if (/\bdomusvi\b/i.test(`${question} ${answer}`)) {
    const mention = /\b(?:delivery at scale|(?:live|adopted|rolled out|deployed)\s+(?:to|across)\s+(?:500\+?\s+users|100\s+care homes)|(?:500\+?\s+users|100\s+care homes)\s+(?:were|are)\s+(?:live|adopted))\b/i.exec(answer);
    if (mention) warnings.push({
      code: "inflated_delivery_status",
      excerpt: excerptAround(answer, mention.index, mention[0].length),
      reason: "For DomusVi, the MVP was delivered and the rollout was planned for 500+ users across 100 care homes. Planned reach is not live adoption or delivery at scale.",
    });
  }

  for (const path of ALIASED_FIELD_NOTES) {
    const mention = answer.indexOf("](" + path);
    if (mention >= 0) warnings.push({
      code: "noncanonical_field_note_link",
      excerpt: excerptAround(answer, mention, path.length + 2),
      reason: "This Field Note's valid reader-facing route starts with /journal/. The renderer may repair it, but the raw answer is not correctly linked.",
    });
  }

  const reliability = /\bguardrail reliability\b/i.exec(answer);
  if (reliability && !/\b(?:not (?:measured|established|validated|proven)|unproven|not a measured)\b/i.test(excerptAround(answer, reliability.index, reliability[0].length))) {
    warnings.push({
      code: "unsupported_guardrail_reliability",
      excerpt: excerptAround(answer, reliability.index, reliability[0].length),
      reason: "Machine-readable guardrail reasons do not by themselves demonstrate a validated guardrail-reliability metric.",
    });
  }
  return warnings;
}

/** Review suggested follow-ups separately: they can derail an otherwise useful answer. */
export function flagRoseFollowupValue(question: string, items: readonly string[], pagePath = ""): RoseReaderValueWarning[] {
  const warnings: RoseReaderValueWarning[] = [];
  for (const item of items) {
    const rejection = roseFollowupRejection(item, { question, pagePath });
    if (rejection === "unrequested_implementation") warnings.push({
      code: "unrequested_implementation_followup",
      excerpt: item,
      reason: "A plain-language measurement question should not be extended with release tooling unless the visitor asked for technical detail.",
    });
    if (rejection === "unsupported_outcome_learning") warnings.push({
      code: "unsupported_outcome_learning_followup",
      excerpt: item,
      reason: "A manager override is a declared decision, not evidence that it improves the forecast or recommendation quality.",
    });
    if (rejection === "unfocused_technical") warnings.push({
      code: "unfocused_technical_followup",
      excerpt: item,
      reason: "A technical evaluation follow-up must stay on the gate, its evidence layers or its merge decision.",
    });
  }
  return warnings;
}
