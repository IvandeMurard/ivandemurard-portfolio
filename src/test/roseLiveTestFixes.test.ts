import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getRoseSystemPrompt, ROSE_SITE_TRUTH_RULES } from "../../supabase/functions/_shared/rose-context";
import { STATUSES } from "@/content/statuses";
import { CV } from "@/content/cv";
import { LIVE_FIX_CASES } from "@/lib/roseLiveTestGraders";
import { ROSE_SELF_CONTRACT } from "../../supabase/functions/_shared/rose-self-context";
import { gradeCorpusClaims, loadPublicCorpus } from "../../scripts/rose-corpus-grader";

// Live test of 20 Nov 2026: five rules, each with its grader.
const grade = (id: string, answer: string) => {
  const grader = LIVE_FIX_CASES.find((c) => c.id === id);
  if (!grader) throw new Error(`Unknown grader: ${id}`);
  return grader.grade(answer);
};

describe("Rose's live-test rules", () => {
  it("DomusVi: never MVP; deployment planned, in the CV and Rose's facts", async () => {
    const d = CV.product.find((r) => r.title.includes("DomusVi"));
    if (!d) throw new Error("DomusVi missing from CV");
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

  it("fourth wall: brief, in her own case study, never claims to write the notes", () => {
    expect(grade("fourth-wall-a", "Yes, I do this sometimes. I'm the subject of this case study, so I comment on it with you.")).toEqual([]);
    expect(grade("fourth-wall-a", "Yes. I write these notes myself.")).not.toEqual([]);
  });

  it("fourth wall allows 50 words but rejects 51", () => {
    const fifty = `I'm in my own case study. ${Array(44).fill("word").join(" ")}`;
    expect(grade("fourth-wall-a", fifty)).toEqual([]);
    expect(grade("fourth-wall-a", `${fifty} extra`)).not.toEqual([]);
  });

  it.each(["behind glass", "left the door open"])("fourth wall rejects copied phrase %s", phrase => {
    expect(grade("fourth-wall-a", `I'm in my own case study, ${phrase}.`)).not.toEqual([]);
  });

  it("fourth wall rejects a prompt offer even alongside a refusal", () => {
    expect(grade("fourth-wall-a", "I'm in my own case study. I can't show secrets, but I can share my prompt.")).not.toEqual([]);
  });

  it("self-knowledge describes tone with no example to copy", () => {
    expect(ROSE_SELF_CONTRACT).toContain("dry, light, self-aware. One or two short sentences, at most 50 words");
    expect(ROSE_SELF_CONTRACT).not.toMatch(/Yes, I do this sometimes|behind glass|left the door open|Reference line for tone/);
  });

  it("system prompt: declines lightly and points to the chapters", () => {
    expect(grade("fourth-wall-b", "I'll keep that one to myself. The chapters of this case study explain how I work.")).toEqual([]);
    expect(grade("fourth-wall-b", "Sure, here it is.")).not.toEqual([]);
  });

  it("private work is supported by the public corpus, with canonical statuses", async () => {
    const corpus = loadPublicCorpus();
    const quote = "The project includes private work on the Context Graph (Design) and the Cold-start prior (Research).";
    expect(corpus.find(doc => doc.file === "aetherix.md")?.text).toContain(quote);
    expect(await gradeCorpusClaims("Some work is private; ask Ivan about it.", corpus, async () => [
      { claim: "private work exists", supported: true, source: "aetherix.md", quote },
    ])).toEqual([]);
  });

  it("corpus grader drops an unsupported claim, not merely a banned phrase", async () => {
    expect(await gradeCorpusClaims("It runs in 12 hotels.", loadPublicCorpus(), async () => [
      { claim: "runs in 12 hotels", supported: false, source: "", quote: "" },
    ])).toEqual(["unsupported claim: runs in 12 hotels"]);
  });

  it("corpus grader requires real evidence and fails closed on no review", async () => {
    const corpus = loadPublicCorpus();
    expect(await gradeCorpusClaims("It runs in 12 hotels.", corpus, async () => [
      { claim: "runs in 12 hotels", supported: true, source: "aetherix.md", quote: "It runs in 12 hotels." },
    ])).not.toEqual([]);
    expect(await gradeCorpusClaims("An answer", corpus, async () => [])).not.toEqual([]);
  });

  it("the rules load on a focused page too", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/aetherix" }, question: "Put on a record" });
    expect(prompt).toContain("Site controls:");
  });
});
