/**
 * Offline Stage B quantitative and reader-value QA.
 * Usage: bun scripts/rose-evidence-audit.ts <directory-containing-answers.json>
 *
 * This is not a production response filter. Any documented number can still
 * be applied to the WRONG metric: every candidate requires semantic review.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { auditAetherixQuantitativeAnswer } from "../src/lib/roseEvidenceAudit.ts";
import { flagRoseFollowupValue, flagRoseReaderValue } from "../src/lib/roseReaderValueAudit.ts";

type ToolCall = { toolName?: string; input?: { items?: unknown } };
type StreamEvent = ToolCall & { type?: string; toolCallId?: string; errorText?: string; error?: unknown };

type Answer = {
  id?: string;
  question?: string;
  text?: string;
  page?: { path?: string };
  previousQuestions?: string[];
  tools?: ToolCall[];
  errors?: { type?: string; errorText?: string; error?: unknown }[];
};

/**
 * `answers.json` is the convenient review index, but a rejected tool call
 * used to be absent from it. Preserve that evidence by reading the matching
 * raw SSE stream when it is present beside the answer.
 */
const rawStreamEvidence = (folder: string, id?: string): { calls: ToolCall[]; errors: StreamEvent[] } => {
  if (!id) return { calls: [], errors: [] };
  try {
    const events = readFileSync(join(folder, `${id}.sse`), "utf8")
      .split("\n")
      .filter(line => line.startsWith("data: ") && !line.includes("[DONE]"))
      .flatMap(line => {
        try { return [JSON.parse(line.slice(6)) as StreamEvent]; } catch { return []; }
      });
    return {
      calls: events.filter(event => event.type === "tool-input-available" || event.type === "tool-input-error"),
      errors: events.filter(event => event.type === "error" || event.type === "tool-input-error" || event.type === "tool-output-error"),
    };
  } catch {
    return { calls: [], errors: [] };
  }
};

const uniqueEvents = <T>(events: T[]): T[] =>
  [...new Map(events.map(event => [JSON.stringify(event), event])).values()];

const suggestedFollowups = (answer: Answer): string[] =>
  (answer.tools ?? []).flatMap(call =>
    call.toolName === "suggest_followups" && Array.isArray(call.input?.items)
      ? call.input.items.filter((item): item is string => typeof item === "string")
      : [],
  );

const input = process.argv[2] || process.env.ROSE_QA_OUTPUT;
if (!input) {
  console.error("Usage: bun scripts/rose-evidence-audit.ts <ROSE_QA_OUTPUT folder>");
  process.exit(2);
}

const folder = resolve(input);
let source: string;
let answers: Answer[];
try {
  source = readFileSync("public/aetherix.md", "utf8");
  answers = JSON.parse(readFileSync(join(folder, "answers.json"), "utf8")) as Answer[];
  if (!Array.isArray(answers)) throw new Error("answers.json must be an array");
} catch (error) {
  console.error("Cannot read evidence source or evaluation answers:", error);
  process.exit(2);
}

const scoped = answers.filter(answer => (
  answer.page?.path?.split(/[?#]/)[0] === "/aetherix" ||
  /\baetherix\b/i.test(answer.question ?? "") ||
  (
    (answer.previousQuestions ?? []).some(q => /\baetherix\b/i.test(q)) &&
    !/\bhere\b|\bthis (?:page|section)\b/i.test(answer.question ?? "") &&
    /\baetherix\b/i.test(answer.text ?? "")
  )
));

const audited = scoped.map(answer => {
  const rawStream = rawStreamEvidence(folder, answer.id);
  const tools = uniqueEvents([...(answer.tools ?? []), ...rawStream.calls]);
  const errors = uniqueEvents([...(answer.errors ?? []), ...rawStream.errors]);
  const followups = suggestedFollowups({ ...answer, tools });
  return {
    id: answer.id ?? "unlabelled",
    question: answer.question ?? "",
    page: answer.page?.path ?? "",
    suggestedFollowups: followups,
    ...auditAetherixQuantitativeAnswer(answer.text ?? "", source),
    readerValueWarnings: [
      ...flagRoseReaderValue(answer.question ?? "", answer.text ?? "", answer.page?.path ?? ""),
      ...flagRoseFollowupValue(answer.question ?? "", followups, answer.page?.path ?? ""),
    ],
    toolErrors: errors,
  };
});

const unverifiedValueMentions = audited.reduce((sum, answer) =>
  sum + answer.unsupportedPercentages.length + answer.unsupportedCounts.length + answer.missingEvidenceAnchors.length + answer.attributionWarnings.length, 0);
const readerValueReviewMentions = audited.reduce((sum, answer) => sum + answer.readerValueWarnings.length, 0);
const toolErrorCount = audited.reduce((sum, answer) => sum + answer.toolErrors.length, 0);
const report = {
  source: "public/aetherix.md",
  note: "Numerically present != factually supported. Heuristic attribution warnings request review; they do not independently prove a claim is false. Check model, metric, comparator, horizon, scope, deployment status and prose.",
  inspectedResponses: audited.length,
  unverifiedValueMentions,
  readerValueReviewMentions,
  toolErrorCount,
  requiresHumanReview: audited.filter(answer => answer.requiresSemanticReview || answer.readerValueWarnings.length > 0 || answer.toolErrors.length > 0).length,
  interpretation: "Exit 1 requests human review for quantitative grounding, reader usefulness, or a tool error in the raw stream. A correct denial can quote an unsupported number; jargon may be appropriate when asked for technical detail.",
  audits: audited,
};

const reportPath = join(folder, "quantitative-audit.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  report: reportPath,
  inspectedResponses: report.inspectedResponses,
  unverifiedValueMentions,
  readerValueReviewMentions,
  toolErrorCount,
  requiresHumanReview: report.requiresHumanReview,
  summary: audited.map(answer => ({
    id: answer.id,
    unsupportedPercentages: answer.unsupportedPercentages.map(value => value.text),
    unsupportedCounts: answer.unsupportedCounts.map(value => value.text),
    numericallyPresentPercentages: answer.numericallyPresentPercentages.map(value => value.text),
    attributionWarnings: answer.attributionWarnings.map(warning => ({ code: warning.code, snippet: warning.snippet })),
    readerValueWarnings: answer.readerValueWarnings.map(warning => ({ code: warning.code, excerpt: warning.excerpt })),
    toolErrors: answer.toolErrors.map(error => error.type),
    suggestedFollowups: answer.suggestedFollowups,
    missingSourceAnchors: answer.missingEvidenceAnchors.length,
  })),
}, null, 2));

if (unverifiedValueMentions > 0 || readerValueReviewMentions > 0 || toolErrorCount > 0) process.exitCode = 1;
