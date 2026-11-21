// Generates the audio of the page summaries Rose reads aloud (src/content/listenSummaries.ts):
//   public/listen/<slug>.mp3   the voice
//   public/listen/<slug>.json  the text and its word timings (start and end in ms)
// Only summaries whose text, voice or model changed since the last run are generated (hash stored in the json).
//
//   bun scripts/generate-listen-audio.ts            generate what changed
//   bun scripts/generate-listen-audio.ts --force    regenerate everything
//   bun scripts/generate-listen-audio.ts --dry      list what would be generated and the characters it would bill
//
// Run by Ivan, locally, with ELEVENLABS_API_KEY set in the session's environment (never in a file). It never runs in CI
// or in the Lovable build, and nothing calls it from package.json. Strategy for the model: _shared/listen-core.ts.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LISTEN_SUMMARIES } from "../src/content/listenSummaries";
import { LISTEN_MODEL, LISTEN_PINNED_PLAN, LISTEN_VOICE_ID, ListenProviderError, listenCacheKey, synthesizeListen } from "../supabase/functions/_shared/listen-core";

const OUT = join(process.cwd(), "public", "listen");
const force = process.argv.includes("--force");
const dry = process.argv.includes("--dry");

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey && !dry) {
  console.error("ELEVENLABS_API_KEY is not set in this session. Set it for this session only, then run again.");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
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
    writeFileSync(jsonPath, JSON.stringify({
      slug, hash, voice: LISTEN_VOICE_ID, model: r.model, plan: r.plan, durationMs: r.durationMs, billedChars: r.billedChars,
      validatedOn: summary.validatedOn, text: summary.text, words: r.words,
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
