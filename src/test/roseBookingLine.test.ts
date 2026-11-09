import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { getRoseSystemPrompt, shouldShowRoseBookingLine } from "../../supabase/functions/_shared/rose-context";
import { ROSE_NO_BOOKING_NOTICE } from "../../supabase/functions/_shared/rose-tool-contract";
import { ROSE_BOOKING_LINE_PART, withRoseBookingLine } from "../../supabase/functions/_shared/rose-booking-line";
import { createRoseTools } from "../../supabase/functions/_shared/rose-tools";
import { tool } from "ai";
import { z } from "zod";

// The booking line: on a profile question the server adds one data part after the text. Nothing else changes.
beforeAll(() => { vi.stubGlobal("fetch", vi.fn(async (url: string) => new Response(`# Mirror of ${url}`, { status: 200 }))); });
afterAll(() => vi.unstubAllGlobals());

type Chunk = { type: string; [k: string]: unknown };
const run = async (chunks: Chunk[]): Promise<Chunk[]> => {
  const source = new ReadableStream<Chunk>({ start(c) { chunks.forEach((x) => c.enqueue(x)); c.close(); } });
  const out: Chunk[] = [];
  const reader = withRoseBookingLine(source).getReader();
  for (;;) { const { done, value } = await reader.read(); if (done) break; out.push(value as Chunk); }
  return out;
};
const answer = (text: string): Chunk[] => [
  { type: "start", messageId: "m" }, { type: "start-step" },
  { type: "text-start", id: "t" }, { type: "text-delta", id: "t", delta: text }, { type: "text-end", id: "t" },
  { type: "finish-step" }, { type: "finish", finishReason: "stop" },
];

describe("Which questions get the booking line", () => {
  const career: Array<[string, string]> = [
    ["career-scope-rose", "What kind of role is Ivan looking for, and how does he describe his work?"],
    ["career-scope-aetherix", "What kind of role is Ivan looking for, and how does he describe his work?"],
    ["career-scope-note", "What kind of role is Ivan looking for, and how does he describe his work?"],
    ["career-scope-head-of-product", "Is Ivan open to a Head of Product role?"],
  ];
  for (const [name, question] of career) {
    it(`${name}: yes`, () => expect(shouldShowRoseBookingLine(question)).toBe(true));
  }
  it("not for a technical question", () => {
    expect(shouldShowRoseBookingLine("How did Ivan test the app?")).toBe(false);
    expect(shouldShowRoseBookingLine("What does Ivan measure?")).toBe(false);
  });
  it("not for an explicit request for a call, which keeps the booking card", () => {
    expect(shouldShowRoseBookingLine("Can I book a call with Ivan about a product role?")).toBe(false);
    expect(shouldShowRoseBookingLine("I'd like a meeting to discuss his experience")).toBe(false);
  });
});

describe("The data part", () => {
  it("comes once, after the text and before the stream finishes, and leaves every other chunk as it was", async () => {
    const source = answer("He is open to AI Product Manager and Product Builder roles.");
    const out = await run(source);
    expect(out.filter((c) => c.type === ROSE_BOOKING_LINE_PART)).toHaveLength(1);
    expect(out.map((c) => c.type)).toEqual([
      "start", "start-step", "text-start", "text-delta", "text-end", "finish-step", ROSE_BOOKING_LINE_PART, "finish",
    ]);
    expect(out.filter((c) => c.type !== ROSE_BOOKING_LINE_PART)).toEqual(source);
    expect(ROSE_BOOKING_LINE_PART).toBe("data-booking-line");
  });

  it("is not added to an answer with no text, nor to a failed one", async () => {
    expect((await run(answer("   "))).some((c) => c.type === ROSE_BOOKING_LINE_PART)).toBe(false);
    const failed = [{ type: "start" }, { type: "text-delta", id: "t", delta: "Partial" }, { type: "error", errorText: "x" }, { type: "finish" }];
    expect((await run(failed)).some((c) => c.type === ROSE_BOOKING_LINE_PART)).toBe(false);
  });
});

describe("The answer itself stays free of any booking invitation", () => {
  it("the notice says the interface adds the line and forbids inviting a call or mentioning booking", () => {
    expect(ROSE_NO_BOOKING_NOTICE).toBe(
      "For this turn the propose_booking tool is not available. The interface adds a booking line under your answer itself: do not invite a call or mention booking in the answer.",
    );
  });

  it("is in the prompt of a profile question, and not in the prompt of an explicit request for a call", async () => {
    const profile = await getRoseSystemPrompt({ page: { path: "/rose-design-lab" }, question: "Is Ivan open to a Head of Product role?" });
    expect(profile).toContain(ROSE_NO_BOOKING_NOTICE);
    const call = await getRoseSystemPrompt({ page: { path: "/cv" }, question: "Can I book a call with Ivan about a product role?" });
    expect(call).not.toContain(ROSE_NO_BOOKING_NOTICE);
  });

  it("the booking tool is still withheld on a profile question", () => {
    const tools = createRoseTools({ tool, z } as never, { question: "What kind of role is Ivan looking for?", pagePath: "/rose-design-lab" });
    expect(Object.keys(tools)).not.toContain("propose_booking");
  });
});

describe("rose-chat and the evaluation runner send the same signal", () => {
  const chat = readFileSync("supabase/functions/rose-chat/index.ts", "utf8");
  const runner = readFileSync("scripts/rose-stage-b-check.ts", "utf8");
  for (const [name, source] of [["rose-chat", chat], ["scripts/rose-stage-b-check.ts", runner]] as const) {
    it(`${name} adds the part only for shouldShowRoseBookingLine, through withRoseBookingLine`, () => {
      expect(source).toContain("shouldShowRoseBookingLine(");
      expect(source).toContain("withRoseBookingLine(");
    });
  }
  it("the runner records the signal with each answer", () => {
    expect(runner).toContain("bookingLine");
    expect(runner).toContain("ROSE_BOOKING_LINE_PART");
  });
});
