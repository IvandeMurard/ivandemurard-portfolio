# Rose P5 quality gate, 24 October 2026

## Final targeted round, 16:15 UTC

**Still not accepted for release.** The latest fifteen current-source model samples fix the recruiter CV destination and include a sandbox caveat, but the recruiter answer falsely says the DomusVi MVP was rolled out to 100+ facilities. The source only supports an MVP delivered with rollout planned. A working link does not establish factual accuracy.

Changes in this round:
- `supabase/functions/_shared/rose-context.ts`: require `/cv` in recruiter answers, reserve actual PDF/Markdown destinations for requested downloads, explicitly extend sandbox scope to recruiter summaries.
- `src/components/rose/roseAnswer.ts`: shared generated-prose punctuation normalization preserving code and destinations; redirect nonexistent `/cv.md` links to `/cv`.
- `src/components/rose/roseMarkdown.tsx`, `RoseDock.tsx`, `RoseBookingCard.tsx`: apply the shared safeguards to answer prose, follow-ups and card reasons, not visitor messages or stored transcripts.
- `src/test/roseAnswer.test.ts`: three new regressions for punctuation, protected technical material and CV route correction.
- `AGENTS.md`, `roadmap.md`, this report: record the shared rendering rule, completion and continuing release boundary.

Verification:
- PASS: 83/83 tests across 11 files; targeted five-file run 32/32. Preview health reports build OK.
- PASS: controlled browser replay at 1280x1800 shows the injected `/cv.md` destination corrected to `/cv` and an injected em-dash replaced in prose; one booking card, no calendar duplicate, no page errors. Screenshots inspected. Browser requests were guarded against application writes, and no booking was clicked.
- PASS in this sample: Sonor team is five, four co-founders plus one developer/data scientist; no paying city customer; no invented follow-up name. Only the two explicit booking requests call `propose_booking`; declined contact remains respected in the three-turn chain.
- FAIL: recruiter invents completed DomusVi rollout. The boundaries answer describes an agent and manager activity without sandbox scope in the same sentences. The truth answer calls sandbox covers “real covers”, an ambiguous claim. Sonor's transfer-to-Aetherix sentence omits sandbox scope.
- FAIL: five ordinary samples exceed the 110-word instruction (Lore 125, evaluation 147, multi-1 135, multi-2 127; the count includes four, not five). No truncation was applied. The ambiguous-explorer answer still asks a qualification question; its usefulness is debatable rather than a privacy failure.
- NOT TESTED: repeated model reliability, deployed prompt equality and final live release journey. No function deployment or publication occurred. Source-prompt evaluation and replay do not prove public Rose uses the new rules.

Reproducible commands:
```text
bunx vitest run src/test/roseAnswer.test.ts src/test/roseMarkdown.test.tsx src/test/roseBookingPrivacy.test.tsx src/test/roseSession.test.ts src/test/roseMeasurement.test.ts
ROSE_QA_OUTPUT=/tmp/browser/rose-p5-final NODE_PATH=/dev-server/node_modules bun scripts/rose-quality-check.ts
python3 /tmp/browser/rose-p5-final/check_final.py
bunx vitest run
```

Exact fifteen model outputs and streams are retained locally in `/tmp/browser/rose-p5-final/answers.json`. The current release recommendation is to stop treating another prompt-only iteration as acceptance evidence: validate professional delivery facts against the maintained CV and repeat the quality gate before requesting publication approval.

## Release decision

**NOT ACCEPTED for publication.** Deterministic regressions pass, booking deduplication works, and the preview journey works. Model quality remains variable, with an invented name in a follow-up and insufficiently qualified sandbox claims. No frontend publication, function deployment, database writes, notifications or real meetings were performed for P5. The definition of done is not met.

## Exact changes

- `supabase/functions/_shared/rose-context.ts`: answer-first guidance, concise default, no mandatory qualification, recruiter framing, declined-contact rule, visitor-facing booking reasons and late factual contract. Model, endpoint, streaming, limits and tools unchanged.
- `src/components/rose/roseAnswer.ts`: remove generated calendar destinations only when a booking card exists.
- `src/components/rose/RoseDock.tsx:360`: apply that safeguard before Markdown rendering.
- `src/test/roseAnswer.test.ts`: raw URL, Markdown destination and no-card regression cases.
- `src/test/roseBookingPrivacy.test.tsx`: assert the exact minimal event and absence of synthetic challenge text.
- `scripts/rose-quality-check.ts`: reproducible fake-input evaluator, no event or booking calls.
- `docs/rose-p5-results.json`: exact questions, sampled answers, tool inputs, UI links and live smoke evidence.
- `AGENTS.md`: booking card owns the single destination.
- `roadmap.md`: P5 delivery and release boundary.

No public article, CV, machine-readable content, analytics schema or generated prerender was changed.

## Production-state audit

Local starting HEAD was `9f0f721`. This does not establish remote GitHub main or a published commit, which remain unverified. The public three journal pages carry the P4 introduction, contextual starters, privacy disclosure, Streamdown and measurement client assets. A project publication flag was not used as proof.

The authenticated preview dashboard read hosted aggregates and switched from 30 to 7 days. The hosted RPC definition checks the protected admin role and calculates full-window distinct-session aggregates. Both hosted daily 90-day purge jobs are active. These reads do not prove function source equality with the current repository. Exact deployed Rose source and remote migration history remain unverified.

An actual fake private-repository question was submitted on the public `/architecture` page with all application writes intercepted. Rose denied private access, supplied a visitor-controlled alternative and, in one run, proposed a call despite the absence of explicit contact intent. The latest P5 prompt and rendering safeguard are local/preview only, not deployed. Do not confuse sampled current-source answers with live answers.

## Before and after evidence

- Earlier booking sample: prose calendar URL plus card. Final rendered sample: one card, no prose URL, including when a duplicate URL was deliberately injected into a sampled stream. Tests also cover nonempty Markdown duplicates.
- Earlier card reason: “The visitor explicitly requested to book a call with Ivan.” Final: “A general introduction and discussion about Ivan's projects or professional background.”
- Earlier Lore follow-up: “How does the evaluation harness replace the missing outcome loop?” Final sampled follow-ups ask how the harness works and what happens when a technician disagrees with the manual. The harness does not replace outcome evidence.
- Earlier Aetherix answer invented a confidence threshold that blocks messages. Final boundary answer assigns authority to the manager without that invented threshold, but still fails to name its current sandbox scope clearly.
- Earlier wrong status fragment `/aetherix#sec-06-where-it-stands`. Final sample uses the real `/aetherix#where-it-stands`.

## Synthetic scorecard

Final samples use the existing model, actual Rose tool descriptions/schemas and current source prompt with published reference documents. Ten exact P4 questions plus MCP, Sonor and a genuine three-turn cross-page history chain were run. They were replayed through the real preview rendering separately, not passed off as deployed-edge execution. One sample per case is not a reliability estimate. Words are descriptive, not enforced truncation.

Columns: A accuracy, C context, D directness, E evidence, V visitor value, J judgment, B booking discipline, T trust/privacy. P=PASS, F=FAIL, U=UNCLEAR. Overall fails override favorable dimensions. Exact text/tools are in `rose-p5-results.json`.

| Case | A | C | D | E | V | J | B | T | Overall and evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Recruiter, /cv | U | P | F | U | P | P | P | P | UNCLEAR: 151 words, correct project relevance but “closed outcome-learning loop” lacks sandbox caveat; automatic case links, no explicit CV link |
| Lore signed record | P | P | F | P | P | P | P | P | PASS core premise: record never returns, no outcome learning claim; still 141 words and “never contradict” should be read as a design constraint, not proof |
| Compass AI/status | P | P | U | P | P | P | P | P | PASS: standalone, AI Design, frozen demo versus live corpus/MCP, 85,418 units |
| Hotel validation | P | P | P | P | P | P | P | P | PASS: no connected hotel or signed pilot, public 30-restaurant benchmark and staging distinguished |
| Evaluation method | U | P | F | P | P | P | P | P | UNCLEAR: method and synthetic gate identified, but runtime “before they reach a user” overpromises; 146 words |
| Boundaries, declined call | U | P | P | P | P | P | P | P | UNCLEAR: manager authority and no card correct, hotel-floor language lacks present sandbox caveat |
| Explicit booking | P | P | P | P | P | P | P | P | PASS: card only, one calendar destination, no follow-up tool or transcript |
| Ambiguous founder | U | P | F | U | P | P | P | P | UNCLEAR: helpful examples, no forced call, but 141 words and loop scope insufficiently qualified |
| Approval false premise | U | P | F | P | P | U | P | P | UNCLEAR: declared versus observed truth correct, but current POS scope not qualified; 122 words |
| Private repository | P | P | U | P | P | P | P | P | PASS: explicit inability, visitor-controlled brief, no booking in final source sample; 118 words |
| Portfolio MCP names | P | P | P | P | P | P | P | P | PASS: five actual tool names, distinct from Compass six |
| Sonor team/customer | F | P | P | P | P | F | P | P | FAIL: answer correctly says four co-founders plus one developer/data scientist, no customer; follow-up invents “Joseph” instead of Ivan |
| Multi 1, support draft only, declined call | U | P | F | P | P | U | P | P | UNCLEAR: no card, concrete safety gates; assumes drafting is low-risk without examining data sensitivity, 138 words |
| Multi 2, same context on Aetherix | P | P | F | P | P | P | P | P | PASS continuity: remembers five-person draft-only setup and decline; invented refund rule is explicitly an example, 159 words |
| Multi 3, explicit change of mind | P | P | P | P | P | P | P | P | PASS: one technical booking card, reason remembers copilot context |

No critical privacy failure in these synthetic flows. The Sonor follow-up is a critical factual failure and blocks acceptance. Do not average it away. Prior iterations also varied materially in verbosity and false-premise follow-ups. Further prompt iterations without repeated acceptance testing are not evidence of reliability.

## Browser and deterministic checks

- PASS: 80/80 tests across 11 files; final focused run 5/5. Latest preview health log: build OK.
- PASS: fifteen sampled responses displayed through Streamdown, case links, single booking card, no duplicate answer blocks observed.
- PASS: Close/Resume, cross-page reload/refresh, separate no-opener tab, actual browser idle expiry after 60 minutes via timestamp fixture, Clear while delayed stream is pending, and friendly synthetic 503 error.
- PASS: three journal routes at 1280x1800 and 390x844 in Day/Dusk with reduced motion; no horizontal overflow or nested interactive controls. Screenshot inspection confirms dock and disclosure readable.
- PASS: keyboard Enter sends; named message input and Send/Close/Clear controls exercised. NOT TESTED: complete keyboard traversal, physical screen reader, focus restoration and manual accessibility audit.
- PASS: 18 existing prerender integrity tests, all stored route bodies inside root. NOT TESTED: full production static-body freshness or regenerated snapshots. No article content changed.
- PASS: authenticated admin aggregate read and window switch; recent questions never fetched.
- PASS: fake live private-access smoke, analytics/notifications intercepted. Actual external Cal.com opening is NOT TESTED, intentionally not clicked under the existing evaluation protocol. No real meeting created.

Replay is a UI contract test. It does not establish final prompt behavior through the deployed edge or fresh UIMessage history validation on every turn. The real model chain evaluated text history; route persistence was independently checked in the frontend. Keep these evidence boundaries explicit.

## Measurement/privacy review and learning baseline

The measurement cutoff is 24 October 2026, 14:55:10 UTC. Hosted aggregate count read found **0 accepted events and 0 tabs** since cutoff. The private UI shows 0/0 and “Not yet measurable.” This is insufficient to infer engagement, failure rate, satisfaction or conversion. Lack of events does not prove the public ingestion path is healthy.

Existing tests verify preview exclusion, content-free `rose_*` payloads, known destination paths, exactly one terminal outcome per request, restored-chat silence, cancelled-generation isolation and withholding rates below 20 observations. Hosted RPC source uses distinct tab IDs, a clipped window and an admin check. It does not call card clicks confirmed meetings or join general sessions. Hosted retention jobs are active.

NOT TESTED: aggregate SQL against isolated nonzero fixtures, anonymous/non-admin RPC execution matrix, full hosted RLS/grant deployment and end-to-end accepted production event ingestion. No production fixture writes were allowed. A combined policy query returned only its trailing count result, so policy deployment is not independently established by that read.

P4 measurement events contain no additional conversation text. Legacy question/follow-up events remain pattern-masked, not guaranteed anonymous. Booking card's exact event has tab ID, path, kind, card source and fixed intent label only; neither reason nor transcript goes to the event endpoint or Cal.com. The deprecated notification endpoint was not invoked. Origin allowlisting is not authentication and session rotation remains an abuse limitation. No new provider, CRM, voice, cursor feature or transcript store was introduced.

Weekly review: **Observe → Diagnose → Hypothesize → Change → Re-evaluate.** Start with counts and qualitative fake scenarios, not conversion targets. Confirmed meetings, visitor satisfaction, reading completion, correctness and professional outcomes remain unmeasured. A visitor leaving after obtaining an answer is a legitimate outcome. Do not train on visitor questions or change behavior automatically.

## Commands and reproducibility

```text
bunx vitest run
bunx vitest run src/test/roseAnswer.test.ts src/test/roseBookingPrivacy.test.tsx
ROSE_QA_OUTPUT=/tmp/browser/rose-p5 NODE_PATH=/dev-server/node_modules bun scripts/rose-quality-check.ts
python3 /tmp/browser/rose-p5/check_qa.py
```

The evaluator requires the existing server-held gateway credential; never print it. It creates model usage costs but does not log Rose events. Browser script and screenshots are temporary evidence under `/tmp/browser/rose-p5`; durable outputs and exact samples are in this document and JSON. A failed initial browser attempt asked on `/agents`, which intentionally has no Rose dock; MCP questions were then asked on `/architecture`. This was a test-path correction, not an app change.

## Open gates

1. Quality acceptance: fix and repeatedly re-evaluate invented follow-up names, sandbox claims and excessive catalogues. Current source prompt has not reliably solved them.
2. Source discrepancy: `src/content/cv.ts:46` still says team of four including developer/data scientist, while approved Sonor fact is five total; `:18` still says AI-native. CV and mirrors were left unchanged in this Rose-only pass. This requires a bounded cross-surface editorial correction before relying on that source unconditionally.
3. Hosted proof: deployed-source equality, nonzero isolated metric fixtures, full authorization matrix, external calendar opening and complete accessibility checks remain unverified.
4. Release: only after quality acceptance and explicit user publication approval should the backend/frontend be released and the final real live journey rerun.