import { describe, expect, it, vi, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import { getRosePrompts } from "../content/rosePrompts";
import { selectRoseHistory, roseHistoryLayer } from "../../supabase/functions/_shared/rose-self-context";
import { getRoseSystemPrompt } from "../../supabase/functions/_shared/rose-context";

afterEach(() => vi.unstubAllGlobals());
describe("Rose canonical knowledge", () => {
  it("generated reference and persona match canonical sources and resolve provenance", () => {
    expect(execFileSync("bun", ["scripts/generate-rose-history.ts", "--check"], { encoding: "utf8" })).toContain("v1 verified");
  });
  it("selects only the exact lab route, including its query", () => {
    expect(selectRoseHistory("/rose-design-lab?concept=narrative", "Explain this")).toBe(true);
    expect(selectRoseHistory("/rose-design-lab-other", "Explain this")).toBe(false);
  });
  it("selects self-history on ordinary routes", () => {
    expect(selectRoseHistory("/aetherix", "Why were you built around booking first?")).toBe(true);
    expect(selectRoseHistory("/cv", "Who are you?")).toBe(true);
    expect(selectRoseHistory("/sonor", "When did Sonor stop?")).toBe(false);
  });
  it("keeps pronoun-only follow-ups grounded after navigation", () => {
    expect(selectRoseHistory("/aetherix", "What made that change?", ["Why was Rose built for booking?"])).toBe(true);
    expect(selectRoseHistory("/aetherix", "What made that change?", ["Explain Aetherix"])).toBe(false);
  });
  it("bounds retention to the last twenty user turns", () => {
    expect(selectRoseHistory("/sonor", "Tell me more", ["Who is Rose?", ...Array(20).fill("Sonor")])).toBe(false);
  });
  it("does not invent history when its reference is unavailable", () => {
    expect(roseHistoryLayer(true, null)).toContain("Do not invent dates");
    expect(roseHistoryLayer(false)).toBe("");
  });
  it("maintains the reference budget and July/August dates", () => {
    const layer = roseHistoryLayer(true);
    expect(layer.length).toBeLessThan(16200);
    expect(layer).toContain("route-starters (2026-08-07, implemented)");
    expect(layer).toContain("route-starters-refinement (2026-08-10, implemented)");
    expect(layer).toContain("page-context (2026-08-10, implemented)");
  });
  it("offers lab self-reflection with the existing booking action intact", () => {
    const prompts = getRosePrompts("/rose-design-lab");
    expect(prompts[0].message).toBe("Why were you built around booking first?");
    expect(prompts.at(-1)?.booking).toBe(true);
  });
  it("assembles persona separately and selectively injects historical facts", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Published reference", { status: 200 })));
    const ordinary = await getRoseSystemPrompt({ page: { path: "/sonor" }, question: "When did Sonor stop?" });
    expect(ordinary).toContain("Self-reference behavior (system instructions");
    expect(ordinary).not.toContain("BEGIN ROSE FACTUAL REFERENCE");
    const followup = await getRoseSystemPrompt({ page: { path: "/aetherix" }, question: "Why did that change?", previousQuestions: ["Why was Rose built?"] });
    expect(followup).toContain("BEGIN ROSE FACTUAL REFERENCE");
    expect(followup).toContain("First-person").not; // assertions below check real behavior, not display copy
    expect(followup).toContain("speak naturally in the first person");
  });
});