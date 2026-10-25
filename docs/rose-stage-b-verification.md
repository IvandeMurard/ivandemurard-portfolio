# Rose self-knowledge, Stage B verification

Date: 2026-10-25. Decision: **HOLD release**. Local integration is implemented, but conversational acceptance is not complete. No function deployment, publication, analytics change or production feedback collection occurred.

## Exact scope

- Added `scripts/generate-rose-history.ts`: validates IDs, dates, claim classes, commit syntax and locally cited paths, then deterministically generates the private factual reference and separate persona string. A SHA-256 covers both canonical inputs. It does not independently re-audit historical commit diffs.
- Added `supabase/functions/_shared/rose-knowledge.generated.ts` and `docs/rose-history.generated.md`: generated, private, versioned artifacts. Neither enters public Markdown, MCP listings, sitemap or LLM corpus.
- Added `supabase/functions/_shared/rose-self-context.ts`: exact lab-route or self-question selection, bounded prior user turns, unavailable/incompatible-reference fallback and behavior-only calibration contract.
- Changed `supabase/functions/_shared/rose-context.ts`: imports generated persona and selectively adds historical facts; adds self-answer constraints after long portfolio references. Existing portfolio sources, model and tools remain unchanged.
- Changed `supabase/functions/rose-chat/index.ts`: supplies prior validated user text to reference selection. No client-provided history-selection flag or assistant/tool-authored claim can select sources.
- Changed `src/content/rosePrompts.ts`: two lab-specific self-reflection starters, with existing booking action preserved.
- Changed `package.json`: `rose:generate`, `rose:check`, and prebuild drift check. A deliberate canonical edit requires regeneration; prebuild checks rather than silently overwriting stale output.
- Added `src/test/roseSelfKnowledge.test.ts`: nine source/selection/budget/fallback/assembly checks.
- Added `scripts/rose-stage-b-check.ts`: 24 self scenarios, original 15 portfolio turns, four required journeys and four high-risk repeats. Synthetic gateway calls only, no event inserts or booking clicks. Supports `ROSE_QA_CASES` for targeted reruns.
- Changed `AGENTS.md` and `roadmap.md`: private generated-source contract and Stage B completion boundaries.

Canonical Stage A facts and persona wording were not edited. No hand-maintained second history was introduced. The post-reference behavioral contract refers to the canonical facts rather than copying dates or retention values.

## Verification matrix

| Check | Result | Evidence / limitation |
| --- | --- | --- |
| Full local regression suite | PASS | 95 tests, 14 files |
| Generated drift and local provenance paths | PASS | `bun scripts/generate-rose-history.ts --check`; reference 8,984 characters, maximum 16,000 |
| Selective loading and cross-page pronouns | PASS | Unit tests cover ordinary routes, exact lab route, 20-turn bound and missing-reference fallback |
| First synthetic evaluation | FAIL | 55 responses; wrong evaluation year, categorical tomorrow-memory claim, private-instruction misdescription and invented source anchor among findings |
| Calibrated synthetic evaluation | FAIL | 55 responses, no gateway errors; still wrong launch year in `self-20-1`, retention omission in `self-06-1`, irrelevant project metrics in `self-09-1`, and raw `suggest_followups(items: ...)` in `self-02-1` and `self-21-1` |
| Refused contact and explicit change of mind | PASS (sampled) | No booking after decline; exactly three proposals, all explicit booking requests: `portfolio-7-1`, `decline-4`, `portfolio-continuity-3` |
| Core identity / capability safeguards | PASS (sampled) | Refuses private instructions; no live voice, autonomous self-rewriting or live page annotation asserted in these samples |
| Portfolio regressions | FAIL | `portfolio-5-1` claims reliability is proven and mentions real covers alongside sandbox forecast; transfer/sandbox wording still requires review |
| Real dock rendering and cross-page transport | PASS, bounded | Playwright replay of actual new-prompt gateway streams on local preview: history lengths 1 then 3, lab to Aetherix, no page errors; screenshots inspected |
| New prompt executed end-to-end through deployed edge | NOT_TESTED | Shared edge deliberately not deployed. Browser uses intercepted SSE from source-prompt evaluation, not the old hosted prompt |
| Hosted parity / public historical URLs | NOT_TESTED | No public reference URL created; no deployment or hosted data-state audit |
| Mobile/Dusk/reduced motion | NOT_TESTED this stage | No layout redesign; desktop Day replay only |

## Interpretation and residual risks

Independent read-only review confirmed material date/privacy omissions and user-visible raw tool syntax. Source-generated grounding prevents reference drift but does not guarantee faithful model answers. One or two samples per scenario are not reliability estimates or evidence of actual visitor value.

The initial evaluator used guessed Chapter 03 metadata (`chapter-03`). Source inspection confirmed the real heading ID is `scene-c`, heading `Start with the work.` The harness was corrected and the affected cases must be read from their targeted rerun, not used to blame a generated broken anchor on production inputs.

The synthetic harness uses the configured model and one-step UI tools, but its tool descriptions are shortened and its history contains assistant prose rather than every UI part. It is not full deployed-handler parity. The browser test intercepts all function calls, suppresses production event writes, never clicks a calendar link, and does not use visitor data.

## Evidence retained

`docs/rose-stage-b-results.json` preserves raw reviewed model answers and tool calls for both 55-response runs. Temporary SSE and screenshots reside under `/tmp/browser/rose-stage-b*`. Test logs reported build OK after the changes. The targeted chapter rerun is recorded separately in `docs/rose-stage-b-chapter-results.json`.

## Next gate

Stage C remains blocked pending correction and repeated verification of date fidelity, complete privacy answers, self-measurement relevance, tool-prose leakage and portfolio reliability/sandbox wording. No release recommendation is made. Deployment and publication require explicit authorization after these checks.