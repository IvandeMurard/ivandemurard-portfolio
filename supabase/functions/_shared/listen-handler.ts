/**
 * The rose-listen request handler, with every outside dependency injected (secrets, storage, clock, ElevenLabs), so the
 * tests run the real rules. supabase/functions/rose-listen/index.ts only wires it to Supabase.
 *
 * Rules, in order:
 *   1. Origin: only the site's own origins (the function spends money).
 *   2. Only genuine Rose answers: verifyRoseTurn (HMAC over session, message id and text, 60 minutes). Otherwise 403.
 *   3. Only the factual register (rose_register: "factual"). Otherwise 403.
 *   4. Per-session cap, then (for a new text only) the global daily cap of characters. Otherwise 429: the browser
 *      reads the answer with its own speech synthesis.
 *   5. Only the masked text leaves for ElevenLabs. Not the question, the session or the IP.
 * The register in the message metadata is not covered by the signature (it is stamped next to it), see the PR notes.
 */
import { verifyRoseTurn } from "./rose-history-signature.ts";
import {
  LISTEN_MAX_CHARS, LISTEN_MODEL, LISTEN_PINNED_PLAN, LISTEN_SESSION_LIMIT, LISTEN_SESSION_WINDOW_MS,
  ListenProviderError, listenCacheKey, synthesizeListen, textToSend,
  type ListenSynthesis, type ListenWord,
} from "./listen-core.ts";

export const LISTEN_ORIGINS = ["https://ivandemurard.com", "https://www.ivandemurard.com", "https://ivandemurard.lovable.app"];
const MAX_BODY_BYTES = 12_000;

export type ListenResult = { text: string; words: ListenWord[]; audio_url: string; duration_ms: number; model: string; cached: boolean };
export type CachedListen = { audioUrl: string; text: string; words: ListenWord[]; durationMs: number; model: string };

export interface ListenStore {
  getCached(key: string): Promise<CachedListen | null>;
  putCached(key: string, text: string, s: ListenSynthesis): Promise<string>;
  /** Reads this session has made since the given time (cached or not). */
  sessionReads(sessionId: string, sinceMs: number): Promise<number>;
  /** Characters sent to ElevenLabs since the given time, all sessions. */
  charsSince(sinceMs: number): Promise<number>;
  record(sessionId: string, chars: number, cached: boolean): Promise<void>;
  /** Deletes cached objects older than 90 days, at most 20 (purgeExpiredListenCache). Must not throw. */
  purgeExpired(now: number): Promise<unknown>;
}

export type ListenDeps = {
  env: (name: string) => string | undefined;
  store: ListenStore;
  now?: () => number;
  synthesize?: (text: string, apiKey: string) => Promise<ListenSynthesis>;
  /** Keeps a task alive after the response is sent (EdgeRuntime.waitUntil). Without it the task still starts, unawaited. */
  background?: (task: Promise<unknown>) => void;
};

type Body = {
  session_id?: unknown;
  message?: { id?: unknown; parts?: unknown; metadata?: { rose_sig?: unknown; rose_issued_at?: unknown; rose_register?: unknown } };
};

const startOfUtcDay = (now: number) => now - (now % 86_400_000);

export async function handleListen(req: Request, deps: ListenDeps): Promise<Response> {
  const now = (deps.now ?? Date.now)();
  const origin = req.headers.get("origin") ?? "";
  const cors: Record<string, string> = {
    "Access-Control-Allow-Origin": LISTEN_ORIGINS.includes(origin) ? origin : LISTEN_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  // 429 and 502 tell the browser to read with its own voice.
  const speech = (status: number, error: string) => json({ error, fallback: "speech" }, status);

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!LISTEN_ORIGINS.includes(origin)) return json({ error: "Listen is not available for this origin" }, 403);

  let raw: Body;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413);
    raw = JSON.parse(text);
  } catch { return json({ error: "Invalid JSON" }, 400); }

  const sessionId = typeof raw.session_id === "string" ? raw.session_id : "";
  const m = raw.message;
  const meta = m?.metadata;
  const parts = Array.isArray(m?.parts) ? (m!.parts as { type?: unknown; text?: unknown }[]) : [];
  if (!sessionId || sessionId.length > 64 || !m || typeof m.id !== "string" || !meta || !parts.length
    || !parts.every((p) => p?.type === "text" && typeof p.text === "string")) return json({ error: "invalid request" }, 400);
  const texts = parts.map((p) => p.text as string);

  const historyKey = deps.env("ROSE_HISTORY_KEY");
  const apiKey = deps.env("ELEVENLABS_API_KEY");
  if (!historyKey || !apiKey) return speech(503, "Listen is not configured");

  // 2. A genuine, recent Rose answer of this session. Anything else is a free voice for strangers.
  const genuine = await verifyRoseTurn(historyKey, sessionId, {
    id: m.id, role: "assistant", parts: texts.map((text) => ({ type: "text" as const, text })),
    metadata: { rose_sig: meta.rose_sig, rose_issued_at: meta.rose_issued_at },
  }, now);
  if (!genuine) return json({ error: "Not a recent answer of this session" }, 403);
  // 3. Factual register only.
  if (meta.rose_register !== "factual") return json({ error: "Listen is only offered on factual answers" }, 403);

  // 5. Masked text only.
  const text = textToSend(texts);
  if (!text) return json({ error: "Nothing to read" }, 422);
  if (text.length > LISTEN_MAX_CHARS) return speech(413, "Answer too long to read aloud here");

  // 4. Caps.
  if (await deps.store.sessionReads(sessionId, now - LISTEN_SESSION_WINDOW_MS) >= LISTEN_SESSION_LIMIT) return speech(429, "Listen limit reached for this session");

  const key = await listenCacheKey(text, LISTEN_MODEL);
  const hit = await deps.store.getCached(key);
  if (hit) {
    await deps.store.record(sessionId, 0, true);
    return json({ text: hit.text, words: hit.words, audio_url: hit.audioUrl, duration_ms: hit.durationMs, model: hit.model, cached: true } satisfies ListenResult);
  }

  const cap = Number(deps.env("LISTEN_DAILY_CHAR_CAP"));
  // No cap configured means no spending: the cap is a secret Ivan sets on purpose.
  if (!Number.isFinite(cap) || cap <= 0) return speech(429, "Listen is paused");
  if (await deps.store.charsSince(startOfUtcDay(now)) + text.length > cap) return speech(429, "Daily Listen budget reached");

  let result: ListenSynthesis;
  try {
    result = await (deps.synthesize ?? ((t, k) => synthesizeListen(t, k, fetch, LISTEN_PINNED_PLAN)))(text, apiKey);
  } catch (e) {
    console.error("[rose-listen] synthesis failed", e instanceof ListenProviderError ? e.status : "unknown");
    return speech(502, "Voice unavailable");
  }
  // The cache is keyed on the configured model; the model actually used is stored with the files.
  const audioUrl = await deps.store.putCached(key, text, result);
  await deps.store.record(sessionId, result.billedChars, false);
  // Retention: after a new text is stored, expired objects are deleted in the background. The response never waits for it.
  const purge = (async () => { try { await deps.store.purgeExpired(now); } catch { /* the next purge retries */ } })();
  if (deps.background) deps.background(purge);
  return json({ text, words: result.words, audio_url: audioUrl, duration_ms: result.durationMs, model: result.model, cached: false } satisfies ListenResult);
}
