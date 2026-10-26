/**
 * Lightweight offline QA hints for visitor usefulness.
 * These are review cues, not a measure of actual visitor comprehension.
 * A human reviewer must decide whether the answer helps the visitor.
 */
export type RoseReaderValueWarning = {
  code: "unrequested_implementation_detail" | "noncanonical_field_note_link" | "unsupported_guardrail_reliability";
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

/** Detect only obvious answer-design regressions observed in scoped QA. */
export function flagRoseReaderValue(question: string, answer: string, pagePath = ""): RoseReaderValueWarning[] {
  const warnings: RoseReaderValueWarning[] = [];
  const simpleMeasurementQuestion = /^(?:what does (?:ivan|he) measure(?: here)?|what (?:is|are) (?:ivan's|his|the) (?:main )?metrics?)\s*\??$/i.test(question.trim());
  const technicalIntent = /\b(?:CI|pipeline|release|code changes?|tests?|harness|graders?|golden datasets?|technical|implementation)\b/i.test(question);

  if (pagePath.split(/[?#]/)[0] === "/aetherix" && simpleMeasurementQuestion && !technicalIntent) {
    const mention = /\b(?:golden datasets?|versioned datasets?|CI (?:gate|pipeline)|every code change|unit tests?|release pipeline)\b/i.exec(answer);
    if (mention) warnings.push({
      code: "unrequested_implementation_detail",
      excerpt: excerptAround(answer, mention.index, mention[0].length),
      reason: "A plain-language measurement question should lead with what is measured, a useful comparison and its limits, not unsolicited software-release mechanisms.",
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
