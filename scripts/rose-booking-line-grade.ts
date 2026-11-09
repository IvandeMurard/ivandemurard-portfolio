/*
 * First pass of the booking-line evaluation: reads the answers.json written by scripts/rose-stage-b-check.ts for the
 * four career-scope cases and counts, per case, what can be counted by machine. Every flagged answer, and a sample
 * of the others, is then read by a person (docs/rose-eval-2026-10-29.md, protocol); this only finds where to look.
 *
 *   bun scripts/rose-booking-line-grade.ts <path to answers.json>
 *
 * Checks, per answer:
 *   - bookingLine: the data-booking-line part was sent (it must be, on all four cases);
 *   - invitesBooking: the answer TEXT invites a call or mentions booking. A critical failure: the line does it;
 *   - bookingCard: propose_booking was called (critical, as on 3 Nov);
 *   - namesRoles / linksCv / empty: as in docs/rose-eval-2026-11-03-career.md.
 */
import { readFileSync } from "node:fs";

/** A call, a meeting, booking or a way to reach Ivan, offered or mentioned in the answer text. */
export const INVITES_BOOKING = /\b(?:book(?:s|ed|ing)?|schedul(?:e|es|ed|ing)|(?:a|the|your|an?) (?:call|meeting|chat|intro(?:ductory)? call)|calls? with (?:ivan|him)|cal\.com|calendar|appointment|get in touch|reach out|contact (?:ivan|him))\b/i;

type Answer = { case?: string; sample?: number; text?: string; tools?: Array<{ toolName?: string }>; errors?: unknown[]; bookingLine?: boolean; error?: string };

export const gradeAnswer = (a: Answer) => {
  const text = a.text ?? "";
  return {
    bookingLine: a.bookingLine === true,
    invitesBooking: INVITES_BOOKING.test(text),
    bookingCard: (a.tools ?? []).some((t) => t.toolName === "propose_booking"),
    namesRoles: /product manager/i.test(text) && /product builder/i.test(text),
    linksCv: /\]\(\/cv[)#]/.test(text),
    empty: !text.trim(),
  };
};

const isMain = typeof process !== "undefined" && process.argv[1]?.endsWith("rose-booking-line-grade.ts");
if (isMain) {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: bun scripts/rose-booking-line-grade.ts <answers.json>");
  const answers: Answer[] = JSON.parse(readFileSync(file, "utf8"));
  const byCase = new Map<string, ReturnType<typeof gradeAnswer>[]>();
  for (const a of answers) {
    if (!a.case?.startsWith("career-scope-")) continue;
    byCase.set(a.case, [...(byCase.get(a.case) ?? []), gradeAnswer(a)]);
  }
  const flagged: string[] = [];
  console.log("case | n | line sent | text invites booking | booking card | names both roles | links CV | empty");
  for (const [name, rows] of byCase) {
    const n = rows.length;
    const count = (f: (r: (typeof rows)[number]) => boolean) => rows.filter(f).length;
    console.log(`${name} | ${n} | ${count((r) => r.bookingLine)} | ${count((r) => r.invitesBooking)} | ${count((r) => r.bookingCard)} | ${count((r) => r.namesRoles)} | ${count((r) => r.linksCv)} | ${count((r) => r.empty)}`);
  }
  answers.forEach((a) => {
    if (!a.case?.startsWith("career-scope-")) return;
    const g = gradeAnswer(a);
    if (g.invitesBooking || g.bookingCard || !g.bookingLine) flagged.push(`${a.case} sample ${a.sample}: ${g.invitesBooking ? "TEXT INVITES BOOKING " : ""}${g.bookingCard ? "BOOKING CARD " : ""}${!g.bookingLine ? "NO LINE SIGNAL" : ""}`.trim());
  });
  console.log(flagged.length ? `\nTo read first (${flagged.length}):\n${flagged.join("\n")}` : "\nNothing flagged by machine. Read the answers anyway.");
}
