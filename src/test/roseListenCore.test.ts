import { describe, expect, it, vi } from "vitest";
import {
  LISTEN_MODEL, LISTEN_FALLBACK_MODEL, LISTEN_VOICE_ID, ListenProviderError, listenCacheKey, speakableText, synthesizeListen, textToSend, wordsFromAlignment,
} from "../../supabase/functions/_shared/listen-core";

const alignmentOf = (text: string) => ({
  characters: [...text],
  character_start_times_seconds: [...text].map((_, i) => i * 0.05),
  character_end_times_seconds: [...text].map((_, i) => i * 0.05 + 0.04),
});
const ok = (text: string) => new Response(JSON.stringify({ audio_base64: btoa("mp3"), alignment: alignmentOf(text), normalized_alignment: null }), { status: 200 });

describe("Listen text", () => {
  it("removes Markdown so the voice never reads a mark or a URL", () => {
    expect(speakableText("## Title\n- **Bold** item with [a link](https://x.example/a).\n\n`code` here")).toBe("Title\nBold item with a link.\n\ncode here");
  });
  it("masks contact details after cleaning", () => {
    expect(textToSend(["Mail me: a@b.example, call 06 12 34 56 78."])).toBe("Mail me: [email masked], call [phone masked].");
  });
});

describe("Listen timings", () => {
  it("turns character timings into word timings in milliseconds, punctuation kept with its word", () => {
    const words = wordsFromAlignment(alignmentOf("Hello, big world."));
    expect(words.map((w) => w.w)).toEqual(["Hello,", "big", "world."]);
    expect(words[0]).toEqual({ w: "Hello,", s: 0, e: 290 });
    expect(words[1].s).toBe(350);
    // "Hello, big world." has 17 characters: the last one starts at 16 x 50 ms and ends 40 ms later.
    expect(words[2].e).toBe(840);
  });
});

describe("Listen cache key", () => {
  it("is one text, one voice, one model", async () => {
    const a = await listenCacheKey("same text", LISTEN_MODEL);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(await listenCacheKey("same text", LISTEN_MODEL)).toBe(a);
    expect(await listenCacheKey("same text.", LISTEN_MODEL)).not.toBe(a);
    expect(await listenCacheKey("same text", LISTEN_FALLBACK_MODEL)).not.toBe(a);
    expect(await listenCacheKey("same text", LISTEN_MODEL, "other-voice")).not.toBe(a);
  });
});

describe("Listen model strategy", () => {
  const urls = (f: ReturnType<typeof vi.fn>) => f.mock.calls.map((c) => String(c[0]));

  it("uses text-to-speech with eleven_v4 first, with this voice and its timestamps", async () => {
    const f = vi.fn(async (_url: string, _init?: RequestInit) => ok("Hi there."));
    const r = await synthesizeListen("Hi there.", "k", f as never, null);
    expect(r.plan).toBe("tts-v4");
    expect(r.model).toBe("eleven_v4");
    expect(r.billedChars).toBe("Hi there.".length);
    expect(urls(f)).toEqual([expect.stringContaining(`/text-to-speech/${LISTEN_VOICE_ID}/with-timestamps`)]);
    expect(JSON.parse((f.mock.calls[0][1] as RequestInit).body as string)).toEqual({ text: "Hi there.", model_id: "eleven_v4" });
    expect(((f.mock.calls[0][1] as RequestInit).headers as Record<string, string>)["xi-api-key"]).toBe("k");
  });

  it("falls to text-to-dialogue, then to eleven_multilingual_v2, only when a plan is refused outright", async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(new Response("{}", { status: 422 }))
      .mockResolvedValueOnce(new Response("{}", { status: 400 }))
      .mockResolvedValueOnce(ok("Hi there."));
    const r = await synthesizeListen("Hi there.", "k", f as never, null);
    expect(r.plan).toBe("tts-multilingual");
    expect(r.model).toBe("eleven_multilingual_v2");
    expect(urls(f)[1]).toContain("/text-to-dialogue/with-timestamps");
    expect(JSON.parse((f.mock.calls[1][1] as RequestInit).body as string)).toEqual({ inputs: [{ text: "Hi there.", voice_id: LISTEN_VOICE_ID }], model_id: "eleven_v4" });
  });

  it("does not keep trying after a quota, auth or server error", async () => {
    for (const status of [401, 429, 500]) {
      const f = vi.fn(async () => new Response("{}", { status }));
      await expect(synthesizeListen("Hi.", "k", f as never, null)).rejects.toMatchObject({ status });
      expect(f).toHaveBeenCalledTimes(1);
    }
  });

  it("counts a reply without timings as a refusal of that plan", async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ audio_base64: btoa("x") }), { status: 200 }))
      .mockResolvedValueOnce(ok("Hi."));
    expect((await synthesizeListen("Hi.", "k", f as never, null)).plan).toBe("dialogue-v4");
  });

  it("with a pinned plan, never tries the others", async () => {
    const f = vi.fn(async () => new Response("{}", { status: 422 }));
    await expect(synthesizeListen("Hi.", "k", f as never, "dialogue-v4")).rejects.toBeInstanceOf(ListenProviderError);
    expect(f).toHaveBeenCalledTimes(1);
    expect(urls(f)[0]).toContain("/text-to-dialogue/");
  });
});
