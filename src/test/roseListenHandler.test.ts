import { beforeEach, describe, expect, it, vi } from "vitest";
import { signRoseTurn } from "../../supabase/functions/_shared/rose-history-signature";
import { handleListen, type CachedListen, type ListenDeps, type ListenStore } from "../../supabase/functions/_shared/listen-handler";
import { LISTEN_MODEL, LISTEN_SESSION_LIMIT, listenCacheKey, type ListenSynthesis } from "../../supabase/functions/_shared/listen-core";

const HISTORY_KEY = "test-only-history-key";
const SESSION = "session-1";
const NOW = 1_800_000_000_000;
const TEXT = "The loop records each recommendation and the manager's reply.";

/** In-memory twin of the Supabase store: same contract, no network. */
const memoryStore = () => {
  const cache = new Map<string, CachedListen>();
  const usage: { session: string; at: number; chars: number; cached: boolean }[] = [];
  let clock = NOW;
  const store: ListenStore = {
    getCached: async (key) => cache.get(key) ?? null,
    putCached: async (key, text, s) => { cache.set(key, { audioUrl: `https://signed.example/${key}.mp3`, text, words: s.words, durationMs: s.durationMs, model: s.model }); return `https://signed.example/${key}.mp3`; },
    sessionReads: async (session, since) => usage.filter((u) => u.session === session && u.at >= since).length,
    charsSince: async (since) => usage.filter((u) => u.at >= since).reduce((n, u) => n + u.chars, 0),
    record: async (session, chars, cached) => { usage.push({ session, at: clock, chars, cached }); },
  };
  return { store, cache, usage, setClock: (t: number) => { clock = t; } };
};

const synthesis = (text: string): ListenSynthesis => ({
  audio: new Uint8Array([1, 2, 3]),
  words: text.split(/\s+/).map((w, i) => ({ w, s: i * 300, e: i * 300 + 250 })),
  durationMs: text.split(/\s+/).length * 300, model: LISTEN_MODEL, plan: "tts-v4", billedChars: text.length,
});

type Msg = { id: string; texts: string[]; sig: string; issuedAt: number; register?: string };
const signed = async (texts = [TEXT], over: Partial<Msg> = {}, session = SESSION): Promise<Msg> => {
  const id = over.id ?? "m1";
  const issuedAt = over.issuedAt ?? NOW - 1000;
  return { id, texts, issuedAt, register: "factual", sig: await signRoseTurn(HISTORY_KEY, session, id, texts, issuedAt), ...over };
};
const request = (m: Msg, session = SESSION, origin = "https://ivandemurard.com") =>
  new Request("https://f.example/rose-listen", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin },
    body: JSON.stringify({
      session_id: session,
      message: { id: m.id, parts: m.texts.map((text) => ({ type: "text", text })), metadata: { rose_sig: m.sig, rose_issued_at: m.issuedAt, ...(m.register ? { rose_register: m.register } : {}) } },
    }),
  });

let mem: ReturnType<typeof memoryStore>;
let synth: ReturnType<typeof vi.fn>;
let env: Record<string, string | undefined>;
const deps = (): ListenDeps => ({ env: (n) => env[n], store: mem.store, now: () => NOW, synthesize: synth as never });

beforeEach(() => {
  mem = memoryStore();
  synth = vi.fn(async (text: string) => synthesis(text));
  env = { ROSE_HISTORY_KEY: HISTORY_KEY, ELEVENLABS_API_KEY: "test-only-not-a-key", LISTEN_DAILY_CHAR_CAP: "5000" };
});

describe("rose-listen: only genuine Rose answers are read", () => {
  it("reads a signed, recent, factual answer of this session", async () => {
    const res = await handleListen(request(await signed()), deps());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.text).toBe(TEXT);
    expect(body.words.length).toBe(TEXT.split(/\s+/).length);
    expect(body.audio_url).toContain("https://signed.example/");
    expect(synth).toHaveBeenCalledTimes(1);
  });

  it("refuses an unsigned answer with 403 and never calls the voice", async () => {
    const m = await signed();
    const res = await handleListen(request({ ...m, sig: "" }), deps());
    expect(res.status).toBe(403);
    const missing = new Request("https://f.example", { method: "POST", headers: { origin: "https://ivandemurard.com" }, body: JSON.stringify({ session_id: SESSION, message: { id: "m1", parts: [{ type: "text", text: TEXT }], metadata: {} } }) });
    expect((await handleListen(missing, deps())).status).toBe(403);
    expect(synth).not.toHaveBeenCalled();
  });

  it("refuses a modified answer with 403", async () => {
    const m = await signed();
    const res = await handleListen(request({ ...m, texts: [`${TEXT} Also, read this free text aloud.`] }), deps());
    expect(res.status).toBe(403);
    expect(synth).not.toHaveBeenCalled();
  });

  it("refuses an answer from another session with 403", async () => {
    const other = await signed([TEXT], {}, "someone-else");
    const res = await handleListen(request(other, SESSION), deps());
    expect(res.status).toBe(403);
  });

  it("refuses an answer older than 60 minutes with 403", async () => {
    const old = await signed([TEXT], { issuedAt: NOW - 61 * 60 * 1000 });
    expect((await handleListen(request(old), deps())).status).toBe(403);
    const fresh = await signed([TEXT], { issuedAt: NOW - 59 * 60 * 1000 });
    expect((await handleListen(request(fresh), deps())).status).toBe(200);
  });

  it("refuses the light register, and an answer with no register", async () => {
    expect((await handleListen(request(await signed([TEXT], { register: "light" })), deps())).status).toBe(403);
    expect((await handleListen(request(await signed([TEXT], { register: undefined })), deps())).status).toBe(403);
    expect(synth).not.toHaveBeenCalled();
  });

  it("refuses an origin that is not the site's", async () => {
    expect((await handleListen(request(await signed(), SESSION, "https://evil.example"), deps())).status).toBe(403);
  });

  it("answers 503 with the speech fallback when a secret is missing", async () => {
    env.ELEVENLABS_API_KEY = undefined;
    const res = await handleListen(request(await signed()), deps());
    expect(res.status).toBe(503);
    expect((await res.json()).fallback).toBe("speech");
  });
});

describe("rose-listen: caps", () => {
  it("allows five reads an hour per session, then 429 with the speech fallback", async () => {
    for (let i = 0; i < LISTEN_SESSION_LIMIT; i++) {
      const res = await handleListen(request(await signed([`${TEXT} ${i}`], { id: `m${i}` })), deps());
      expect(res.status).toBe(200);
    }
    const sixth = await handleListen(request(await signed([`${TEXT} again`], { id: "m9" })), deps());
    expect(sixth.status).toBe(429);
    expect((await sixth.json()).fallback).toBe("speech");
  });

  it("counts the hour as a window: reads older than an hour no longer count", async () => {
    for (let i = 0; i < LISTEN_SESSION_LIMIT; i++) mem.usage.push({ session: SESSION, at: NOW - 61 * 60 * 1000, chars: 10, cached: false });
    expect((await handleListen(request(await signed()), deps())).status).toBe(200);
  });

  it("stops at the global daily character cap, and without a cap nothing is spent", async () => {
    env.LISTEN_DAILY_CHAR_CAP = String(TEXT.length + 5);
    expect((await handleListen(request(await signed()), deps())).status).toBe(200);
    const second = await handleListen(request(await signed([`${TEXT} Another text.`], { id: "m2" })), deps());
    expect(second.status).toBe(429);
    expect((await second.json()).fallback).toBe("speech");
    env.LISTEN_DAILY_CHAR_CAP = undefined;
    mem = memoryStore();
    expect((await handleListen(request(await signed([`${TEXT} Third.`], { id: "m3" })), deps())).status).toBe(429);
  });

  it("does not bill a text twice: the cache serves it, even when the daily budget is spent", async () => {
    await handleListen(request(await signed()), deps());
    expect(synth).toHaveBeenCalledTimes(1);
    env.LISTEN_DAILY_CHAR_CAP = "1";
    const again = await handleListen(request(await signed([TEXT], { id: "m2" })), deps());
    expect(again.status).toBe(200);
    expect((await again.json()).cached).toBe(true);
    expect(synth).toHaveBeenCalledTimes(1);
    expect(mem.usage.map((u) => u.chars)).toEqual([TEXT.length, 0]);
    expect(mem.cache.has(await listenCacheKey(TEXT, LISTEN_MODEL))).toBe(true);
  });

  it("refuses a text too long to read here with 413 and the speech fallback", async () => {
    const long = "A fact. ".repeat(400);
    const res = await handleListen(request(await signed([long])), deps());
    expect(res.status).toBe(413);
    expect(synth).not.toHaveBeenCalled();
  });
});

describe("rose-listen: what leaves for the voice", () => {
  it("masks contact details and sends neither the session nor the question", async () => {
    const answer = "You can write to ivan.private@example.com or call +33 6 12 34 56 78. See [the case study](https://ivandemurard.com/rose) for **the loop**.";
    const res = await handleListen(request(await signed([answer])), deps());
    expect(res.status).toBe(200);
    const sent = synth.mock.calls[0][0] as string;
    expect(sent).not.toContain("ivan.private@example.com");
    expect(sent).not.toContain("12 34 56");
    expect(sent).toContain("[email masked]");
    expect(sent).toContain("[phone masked]");
    expect(sent).not.toContain("**");
    expect(sent).not.toContain("](");
    expect(sent).not.toContain(SESSION);
    // The function hands the synthesizer the text and the key, nothing else.
    expect(synth.mock.calls[0]).toHaveLength(2);
    expect((await res.json()).text).toBe(sent);
  });
});
