/**
 * Retry of an empty answer. When a model call finishes with no text (only follow-up chips, or nothing), rose-chat
 * calls the model once more with the same messages, before anything reaches the dock. If the second call is also
 * empty, its chunks go out as they are: today's behaviour, the dock shows its fallback line.
 *
 * Pure stream code, no imports: rose-chat (Deno), the evaluation runner and the tests use the same function.
 *
 * Nothing is held back for long. The chunks of an attempt are kept only until its first piece of text (or its first
 * booking card) arrives; from then on the stream goes through live. An attempt that ends without either is the empty
 * one. A call that fails (an "error" chunk) is not retried: it is passed through as before.
 */
type Chunk = { type: string; delta?: string; toolName?: string };

export type RoseRetryInfo = {
  outcome: "recovered" | "still_empty";
  /** Milliseconds the first, empty call took. */
  firstMs: number;
  /** Milliseconds the second call took: the latency the retry added. */
  retryMs: number;
};

/** What makes an answer an answer: some text, or a booking card (a visitor who asks for a call gets the card). */
export const isRoseAnswerChunk = (c: Chunk): boolean =>
  (c.type === "text-delta" && (c.delta ?? "").trim().length > 0) ||
  ((c.type === "tool-input-start" || c.type === "tool-input-available") && c.toolName === "propose_booking");

type Settled = "answered" | "empty" | "failed";

export function retryIfEmpty<T extends Chunk>(
  start: () => ReadableStream<T>,
  options: { now?: () => number; onRetry?: (info: RoseRetryInfo) => void } = {},
): ReadableStream<T> {
  const now = options.now ?? (() => Date.now());
  return new ReadableStream<T>({
    async start(controller) {
      try {
        /** Reads one attempt. Holds its chunks until it is known to be an answer or a failure. */
        const pump = async (stream: ReadableStream<T>, flushIfEmpty: boolean): Promise<Settled> => {
          const reader = stream.getReader();
          const held: T[] = [];
          let settled: Settled | null = null;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (settled === null) {
              held.push(value);
              if (value.type === "error") settled = "failed";
              else if (isRoseAnswerChunk(value)) settled = "answered";
              if (settled !== null) { held.forEach((c) => controller.enqueue(c)); held.length = 0; }
            } else controller.enqueue(value);
          }
          if (settled === null) {
            if (flushIfEmpty) held.forEach((c) => controller.enqueue(c));
            return "empty";
          }
          return settled;
        };

        const t0 = now();
        const first = await pump(start(), false);
        const firstMs = now() - t0;
        if (first !== "empty") { controller.close(); return; }

        const t1 = now();
        const second = await pump(start(), true);
        const retryMs = now() - t1;
        try { options.onRetry?.({ outcome: second === "answered" ? "recovered" : "still_empty", firstMs, retryMs }); } catch { /* logging never blocks the answer */ }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
