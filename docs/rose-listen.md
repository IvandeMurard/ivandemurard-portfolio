# Rose Listen: how it works, how it was deployed, how to run it

Status of this document: written on 21 Nov 2026, the day Listen was merged and published (PRs #76, #77, #78). It states what was verified and what was not. Product wording lives in `docs/rose-case-study-copy-v2.md`; this file is the operating manual. Every figure and rule below is read from the code, not from memory; where a fact is unverified it says so.

## 1. What it is

Rose reads aloud, in pilot:

1. **Page summaries**: three recordings Ivan wrote and validated, served as static files (the Harness note, the AX note, the Rose case study).
2. **Her own factual answers**, on demand, through the `rose-listen` function.

The written answer or the written summary is always on screen. The dock shows an audiogram: the spoken word in dark ink, the rest faded, a waveform that is also the progress bar, play / pause / back to the start, and a Read / Listen switch that keeps the position.

Public status (`src/content/statuses.ts`): **"Live, voice in pilot"**, note "Rose is live. She answers in text and, in pilot, reads three page summaries and her factual answers aloud. She sends nothing when you book."

## 2. Where everything is

| What | File |
|---|---|
| The three summaries (text, optional ElevenLabs script, duration, validation date) | `src/content/listenSummaries.ts` (single source) |
| Recordings and word timings | `public/listen/<slug>.mp3` and `.json` |
| "Listen summary" block on a page | `src/components/listen/ListenSummaryBlock.tsx` |
| The audiogram, the player hook, the browser-voice fallback | `src/components/rose/listen/` |
| The dock (starter question, Listen button under answers, `rose:listen` event) | `src/components/rose/RoseDock.tsx` |
| The server function | `supabase/functions/rose-listen/index.ts` (wiring) and `supabase/functions/_shared/listen-handler.ts` (rules) |
| ElevenLabs calls, model strategy, masking, cache key, purge | `supabase/functions/_shared/listen-core.ts` |
| Measurement events | `supabase/functions/rose-event/index.ts`, `src/components/rose/roseEvents.ts` |
| Database | `drizzle/migrations/0012_rose_listen.sql`, `0013_confirm_rose_listen.sql` (a comment added by Lovable's migration tool) |
| Generator for a new recording | `scripts/generate-listen-audio.ts` |
| Mirrors and MCP | `scripts/rose-mirror.ts`, `src/lib/mcp/tools/get-journal-entry.ts`, `list-journal.ts` |

## 3. Rules of `rose-listen` (in this order)

1. Only the site's own origins (`ivandemurard.com`, `www.`, `ivandemurard.lovable.app`).
2. Only a **genuine, recent Rose answer of this session**: the message is checked with `verifyRoseTurn` (HMAC over session, message id and text, 60 minutes). Unsigned, modified, another session's or older: **403**. Without this the function would be free speech synthesis for anyone.
3. Only the **factual register** (`rose_register: "factual"`). Light answers: **403**.
4. The text is cleaned of Markdown, then masked by `mask-pii.ts` (emails, phones, addresses, links, cards, IBANs, IPs). **Only that text** goes to ElevenLabs: not the question, the session or the IP.
5. Caps, then **429** and the browser reads with its own voice: 5 reads per session per hour; a global daily character cap from the secret `LISTEN_DAILY_CHAR_CAP`. **No cap set (or 0) means no spending**: the function answers 429 for any new text.
6. Cache: key = sha256(masked text + voice + model), in the private bucket `rose-listen` (mp3 and timings). A cached text is served without a new call and does not count against the daily budget. It still counts as one of the session's 5 reads.
7. After each newly stored text, a **background purge** (`EdgeRuntime.waitUntil`) deletes objects of the bucket older than 90 days through the Storage API, at most 20 per call. The response never waits for it. It runs only when a new text is generated, so with little traffic an object can outlive 90 days; `/privacy` says "about 90 days".

Limits: a text over 1,800 characters gets 413 (browser voice). Errors from ElevenLabs give 502. Missing secrets give 503. In every such case the answer stays readable and the browser can read it.

## 4. Voice and model

Voice `Vl85IetVjyVUJuJgGjDR` (created with Voice Design, English), a constant in `listen-core.ts` (an identifier, not a secret). Model strategy, documented in that file and never detected per call:

1. text-to-speech with timestamps, `eleven_v4`;
2. text-to-dialogue with timestamps, `eleven_v4`, one speaker;
3. text-to-speech with timestamps, `eleven_multilingual_v2`.

A plan is skipped only when ElevenLabs refuses the request outright (400, 404 or 422). Quota, auth and server errors stop the chain. Which plan works on the live account is **not known from the repository**: the pilot recordings were made by hand. When the first answer is read through the function, set `LISTEN_PINNED_PLAN` in `listen-core.ts` to the plan that worked.

## 5. Secrets and configuration

| Where | Name | Note |
|---|---|---|
| Supabase function secrets | `ELEVENLABS_API_KEY` | never in a file or in the browser. **Set**: Ivan reported on 21 Nov 2026 that Lovable confirmed it stored the key encrypted, readable by the functions through `Deno.env.get`. Claude did not see that confirmation and cannot read secrets, so the proof that it works is the first read of an answer (section 9) |
| Supabase function secrets | `LISTEN_DAILY_CHAR_CAP` | set to `20000` characters per UTC day by Lovable on 21 Nov 2026 |
| Supabase function secrets | `ROSE_HISTORY_KEY` | already used by `rose-chat`; the same value signs and verifies |

Without `ELEVENLABS_API_KEY`, answers fall back to the browser voice (503). The page summaries do not need it: they are static files.

## 6. Data and privacy

- The contract sentence (case study chapter 08 and `/privacy`): "Listen sends Rose's answer, with contact details masked, to ElevenLabs, which keeps it under its standard retention. Page summaries are recorded once and served as files."
- `/privacy` also says: only the answer text is sent; the masked text and its audio are kept about 90 days, then deleted, in a private store of the site; events record only that a reading started or ended and its source; the browser voice belongs to the browser.
- Events in `rose_events`: `listen` and `listen_complete`, with `listen_source` = `summary` or `answer`, plus page and session. No content (`rose-event` rejects any content on these kinds).
- Table `rose_listen_usage`: session id, time, characters, cached or not. No text. Service role only (RLS on, no policy). Purged after 7 days by pg_cron.
- ElevenLabs keeps what it receives under its own retention: this is outside the site's control.

## 7. What was deployed on 21 Nov 2026, and how

| Step | Who | Result |
|---|---|---|
| PR #76 merged (function, dock, summary Harness, migration 0012, privacy, status) | Ivan, then Lovable | Lovable applied the migration (added `0013` as a comment), regenerated the MCP bundle, deployed `rose-listen` and `rose-event`, set `LISTEN_DAILY_CHAR_CAP` |
| PR #77 merged (second summary, AX) | Claude, on Ivan's request | synced by Lovable |
| PR #78 merged (third summary, "Listen summary" blocks, decision 06, status note "three page summaries") | Claude, on Ivan's request | synced by Lovable |
| MCP bundle regenerated (`00afc8f`, manifest `35247c8`) and `rose-chat`, `rose-event`, `rose-listen` deployed | Lovable's agent, on Claude's request | no migration pending (0000 to 0013 applied); `mcp` is deployed by the platform at publication |
| Site published | Claude, through Lovable (`deploy_project`), **on Ivan's explicit request** | Ivan chose the option "Fusionner #77 puis #78, puis publier" when asked what "deploy" covered (merge, then publish). Deployment `5adfff3b-251d-4119-9b30-1169f5cd3822`, 21 Nov 2026 |

Why Lovable does the deploy: functions, migrations and the MCP bundle go through Lovable, with Ivan's explicit approval (see `CLAUDE.md`).

### Verified live after publication (21 Nov 2026, from outside)

- `rose.md` carries "Status: Live, voice in pilot", the new "Today" line and a `## Listen summary` section.
- The AX mirror and `llms-full.txt` carry `## Listen summary` (3 sections in `llms-full.txt`).
- `listen/rose`, `listen/harnesses-graders-closed-loops`, `listen/one-text-three-readers`: `.mp3` served as `audio/mpeg` and `.json`, all HTTP 200.
- The public MCP server returns the Rose status note with "three page summaries" and the section "Listen summary" (`get_case_study`, `section`).
- Locally: 1314 of 1316 tests passed before merge; the regenerated bundle passes `mcpBundleFreshness`.

### Not verified

- **An answer read aloud end to end** (a signed factual answer, the function, ElevenLabs, the cache, the audiogram) has not been run on the live site. First thing to do, see section 9.
- The 90-day purge against the real Storage API: tested only against an in-memory twin.
- Contrast was checked by calculation on the site tokens (Day and Dusk), not by eye at 390, 800, 1280 and 1440 px.
- The Edge functions were not type-checked by Deno (not installed on the working machine); the handler runs under Node in the tests.
- Lovable reported an older log of Deno errors for `rose-chat` and the agent tools; they were not re-checked.
- The pre-rendered pages for `/privacy` do not exist (not pre-rendered); the five that carry changed content were recaptured, the other 14 differ only by the page clock and were left as they were.

## 8. Known limits

- **The register is not signed.** `rose_register` sits beside the signature but is not covered by it, so a visitor can relabel a light answer as factual and have it read. No extra cost (the answer is genuine, same session, under an hour), but "factual only" is not tamper-proof. Fixing it means signing the register, which invalidates conversations in progress.
- **The status is a claim about the pilot.** "Voice in pilot" is true for the summaries now. For answers, the key is in place (see section 5) but no answer has been read through the function yet, so that half is built and deployed, not yet seen working.
- **The rule "no style exception" is not met today.** `docs/style-allowlist.json` holds two entries, both for the word "quietly" (a mood word in the style linter) in the validated AX summary: one for `src/content/listenSummaries.ts`, one for `public/one-text-three-readers.md`, which prints the same text. The recorded AX take says that word, so the text cannot change without a new recording. The first was chosen by Ivan in the PR #77 session, the second in the PR #78 session, each as a stop-gap. They are exceptions to Ivan's rule, not a settled state: they go, and the sentence becomes "Agents asking for the list of projects were handed the homepage instead.", as soon as the new AX take is dropped (`public/listen/one-text-three-readers.mp3` and `.json`). Until then the style baseline holds at 581 only because of them.
- The browser voice (fallback) is the browser's: on some browsers it may use a cloud voice under that vendor's terms.
- Chapter anchors: the case study shows 07 to 11 for chapters whose ids stay `#ch-06` to `#ch-10`; the sixth decision is `#ch-voice`.

## 9. Operating it

### First check of an answer read aloud

On the live site, open Rose, ask a factual question (for example "What has Ivan built?"), wait for the answer, press **Listen** under it. Then, in the Supabase SQL editor:

```sql
select created_at, chars, cached from public.rose_listen_usage order by created_at desc limit 5;
select kind, listen_source, count(*) from public.rose_events where kind like 'listen%' group by 1, 2;
```

A row with `chars > 0` and `cached = false` means ElevenLabs was called. No row and the browser voice speaking means the secret is missing or a cap was hit (check the function logs). Press Listen on the same answer in another session: `cached = true`, `chars = 0`.

### Adding or changing a summary

1. Write the text and get Ivan's validation (the text is read word for word).
2. Record it (ElevenLabs studio, or `bun scripts/generate-listen-audio.ts`, which needs `ELEVENLABS_API_KEY` in the session environment and never runs in CI or the Lovable build; it writes `public/listen/<slug>.mp3` and `.json` and prints the model used and the characters billed; `--dry` lists what it would bill; a take made by hand, with no hash, is left alone unless `--force`).
3. Add the entry to `listenSummaries.ts` (`path`, `text`, `validatedOn`, `durationMs` equal to the recording's, `script` optional, `inRoseVoice` for Rose's own voice). The page block, the mirror, `llms-full.txt`, MCP, the dock and Rose's context all read it.
4. Add the page to the line "Recorded summaries" in `supabase/functions/_shared/rose-context.ts` and to `ROSE_CAPABILITIES`, then `bun scripts/generate-rose-history.ts`. A test checks that Rose names exactly the pages that have a summary.
5. Regenerate mirrors (`bun scripts/generate-rose-mirror.ts`, `generate-journal-mirror.ts`, `bunx tsx scripts/generate-llms-full.ts`), run the tests, the style check (no hit above 581, no new allowlist entry), then ask Lovable to regenerate the MCP bundle and deploy `rose-chat`.

### Watching it

- Usage and cost: sum `chars` of `rose_listen_usage` where `cached = false`, per UTC day, against `LISTEN_DAILY_CHAR_CAP`.
- Use: `listen` and `listen_complete` in `rose_events`, by `listen_source` and `path`. Counts are events, not people; a `listen` is a reading started, not heard.
- This feeds the open question 04 (Modality) of the case study: listens started and finished, page by page.

### Switching it off

- **Stop spending, keep summaries**: delete the secret `LISTEN_DAILY_CHAR_CAP` (or set it to 0): new answers get 429 and the browser voice.
- **Stop all voice from answers**: delete `ELEVENLABS_API_KEY`.
- **Pause Rose entirely**: `ROSE_STATUS` in `src/content/roseStatus.ts` (the paused notice replaces the dock, and Listen with it).
- **Remove Listen from the site**: revert the merge commits `62a546d` (#78), `941a9d2` (#77) and the merge of #76 (`36f0cac`), ask Lovable to regenerate the MCP bundle and redeploy `rose-chat`, `rose-event` and `rose-listen`, then publish. The database objects can stay: they are inert without the function.

## 10. Tests that guard it

`src/test/roseListenCore.test.ts` (text, masking, timings, cache key, model strategy), `roseListenHandler.test.ts` (403, caps, cache, masking, background purge), `roseListenPlayer.test.tsx` (audiogram, reduced motion, keyboard, Read / Listen, browser voice, dock), `roseListenContrast.test.ts` (Day and Dusk), `roseListenMeasurement.test.ts` (events, migrations, no key in files), `listenSummarySurfaces.test.tsx` (every summary word for word on its page, mirror, `llms-full.txt` and MCP; tags never shown; Rose knows the pages), and the existing `roseHistorySignature.test.ts` (no signature key in any tracked file).

Two failures are known on this Windows working copy and are not defects of Listen: `fieldNotesV2 > says the new title everywhere` (a file is CRLF under `core.autocrlf=true`, the test splits on `\n`); and `mcpBundleFreshness`, red only between a change to `src/lib/mcp` or `statuses.ts` and the next regeneration by Lovable.
