import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { retryIfEmpty, isRoseAnswerChunk, type RoseRetryInfo } from "../../supabase/functions/_shared/rose-empty-retry";
import { withRoseBookingLine, ROSE_BOOKING_LINE_PART } from "../../supabase/functions/_shared/rose-booking-line";

// An answer with no text is asked for once more before anything reaches the dock.
type Chunk = { type: string; [k: string]: unknown };

const text = (id: string, words: string): Chunk[] => [
  { type: "start", messageId: id }, { type: "start-step" },
  { type: "text-start", id }, { type: "text-delta", id, delta: words }, { type: "text-end", id },
  { type: "finish-step" }, { type: "finish", finishReason: "stop" },
];
/** The empty answer of 9 Nov: only a follow-up chips call, no text. */
const empty = (id: string): Chunk[] => [
  { type: "start", messageId: id }, { type: "start-step" },
  { type: "tool-input-start", toolCallId: "t", toolName: "suggest_followups" },
  { type: "tool-input-available", toolCallId: "t", toolName: "suggest_followups", input: { items: ["Would he tell me more?"] } },
  { type: "finish-step" }, { type: "finish", finishReason: "tool-calls" },
];
const card = (id: string): Chunk[] => [
  { type: "start", messageId: id }, { type: "start-step" },
  { type: "tool-input-start", toolCallId: "b", toolName: "propose_booking" },
  { type: "tool-input-available", toolCallId: "b", toolName: "propose_booking", input: { intent: "product", reason: "x" } },
  { type: "finish-step" }, { type: "finish", finishReason: "tool-calls" },
];

const streamOf = (chunks: Chunk[]) => new ReadableStream<Chunk>({ start(c) { chunks.forEach((x) => c.enqueue(x)); c.close(); } });
const drain = async <T,>(s: ReadableStream<T>): Promise<T[]> => {
  const out: T[] = []; const r = s.getReader();
  for (;;) { const { done, value } = await r.read(); if (done) break; out.push(value); }
  return out;
};
/** A model that answers with the given attempts in order, and counts its calls. */
const model = (attempts: Chunk[][]) => {
  const calls = { n: 0 };
  return { calls, start: () => streamOf(attempts[Math.min(calls.n++, attempts.length - 1)]) };
};
const types = (c: Chunk[]) => c.map((x) => x.type);

describe("An answer with text is asked for once", () => {
  it("calls the model exactly once and passes every chunk through unchanged, with no retry logged", async () => {
    const m = model([text("a", "He is open to AI Product Manager roles.")]);
    const logged: RoseRetryInfo[] = [];
    const out = await drain(retryIfEmpty(m.start, { onRetry: (i) => logged.push(i) }));
    expect(m.calls.n).toBe(1);
    expect(out).toEqual(text("a", "He is open to AI Product Manager roles."));
    expect(logged).toEqual([]);
  });

  it("does not hold the answer back: the text reaches the reader before the model has finished", async () => {
    let finish!: () => void;
    const source = new ReadableStream<Chunk>({
      start(c) {
        c.enqueue({ type: "start", messageId: "a" });
        c.enqueue({ type: "text-delta", id: "a", delta: "First words." });
        finish = () => { c.enqueue({ type: "finish" }); c.close(); };
      },
    });
    const reader = retryIfEmpty(() => source).getReader();
    expect((await reader.read()).value).toEqual({ type: "start", messageId: "a" });
    expect((await reader.read()).value).toEqual({ type: "text-delta", id: "a", delta: "First words." });
    finish();
    expect((await reader.read()).value).toEqual({ type: "finish" });
  });

  it("does not treat a booking card as an empty answer", async () => {
    const m = model([card("a")]);
    const out = await drain(retryIfEmpty(m.start));
    expect(m.calls.n).toBe(1);
    expect(out).toEqual(card("a"));
    expect(isRoseAnswerChunk({ type: "tool-input-start", toolName: "suggest_followups" })).toBe(false);
  });

  it("does not retry a call that failed: the error goes out as before", async () => {
    const failed: Chunk[] = [{ type: "start" }, { type: "error", errorText: "rose_unavailable" }, { type: "finish" }];
    const m = model([failed, text("b", "Should never be asked.")]);
    const out = await drain(retryIfEmpty(m.start));
    expect(m.calls.n).toBe(1);
    expect(out).toEqual(failed);
  });
});

describe("An empty first answer", () => {
  it("is asked for again once; only the second answer reaches the reader, and the retry is recorded as recovered", async () => {
    const m = model([empty("first"), text("second", "He is open to AI Product Manager roles.")]);
    const logged: RoseRetryInfo[] = [];
    let t = 1000;
    const out = await drain(retryIfEmpty(m.start, { onRetry: (i) => logged.push(i), now: () => (t += 250) }));
    expect(m.calls.n).toBe(2);
    expect(out).toEqual(text("second", "He is open to AI Product Manager roles."));
    expect(JSON.stringify(out)).not.toContain("first");
    expect(logged).toHaveLength(1);
    expect(logged[0]).toMatchObject({ outcome: "recovered" });
    expect(logged[0].firstMs).toBeGreaterThan(0);
    expect(logged[0].retryMs).toBeGreaterThan(0);
  });

  it("gets the booking line once recovered, as any answer with text does", async () => {
    const m = model([empty("first"), text("second", "He is open to these roles.")]);
    const out = await drain(withRoseBookingLine(retryIfEmpty(m.start)));
    expect(types(out as Chunk[]).filter((x) => x === ROSE_BOOKING_LINE_PART)).toHaveLength(1);
  });
});

describe("Two empty answers in a row", () => {
  it("make exactly two calls, never a third; the second goes out as it is, as today; recorded as still empty", async () => {
    const m = model([empty("first"), empty("second")]);
    const logged: RoseRetryInfo[] = [];
    const out = await drain(retryIfEmpty(m.start, { onRetry: (i) => logged.push(i) }));
    expect(m.calls.n).toBe(2);
    expect(out).toEqual(empty("second"));
    expect(logged.map((i) => i.outcome)).toEqual(["still_empty"]);
  });

  it("have no booking line, and still no text for the dock to show its fallback line", async () => {
    const m = model([empty("first"), empty("second")]);
    const out = (await drain(withRoseBookingLine(retryIfEmpty(m.start)))) as Chunk[];
    expect(types(out)).not.toContain(ROSE_BOOKING_LINE_PART);
    expect(out.some((c) => c.type === "text-delta")).toBe(false);
  });

  it("a failing retry log never breaks the answer", async () => {
    const m = model([empty("first"), text("second", "Recovered.")]);
    const out = await drain(retryIfEmpty(m.start, { onRetry: () => { throw new Error("log down"); } }));
    expect(out).toEqual(text("second", "Recovered."));
  });
});

describe("rose-chat, the runner and the database agree", () => {
  const chat = readFileSync("supabase/functions/rose-chat/index.ts", "utf8");
  const runner = readFileSync("scripts/rose-stage-b-check.ts", "utf8");
  const migration = readFileSync("drizzle/migrations/0005_rose_events_kinds_and_outcome.sql", "utf8");

  it("rose-chat and the evaluation runner both go through retryIfEmpty", () => {
    expect(chat).toContain("retryIfEmpty(");
    expect(runner).toContain("retryIfEmpty(");
  });

  it("rose-chat records kind empty_retry with an outcome, and nothing the visitor wrote or Rose answered", () => {
    const insert = chat.slice(chat.indexOf("const logEmptyRetry"), chat.indexOf("Deno.serve"));
    expect(insert).toContain('kind: "empty_retry"');
    expect(insert).toContain("outcome: info.outcome");
    expect(insert).not.toMatch(/label_or_question|question|text|messages/);
  });

  it("the migration lets the table take empty_retry with the two outcomes", () => {
    expect(migration).toContain("'empty_retry'");
    expect(migration).toContain("'recovered'");
    expect(migration).toContain("'still_empty'");
  });

  it("every kind the dock and rose-chat send is in the table's list (a refused insert is silent)", () => {
    const listed = [...migration.slice(migration.indexOf("CHECK (kind IN (")).matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
    const sent = [...readFileSync("src/components/rose/roseEvents.ts", "utf8").matchAll(/^\s*\| "([a-z_]+)"/gm)].map((m) => m[1]);
    expect(sent.length).toBeGreaterThan(8);
    for (const kind of sent) expect(listed, kind).toContain(kind);
    expect(listed).toContain("empty_retry");
  });
});
