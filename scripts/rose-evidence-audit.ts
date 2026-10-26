/**
 * Offline Stage B quantitative QA.
 * Usage: bun scripts/rose-evidence-audit.ts <directory-containing-answers.json>
 *
 * This is not a production response filter. Any documented number can still
 * be applied to the WRONG metric: every candidate requires semantic review.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { auditAetherixQuantitativeAnswer } from "../src/lib/roseEvidenceAudit.ts";

type Answer = {
  id?: string;
  question?: string;
  text?: string;
  page?: { path?: string };
  previousQuestions?: string[];
};

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

const audited = scoped.map(answer => ({
  id: answer.id ?? "unlabelled",
  question: answer.question ?? "",
  page: answer.page?.path ?? "",
  ...auditAetherixQuantitativeAnswer(answer.text ?? "", source),
}));

const unverifiedValueMentions = audited.reduce((sum, answer) =>
  sum + answer.unsupportedPercentages.length + answer.unsupportedCounts.length + answer.missingEvidenceAnchors.length, 0);
const report = {
  source: "public/aetherix.md",
  note: "Numerically present != factually supported. Human must verify metric, comparator, sample, scope, deployment status and prose claims.",
  inspectedResponses: audited.length,
  unverifiedValueMentions,
  requiresHumanReview: audited.filter(answer => answer.requiresSemanticReview).length,
  interpretation: "Exit 1 requests human review: figures in denials or corrections can be valid even when absent from source.",
  audits: audited,
};

const reportPath = join(folder, "quantitative-audit.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  report: reportPath,
  inspectedResponses: report.inspectedResponses,
  unverifiedValueMentions,
  requiresHumanReview: report.requiresHumanReview,
  summary: audited.map(answer => ({
    id: answer.id,
    unsupportedPercentages: answer.unsupportedPercentages.map(value => value.text),
    unsupportedCounts: answer.unsupportedCounts.map(value => value.text),
    numericallyPresentPercentages: answer.numericallyPresentPercentages.map(value => value.text),
    missingSourceAnchors: answer.missingEvidenceAnchors.length,
  })),
}, null, 2));

if (unverifiedValueMentions > 0) process.exitCode = 1;
