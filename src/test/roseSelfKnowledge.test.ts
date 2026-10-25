import { describe, expect, it, vi, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { getRosePrompts } from "../content/rosePrompts";
import { selectRoseHistory, roseHistoryLayer, ROSE_CANONICAL_ANCHORS } from "../../supabase/functions/_shared/rose-self-context";
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
    expect(followup).toContain("speak naturally in the first person");
  });
  it("derives exact date and retention anchors from the single canonical history", () => {
    expect(ROSE_CANONICAL_ANCHORS.launchDate).toBe("2026-07-21");
    expect(ROSE_CANONICAL_ANCHORS.eventPurgeDays).toBe("90");
  });

  it("prioritizes Rose evidence over unrelated case studies on the lab route", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Project fact", { status: 200 })));
    const answer = await getRoseSystemPrompt({
      page: { path: "/rose-design-lab", section_id: "scene-c", section_heading: "Start with the work." },
      question: "What does Ivan measure?",
    });
    expect(answer).toContain("BEGIN ROSE FACTUAL REFERENCE");
    expect(answer).toContain("launch (2026-07-21, implemented)");
    expect(answer).not.toContain("--- BEGIN CASE STUDY: aetherix ---");
    expect(answer).not.toContain("--- BEGIN CASE STUDY: lore ---");
    expect(answer).toContain("On the Rose design-lab page");
  });

  it("keeps named external project evidence available from Rose's case study", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Project fact", { status: 200 })));
    const answer = await getRoseSystemPrompt({
      page: { path: "/rose-design-lab" },
      question: "How is Rose's approach different from Aetherix?",
    });
    expect(answer).toContain("--- BEGIN CASE STUDY: aetherix ---");
    expect(answer).not.toContain("--- BEGIN CASE STUDY: sonor ---");
  });

  it("retains the current project's evidence in a Rose-to-Aetherix journey", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Project fact", { status: 200 })));
    const answer = await getRoseSystemPrompt({
      page: { path: "/aetherix" },
      question: "How do your human-agency principles relate to the manager here?",
      previousQuestions: ["Why were you designed around booking first?"],
    });
    expect(answer).toContain("BEGIN ROSE FACTUAL REFERENCE");
    expect(answer).toContain("--- BEGIN CASE STUDY: aetherix ---");
    expect(answer).not.toContain("--- BEGIN CASE STUDY: lore ---");
  });

  it("uses exactly the same tool descriptions in evaluation and live handler", () => {
    const edge = readFileSync("supabase/functions/rose-chat/index.ts", "utf8");
    const harness = readFileSync("scripts/rose-stage-b-check.ts", "utf8");
    for (const name of ["ROSE_BOOKING_TOOL_DESCRIPTION", "ROSE_FOLLOWUPS_TOOL_DESCRIPTION"]) {
      expect(edge).toContain(name);
      expect(harness).toContain(name);
    }
  });

});