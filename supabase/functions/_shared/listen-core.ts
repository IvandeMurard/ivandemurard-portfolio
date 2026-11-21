/**
 * Listen (Rose reads aloud): the parts shared by the rose-listen function, the audio generator script and the tests.
 * Pure WebCrypto and fetch, no imports besides mask-pii, so Deno and Node run the same code. The API key is always
 * passed in: it lives only in the Supabase secrets (functions) or in the environment of Ivan's session (script).
 *
 * Strategy for the model (documented here, chosen by the constants below, never detected at call time):
 *   1. text-to-speech with timestamps, eleven_v4
 *   2. text-to-dialogue with timestamps, eleven_v4, one speaker
 *   3. text-to-speech with timestamps, eleven_multilingual_v2
 * The docs do not guarantee timestamps for eleven_v4 on the text-to-speech endpoint. A plan is skipped only when the
 * API refuses the request outright (HTTP 400, 404 or 422: nothing is generated, nothing is billed). Quota, auth and
 * server errors stop the chain. Once Ivan has seen which plan works, he pins it in LISTEN_PINNED_PLAN and the other
 * plans are never tried again.
 */
import { maskPii } from "./mask-pii.ts";

/** Created with Voice Design (English). An identifier, not a secret. */
export const LISTEN_VOICE_ID = "Vl85IetVjyVUJuJgGjDR";
export const LISTEN_MODEL = "eleven_v4";
export const LISTEN_FALLBACK_MODEL = "eleven_multilingual_v2";
export const LISTEN_OUTPUT_FORMAT = "mp3_44100_128";

export type ListenPlanId = "tts-v4" | "dialogue-v4" | "tts-multilingual";
export type ListenPlan = { id: ListenPlanId; endpoint: "text-to-speech" | "text-to-dialogue"; model: string };
export const LISTEN_PLANS: ListenPlan[] = [
  { id: "tts-v4", endpoint: "text-to-speech", model: LISTEN_MODEL },
  { id: "dialogue-v4", endpoint: "text-to-dialogue", model: LISTEN_MODEL },
  { id: "tts-multilingual", endpoint: "text-to-speech", model: LISTEN_FALLBACK_MODEL },
];
/** null = try the plans in order. Set to the plan the first generation used, to stop trying the others. */
export const LISTEN_PINNED_PLAN: ListenPlanId | null = null;

/** Reads per session per hour, and the longest text one read may send. */
export const LISTEN_SESSION_LIMIT = 5;
export const LISTEN_SESSION_WINDOW_MS = 60 * 60 * 1000;
export const LISTEN_MAX_CHARS = 1800;

/** Cached audio and timings are kept for about 90 days, then deleted (said on /privacy). */
export const LISTEN_CACHE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
/** Objects deleted per purge. Each cached text is two objects (.mp3 and .json), so this is ten texts at most. */
export const LISTEN_PURGE_BATCH = 20;

/** What the purge needs from the bucket. rose-listen adapts the Supabase Storage client to it; the tests use a memory twin. */
export interface ListenBucket {
  /** Objects of the bucket with their creation time (ISO string), oldest first when the backend can sort. */
  list(): Promise<{ name: string; created_at?: string | null }[]>;
  remove(names: string[]): Promise<void>;
}

/** Names to delete now: only objects older than the limit, oldest first, at most `max`. An object with no usable date is kept. */
export const expiredListenObjects = (
  objects: { name: string; created_at?: string | null }[],
  now: number,
  maxAgeMs = LISTEN_CACHE_MAX_AGE_MS,
  max = LISTEN_PURGE_BATCH,
): string[] =>
  objects
    .flatMap((o) => {
      const t = o.created_at ? Date.parse(o.created_at) : NaN;
      return Number.isFinite(t) && now - t > maxAgeMs ? [{ name: o.name, t }] : [];
    })
    .sort((a, b) => a.t - b.t)
    .slice(0, max)
    .map((o) => o.name);

/** Deletes expired cache objects through the Storage API. Resolves to how many were asked for deletion. Never throws. */
export const purgeExpiredListenCache = async (bucket: ListenBucket, now: number): Promise<number> => {
  try {
    const names = expiredListenObjects(await bucket.list(), now);
    if (!names.length) return 0;
    await bucket.remove(names);
    return names.length;
  } catch {
    // A failed purge only means the objects stay until the next one.
    return 0;
  }
};

export type ListenWord = { w: string; s: number; e: number };
export type CharAlignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };

/** Text as it is spoken: Markdown marks removed, so the voice never reads "asterisk" or a URL. */
export const speakableText = (raw: string): string =>
  raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,;:!?]|$)/g, "$1$2")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/** What leaves for ElevenLabs: spoken text with contact details masked. Nothing else about the visitor is part of it. */
export const textToSend = (parts: string[]): string => maskPii(speakableText(parts.map((p) => p.trim()).filter(Boolean).join("\n\n")));

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
export const sha256Hex = async (s: string) => toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));

/** One text, one voice, one model: paid once. */
export const listenCacheKey = (text: string, model: string, voice = LISTEN_VOICE_ID) => sha256Hex(`${text}\u0000${voice}\u0000${model}`);

/** Character timings to word timings, in milliseconds. Whitespace separates words; punctuation stays with its word. */
export const wordsFromAlignment = (a: CharAlignment): ListenWord[] => {
  const words: ListenWord[] = [];
  let cur: ListenWord | null = null;
  const n = Math.min(a.characters.length, a.character_start_times_seconds.length, a.character_end_times_seconds.length);
  for (let i = 0; i < n; i++) {
    const ch = a.characters[i];
    const s = Math.round(a.character_start_times_seconds[i] * 1000);
    const e = Math.round(a.character_end_times_seconds[i] * 1000);
    if (/\s/.test(ch)) { cur = null; continue; }
    if (!cur) { cur = { w: ch, s, e }; words.push(cur); } else { cur.w += ch; cur.e = e; }
  }
  return words;
};

export type ListenSynthesis = { audio: Uint8Array; words: ListenWord[]; durationMs: number; model: string; plan: ListenPlanId; billedChars: number };
type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

/** An error that stops the chain (quota, auth, server) as opposed to a refusal of this plan. */
export class ListenProviderError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
const PLAN_REFUSED = new Set([400, 404, 422]);

const fromBase64 = (s: string): Uint8Array => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

const callPlan = async (plan: ListenPlan, text: string, apiKey: string, doFetch: FetchLike): Promise<ListenSynthesis> => {
  const base = "https://api.elevenlabs.io/v1";
  const url = plan.endpoint === "text-to-speech"
    ? `${base}/text-to-speech/${LISTEN_VOICE_ID}/with-timestamps?output_format=${LISTEN_OUTPUT_FORMAT}`
    : `${base}/text-to-dialogue/with-timestamps?output_format=${LISTEN_OUTPUT_FORMAT}`;
  const body = plan.endpoint === "text-to-speech"
    ? { text, model_id: plan.model }
    : { inputs: [{ text, voice_id: LISTEN_VOICE_ID }], model_id: plan.model };
  const res = await doFetch(url, { method: "POST", headers: { "xi-api-key": apiKey, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new ListenProviderError(res.status, `ElevenLabs ${plan.id} answered ${res.status}`);
  const json = await res.json() as { audio_base64?: string; alignment?: CharAlignment | null; normalized_alignment?: CharAlignment | null };
  // The alignment of the original text is the one that matches what the reader sees.
  const alignment = json.alignment ?? json.normalized_alignment;
  if (!json.audio_base64 || !alignment?.characters?.length) throw new ListenProviderError(422, `ElevenLabs ${plan.id} returned no timestamps`);
  const words = wordsFromAlignment(alignment);
  if (!words.length) throw new ListenProviderError(422, `ElevenLabs ${plan.id} returned no words`);
  const durationMs = Math.max(...alignment.character_end_times_seconds.map((t) => Math.round(t * 1000)));
  return { audio: fromBase64(json.audio_base64), words, durationMs, model: plan.model, plan: plan.id, billedChars: text.length };
};

/** Runs the strategy above. Throws ListenProviderError when no plan produced audio with timings. */
export const synthesizeListen = async (text: string, apiKey: string, doFetch: FetchLike = fetch, pinned: ListenPlanId | null = LISTEN_PINNED_PLAN): Promise<ListenSynthesis> => {
  const plans = pinned ? LISTEN_PLANS.filter((p) => p.id === pinned) : LISTEN_PLANS;
  let last: ListenProviderError | undefined;
  for (const plan of plans) {
    try { return await callPlan(plan, text, apiKey, doFetch); }
    catch (e) {
      if (!(e instanceof ListenProviderError) || !PLAN_REFUSED.has(e.status)) throw e;
      last = e;
    }
  }
  throw last ?? new ListenProviderError(500, "No Listen plan available");
};
