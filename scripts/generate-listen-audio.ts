// Generates the audio of the page summaries Rose reads aloud (src/content/listenSummaries.ts):
//   public/listen/<slug>.mp3   the voice
//   public/listen/<slug>.json  the text and its word timings (start and end in ms)
// Only summaries whose text, voice or model changed since the last run are generated (hash stored in the json).
//
//   bun scripts/generate-listen-audio.ts            generate what changed
//   bun scripts/generate-listen-audio.ts --force    regenerate everything
//   bun scripts/generate-listen-audio.ts --dry      list what would be generated and the characters it would bill
//   bun scripts/generate-listen-audio.ts --bars     add the 72-bar waveform ("bars") to the takes already in public/listen, no call to ElevenLabs
//
// Every json carries `bars`: 72 RMS values from 0 to 1 of the real take, drawn by the player. Decoding the mp3 needs
// the dev dependency mpg123-decoder (WASM, no native binary). Without it a take has no bars and the player draws a progress line.
//
// Run by Ivan, locally, with ELEVENLABS_API_KEY set in the session's environment (never in a file). It never runs in CI
// or in the Lovable build, and nothing calls it from package.json. Strategy for the model: _shared/listen-core.ts.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LISTEN_SUMMARIES } from "../src/content/listenSummaries";
import { LISTEN_MODEL, LISTEN_PINNED_PLAN, LISTEN_VOICE_ID, ListenProviderError, barsFromAudio, listenCacheKey, synthesizeListen, type ListenDecoder } from "../supabase/functions/_shared/listen-core";

const OUT = join(process.cwd(), "public", "listen");
const force = process.argv.includes("--force");
const dry = process.argv.includes("--dry");
const onlyBars = process.argv.includes("--bars");

const decode: ListenDecoder = async (mp3) => {
  const { MPEGDecoder } = await import("mpg123-decoder");
  const d = new MPEGDecoder();
  try {
    await d.ready;
    return d.decode(mp3).channelData[0] ?? null;
  } finally {
    d.free();
  }
};

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey && !dry) {
  console.error("ELEVENLABS_API_KEY is not set in this session. Set it for this session only, then run again.");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

if (onlyBars) {
  for (const slug of Object.keys(LISTEN_SUMMARIES)) {
    const jsonPath = join(OUT, `${slug}.json`);
    const mp3Path = join(OUT, `${slug}.mp3`);
    if (!existsSync(jsonPath) || !existsSync(mp3Path)) { console.log(`${slug}: no take yet`); continue; }
    const bars = await barsFromAudio(new Uint8Array(readFileSync(mp3Path)), decode);
    if (!bars) { console.error(`${slug}: could not decode the mp3 (is mpg123-decoder installed?). No bars written.`); process.exitCode = 1; continue; }
    const j = JSON.parse(readFileSync(jsonPath, "utf8")) as Record<string, unknown>;
    writeFileSync(jsonPath, JSON.stringify({ ...j, bars }, null, 1) + "\n");
    console.log(`${slug}: ${bars.length} bars written. The text, the timings and the audio are untouched.`);
  }
  process.exit(process.exitCode ?? 0);
}
let billed = 0;
let generated = 0;

for (const [slug, summary] of Object.entries(LISTEN_SUMMARIES)) {
  const hash = await listenCacheKey(summary.text, LISTEN_MODEL, LISTEN_VOICE_ID);
  const jsonPath = join(OUT, `${slug}.json`);
  const mp3Path = join(OUT, `${slug}.mp3`);
  const exists = existsSync(jsonPath) && existsSync(mp3Path);
  const current = exists ? (JSON.parse(readFileSync(jsonPath, "utf8")) as { hash?: string }).hash : undefined;
  if (current === hash && !force) {
    console.log(`${slug}: up to date (hash ${hash.slice(0, 8)})`);
    continue;
  }
  // A take made by hand has no hash. It is never replaced silently: that would spend credits and discard a chosen take.
  if (exists && current === undefined && !force) {
    console.log(`${slug}: a take without hash is already in public/listen (made by hand). Left alone; use --force to replace it.`);
    continue;
  }
  if (dry) {
    console.log(`${slug}: would generate, ${summary.text.length} characters`);
    billed += summary.text.length;
    continue;
  }
  try {
    const r = await synthesizeListen(summary.text, apiKey!, fetch, LISTEN_PINNED_PLAN);
    writeFileSync(mp3Path, r.audio);
    const bars = await barsFromAudio(r.audio, decode);
    if (!bars) console.log(`  No bars: the mp3 could not be decoded. Run with --bars once mpg123-decoder is installed.`);
    writeFileSync(jsonPath, JSON.stringify({
      slug, hash, voice: LISTEN_VOICE_ID, model: r.model, plan: r.plan, durationMs: r.durationMs, billedChars: r.billedChars,
      validatedOn: summary.validatedOn, text: summary.text, words: r.words, ...(bars ? { bars } : {}),
    }, null, 1) + "\n");
    billed += r.billedChars;
    generated += 1;
    console.log(`${slug}: written. Model used: ${r.model} (plan ${r.plan}). ${r.words.length} words, ${(r.durationMs / 1000).toFixed(1)} s, ${r.billedChars} characters billed.`);
    if (!LISTEN_PINNED_PLAN) console.log(`  To stop trying the other plans, set LISTEN_PINNED_PLAN = "${r.plan}" in supabase/functions/_shared/listen-core.ts.`);
  } catch (e) {
    const status = e instanceof ListenProviderError ? ` (HTTP ${e.status})` : "";
    console.error(`${slug}: failed${status}. ${e instanceof Error ? e.message : e}`);
    process.exitCode = 1;
  }
}
console.log(`${dry ? "Would bill" : "Billed"} ${billed} characters in total, ${generated} file(s) written.`);
