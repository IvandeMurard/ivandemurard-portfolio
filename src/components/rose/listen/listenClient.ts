/** Where the audio of a reading comes from: a static file (page summaries) or the rose-listen function (Rose's answers). */
import type { UIMessage } from "ai";
import type { ListenWord } from "./listenAlign";

export type ListenData = { text: string; words: ListenWord[]; audioUrl: string; durationMs: number };

/** No audio for this reading (file missing, cap reached, provider down): the browser reads it with its own voice. */
export class ListenUnavailable extends Error {
  constructor(public status: number) { super(`Listen unavailable (${status})`); }
}

const isWords = (w: unknown): w is ListenWord[] =>
  Array.isArray(w) && w.length > 0 && w.every((x) => x && typeof x.w === "string" && typeof x.s === "number" && typeof x.e === "number");

/**
 * Word timings of a summary file. Two spellings exist: `{w, s, e}` (scripts/generate-listen-audio.ts) and
 * `{w, start, end}` (a take timed by hand, mapped one to one onto the validated text). Both are milliseconds.
 */
const summaryWords = (raw: unknown): ListenWord[] | null => {
  if (!Array.isArray(raw) || !raw.length) return null;
  const out: ListenWord[] = [];
  for (const x of raw as { w?: unknown; s?: unknown; e?: unknown; start?: unknown; end?: unknown }[]) {
    const s = typeof x?.s === "number" ? x.s : x?.start;
    const e = typeof x?.e === "number" ? x.e : x?.end;
    if (typeof x?.w !== "string" || typeof s !== "number" || typeof e !== "number") return null;
    out.push({ w: x.w, s, e });
  }
  return out;
};

/** A summary recorded once and served as files: public/listen/<slug>.json and its mp3. */
export const loadSummaryAudio = async (slug: string, doFetch: typeof fetch = fetch): Promise<ListenData> => {
  const res = await doFetch(`/listen/${slug}.json`).catch(() => null);
  if (!res || !res.ok) throw new ListenUnavailable(res?.status ?? 0);
  const j = await res.json().catch(() => null) as { text?: unknown; words?: unknown; durationMs?: unknown; audio?: unknown } | null;
  const words = summaryWords(j?.words);
  // A dev server answers unknown files with the app shell: anything that is not the expected JSON counts as missing.
  if (!j || !words || typeof j.durationMs !== "number") throw new ListenUnavailable(404);
  const audio = typeof j.audio === "string" && /^[\w.-]+\.mp3$/.test(j.audio) ? j.audio : `${slug}.mp3`;
  return { text: typeof j.text === "string" ? j.text : words.map((w) => w.w).join(" "), words, audioUrl: `/listen/${audio}`, durationMs: j.durationMs };
};

/** The message exactly as the browser keeps it: only the text parts and the signature metadata the server checks. */
export const listenPayload = (sessionId: string, m: UIMessage) => {
  const meta = (m.metadata ?? {}) as { rose_sig?: unknown; rose_issued_at?: unknown; rose_register?: unknown };
  return {
    session_id: sessionId,
    message: {
      id: m.id,
      parts: m.parts.flatMap((p) => (p.type === "text" ? [{ type: "text" as const, text: p.text }] : [])),
      metadata: { rose_sig: meta.rose_sig, rose_issued_at: meta.rose_issued_at, rose_register: meta.rose_register },
    },
  };
};

/** Listen is offered on a finished, signed, factual answer. The server checks all of it again. */
export const canListen = (m: UIMessage): boolean => {
  const meta = (m.metadata ?? {}) as { rose_sig?: unknown; rose_issued_at?: unknown; rose_register?: unknown };
  return m.role === "assistant" && meta.rose_register === "factual" && typeof meta.rose_sig === "string" && typeof meta.rose_issued_at === "number";
};

export const requestAnswerAudio = async (sessionId: string, m: UIMessage, doFetch: typeof fetch = fetch): Promise<ListenData> => {
  const res = await doFetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rose-listen`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    body: JSON.stringify(listenPayload(sessionId, m)),
  }).catch(() => null);
  if (!res || !res.ok) throw new ListenUnavailable(res?.status ?? 0);
  const j = await res.json().catch(() => null) as { text?: unknown; words?: unknown; audio_url?: unknown; duration_ms?: unknown } | null;
  if (!j || typeof j.text !== "string" || !isWords(j.words) || typeof j.audio_url !== "string" || typeof j.duration_ms !== "number") throw new ListenUnavailable(502);
  return { text: j.text, words: j.words, audioUrl: j.audio_url, durationMs: j.duration_ms };
};
