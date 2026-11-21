// Rose reads one of her own answers aloud (Listen). The rules live in _shared/listen-handler.ts; this file only wires
// them to Supabase: a private storage bucket for the audio and its word timings, and a content-free usage table
// (session id, time, characters) for the caps. Secrets: ELEVENLABS_API_KEY, LISTEN_DAILY_CHAR_CAP, ROSE_HISTORY_KEY.
import { createClient } from "npm:@supabase/supabase-js@2";
import { handleListen, type ListenStore } from "../_shared/listen-handler.ts";
import type { ListenWord } from "../_shared/listen-core.ts";

const BUCKET = "rose-listen";
const SIGNED_URL_SECONDS = 60 * 60;

const storeFor = (url: string, serviceKey: string): ListenStore => {
  const db = createClient(url, serviceKey);
  const sign = async (path: string) => {
    const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_SECONDS);
    if (error || !data) throw new Error("signed url failed");
    return data.signedUrl;
  };
  return {
    async getCached(key) {
      const meta = await db.storage.from(BUCKET).download(`${key}.json`);
      if (meta.error || !meta.data) return null;
      const m = JSON.parse(await meta.data.text()) as { text: string; words: ListenWord[]; durationMs: number; model: string };
      return { audioUrl: await sign(`${key}.mp3`), text: m.text, words: m.words, durationMs: m.durationMs, model: m.model };
    },
    async putCached(key, text, s) {
      const audio = await db.storage.from(BUCKET).upload(`${key}.mp3`, s.audio, { contentType: "audio/mpeg", upsert: true });
      if (audio.error) throw new Error("audio upload failed");
      const meta = await db.storage.from(BUCKET).upload(
        `${key}.json`,
        new Blob([JSON.stringify({ text, words: s.words, durationMs: s.durationMs, model: s.model, plan: s.plan })], { type: "application/json" }),
        { upsert: true },
      );
      if (meta.error) throw new Error("timing upload failed");
      return await sign(`${key}.mp3`);
    },
    async sessionReads(sessionId, sinceMs) {
      const { count } = await db.from("rose_listen_usage").select("id", { count: "exact", head: true })
        .eq("session_id", sessionId).gte("created_at", new Date(sinceMs).toISOString());
      return count ?? 0;
    },
    async charsSince(sinceMs) {
      const { data } = await db.from("rose_listen_usage").select("chars").gte("created_at", new Date(sinceMs).toISOString());
      return (data ?? []).reduce((sum: number, r: { chars: number }) => sum + r.chars, 0);
    },
    async record(sessionId, chars, cached) {
      await db.from("rose_listen_usage").insert({ session_id: sessionId, chars, cached });
    },
  };
};

Deno.serve((req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return new Response(JSON.stringify({ error: "Unavailable", fallback: "speech" }), { status: 503, headers: { "Content-Type": "application/json" } });
  return handleListen(req, { env: (n) => Deno.env.get(n), store: storeFor(url, key) });
});
