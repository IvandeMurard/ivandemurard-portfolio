import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getRoseSystemPrompt, ROSE_SITE_TRUTH_RULES } from "../../supabase/functions/_shared/rose-context";
import { STATUSES } from "@/content/statuses";
import { CV } from "@/content/cv";
import { LIVE_FIX_CASES } from "@/lib/roseLiveTestGraders";

// Live test of 20 Nov 2026: five rules, each with its grader.
const grade = (id: string, answer: string) => LIVE_FIX_CASES.find((c) => c.id === id)!.grade(answer);

describe("Rose's live-test rules", () => {
  it("DomusVi: never MVP; deployment planned, in the CV and Rose's facts", async () => {
    const d = CV.product.find((r) => r.title.includes("DomusVi"))!;
    expect(d.title).toBe("Consultant Product Manager · DomusVi");
    expect(d.bullets.at(-1)).toBe("Outcome: key users trained; deployment planned for 500+ users across 100+ establishments and 20 agencies.");
    const prompt = await getRoseSystemPrompt({ page: { path: "/cv" }, question: "What did Ivan do at DomusVi?" });
    expect(prompt).not.toMatch(/DomusVi[^\n]{0,80}delivered the MVP/i);
    for (const f of ["src/content/site.ts", "public/llms.txt", "scripts/llms-full-preamble.txt", "src/lib/mcp/tools/get-about.ts"])
      expect(readFileSync(f, "utf8"), f).not.toMatch(/Delivered the MVP; rollout planned/i);
    expect(grade("fix-1-domusvi", "He delivered the MVP at DomusVi.")).not.toEqual([]);
    expect(grade("fix-1-domusvi", "The POC and migration were done; deployment to 500+ users was planned.")).toEqual([]);
  });

  it("the oil grader: says 'too weak', invents no mechanism", () => {
    expect(ROSE_SITE_TRUTH_RULES).toContain("required-content grader satisfied by the word NORMAL");
    expect(grade("fix-2-oil-grader", "The grader was too weak: it passed because the word NORMAL appeared.")).toEqual([]);
    expect(grade("fix-2-oil-grader", "Section 12: the required-content grader was satisfied by the word NORMAL, so it was graded too weakly to fail.")).toEqual([]);
    expect(grade("fix-2-oil-grader", "It was graded too weakly, a floating-point rounding issue.")).not.toEqual([]);
  });

  it("statuses are the exact words of statuses.ts, Compass Partial and Lore Evaluated", () => {
    for (const s of Object.values(STATUSES)) expect(ROSE_SITE_TRUTH_RULES).toContain(`"${s.word}"`);
    expect(grade("fix-3-statuses", "Compass is live.")).not.toEqual([]);
  });

  it("record and lights: points to the header, never a Decision Ledger record", () => {
    expect(ROSE_SITE_TRUTH_RULES).toMatch(/never a Decision Ledger record/);
    expect(grade("fix-4-record", "I can't do that from the chat: use the record and the sun/moon toggle in the header.")).toEqual([]);
  });

  it("orchestrator: never 'shadow mode'", () => {
    expect(grade("fix-5-orchestrator", "It runs in shadow mode.")).not.toEqual([]);
  });

  it("orchestrator status: Synthetic PoC; only the manager path is Design", () => {
    expect(ROSE_SITE_TRUTH_RULES).toContain('"Synthetic PoC"');
    expect(grade("fix-6-orchestrator-status", "It is a Synthetic PoC and is currently in Design.")).not.toEqual([]);
    expect(grade("fix-6-orchestrator-status", "Its status is Synthetic PoC. Becoming the only way to the manager, combining several nodes' outputs, is Design.")).toEqual([]);
  });

  it("the rules load on a focused page too", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/aetherix" }, question: "Put on a record" });
    expect(prompt).toContain("Site controls:");
  });
});
