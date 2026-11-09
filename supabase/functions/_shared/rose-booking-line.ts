/**
 * The booking line: on a profile question (not an explicit request for a call), the interface adds one line under
 * Rose's answer, "If this fits a role you are hiring for, book a call with Ivan." The server only emits a signal,
 * one UI-message data part after the text; the words and the link belong to the dock. Nothing in the answer changes.
 *
 * Pure stream code, no imports: rose-chat (Deno) and the evaluation runner (scripts/rose-stage-b-check.ts) use the
 * same function, so the evaluation sees the signal the site sends.
 */
export const ROSE_BOOKING_LINE_PART = "data-booking-line";

type Chunk = { type: string; delta?: string };

/**
 * Passes every chunk through unchanged and adds the data part just before the stream finishes, but only if the
 * answer has text. An empty or failed answer gets no line.
 */
export function withRoseBookingLine<T extends Chunk>(stream: ReadableStream<T>): ReadableStream<T | { type: typeof ROSE_BOOKING_LINE_PART; data: { show: true } }> {
  let hasText = false;
  let failed = false;
  return stream.pipeThrough(new TransformStream<T, T | { type: typeof ROSE_BOOKING_LINE_PART; data: { show: true } }>({
    transform(chunk, controller) {
      if (chunk.type === "text-delta" && (chunk.delta ?? "").trim().length > 0) hasText = true;
      if (chunk.type === "error" || chunk.type === "abort") failed = true;
      if (chunk.type === "finish" && hasText && !failed) controller.enqueue({ type: ROSE_BOOKING_LINE_PART, data: { show: true } });
      controller.enqueue(chunk);
    },
  }));
}
