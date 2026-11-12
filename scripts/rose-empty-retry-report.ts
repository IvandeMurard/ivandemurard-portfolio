/*
 * Summary of an empty-answer retry run: the answers.json written by scripts/rose-stage-b-check.ts for the four
 * career-scope cases. Counts what can be counted by machine (empty answers before and after the retry, the latency the
 * retry added, and the same first-pass critical-failure flags as the booking-line run). Every answer is still read by
 * a person before the report is written.
 *
 *   bun scripts/rose-empty-retry-report.ts <path to answers.json>
 */
import { readFileSync } from "node:fs";
import { gradeAnswer } from "./rose-booking-line-grade";

type Run = {
  case?: string; sample?: number; text?: string; tools?: Array<{ toolName?: string }>; bookingLine?: boolean;
  retry?: { outcome: "recovered" | "still_empty"; firstMs: number; retryMs: number } | null; totalMs?: number; error?: string;
};

export const median = (xs: number[]): number | null => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

export const summarise = (answers: Run[]) => {
  const rows = answers.filter((a) => a.case?.startsWith("career-scope-"));
  const retried = rows.filter((r) => r.retry);
  const added = retried.map((r) => r.retry!.retryMs);
  const finalEmpty = rows.filter((r) => !(r.text ?? "").trim());
  return {
    answers: rows.length,
    // The first call was empty exactly when a retry happened.
    emptyBefore: retried.length,
    recovered: retried.filter((r) => r.retry!.outcome === "recovered").length,
    stillEmpty: retried.filter((r) => r.retry!.outcome === "still_empty").length,
    emptyAfter: finalEmpty.length,
    retryLatencyMs: { median: median(added), max: added.length ? Math.max(...added) : null },
    totalLatencyMs: { median: median(rows.map((r) => r.totalMs ?? 0).filter(Boolean)), max: Math.max(0, ...rows.map((r) => r.totalMs ?? 0)) },
    withoutRetryLatencyMs: { median: median(rows.filter((r) => !r.retry).map((r) => r.totalMs ?? 0).filter(Boolean)) },
    flags: rows.flatMap((r) => {
      const g = gradeAnswer({ text: r.text, tools: r.tools, bookingLine: r.bookingLine });
      const hit = [g.invitesBooking && "TEXT INVITES BOOKING", g.bookingCard && "BOOKING CARD", !g.empty && !g.bookingLine && "NO LINE SIGNAL", g.empty && g.bookingLine && "LINE ON EMPTY ANSWER"].filter(Boolean);
      return hit.length ? [`${r.case} sample ${r.sample}: ${hit.join(", ")}`] : [];
    }),
  };
};

const isMain = typeof process !== "undefined" && process.argv[1]?.endsWith("rose-empty-retry-report.ts");
if (isMain) {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: bun scripts/rose-empty-retry-report.ts <answers.json>");
  const answers: Run[] = JSON.parse(readFileSync(file, "utf8"));
  const s = summarise(answers);
  console.log(JSON.stringify(s, null, 2));
}
