// Provider choice and error mapping for rose-chat. No npm imports, so Vitest can test it.

/** Code the dock recognises to show the paused notice instead of "Rose lost the thread". */
export const ROSE_UNAVAILABLE = "rose_unavailable";

export const GOOGLE_MODEL = "gemini-3-flash-preview";
export const GATEWAY_MODEL = "google/gemini-3-flash-preview";
export const GOOGLE_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai";

/** Retries of a refused or failed model call: the same in rose-chat and in the evaluation script. */
export const ROSE_MAX_RETRIES = 2;

export type RoseProviderChoice = { kind: "google" | "lovable"; apiKey: string; modelId: string };

/** Google directly when its secret is set, the Lovable gateway otherwise. Never logs a key. */
export function chooseRoseProvider(env: { get(name: string): string | undefined }): RoseProviderChoice | null {
  const google = env.get("GOOGLE_GENERATIVE_AI_API_KEY")?.trim();
  if (google) return { kind: "google", apiKey: google, modelId: GOOGLE_MODEL };
  const lovable = env.get("LOVABLE_API_KEY")?.trim();
  if (lovable) return { kind: "lovable", apiKey: lovable, modelId: GATEWAY_MODEL };
  return null;
}

const QUOTA_STATUSES = [402, 429];
const QUOTA_WORDS = /payment required|too many requests|resource_exhausted/i;

/** True when a provider refused for quota or credits: HTTP 402 or 429, also inside a retry wrapper. */
export function isQuotaRefusal(error: unknown, depth = 0): boolean {
  if (!error || typeof error !== "object" || depth > 3) return false;
  const e = error as { statusCode?: unknown; status?: unknown; message?: unknown; lastError?: unknown; cause?: unknown; errors?: unknown };
  const code = typeof e.statusCode === "number" ? e.statusCode : typeof e.status === "number" ? e.status : undefined;
  if (code !== undefined && QUOTA_STATUSES.includes(code)) return true;
  if (code === undefined && typeof e.message === "string" && QUOTA_WORDS.test(e.message)) return true;
  return [e.lastError, e.cause, ...(Array.isArray(e.errors) ? e.errors : [])].some((inner) => isQuotaRefusal(inner, depth + 1));
}

/** Text of the error part in the UI message stream: a distinct code for quota, the usual text otherwise. */
export const roseStreamErrorText = (error: unknown): string => (isQuotaRefusal(error) ? ROSE_UNAVAILABLE : "An error occurred.");

/** The dock side: the error that reached useChat carries the code, as a stream error or as a JSON body. */
export const isRoseUnavailableError = (error: unknown): boolean =>
  !!error && typeof error === "object" && typeof (error as { message?: unknown }).message === "string" &&
  (error as { message: string }).message.includes(ROSE_UNAVAILABLE);

/**
 * Google's OpenAI-compatible endpoint omits `index` on streamed tool_calls, which the SDK requires.
 * Add it back (position in the array). Same workaround as scripts/rose-stage-b-check.ts.
 */
export const withToolCallIndex = (inner: typeof fetch): typeof fetch => async (input, init) => {
  const response = await inner(input, init);
  if (!response.body || !(response.headers.get("content-type") ?? "").includes("text/event-stream")) return response;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let pending = "";
  const fixLine = (line: string): string => {
    if (!line.startsWith("data: ") || line.includes("[DONE]")) return line;
    try {
      const chunk = JSON.parse(line.slice(6));
      for (const choice of chunk.choices ?? []) {
        (choice.delta?.tool_calls ?? []).forEach((call: { index?: number }, i: number) => { if (call.index === undefined) call.index = i; });
      }
      return "data: " + JSON.stringify(chunk);
    } catch { return line; }
  };
  const body = response.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(part, controller) {
      pending += decoder.decode(part, { stream: true });
      const lines = pending.split("\n");
      pending = lines.pop() ?? "";
      if (lines.length) controller.enqueue(encoder.encode(lines.map(fixLine).join("\n") + "\n"));
    },
    flush(controller) { if (pending) controller.enqueue(encoder.encode(fixLine(pending))); },
  }));
  return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
};
