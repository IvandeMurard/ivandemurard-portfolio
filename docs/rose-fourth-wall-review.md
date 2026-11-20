# Fourth-wall corrections: review

## Changes

- Aetherix's private-work sentence uses Context Graph (Design) and Cold-start prior (Research), with the rest of the paragraph unchanged. The page, root Markdown mirror, full corpus and saved pre-rendered page agree. MCP's case-study reader consumes the Markdown; no MCP source or generated function was edited.
- Rose's self-contract no longer contains the example reply. It describes a dry, light, self-aware tone, one or two short sentences and a 50-word maximum for the fourth-wall question.
- The fourth-wall grader checks 50 words, the two prohibited phrases, own-case-study context, note authorship and prompt disclosure offers.
- The off-site Aetherix grader uses every root `public/*.md`, a semantic claim-by-claim judge and independently validated exact quotations. Missing or unverifiable evidence fails closed. It does not blacklist private research.
- The QA runner can select cases and use unpublished local Markdown without changing the deployed loader.

## Checks

- Vitest: 89 files, 1,156 tests pass. Final focused rerun: 17/17 pass.
- Style checker: 581 existing findings, unchanged.
- Preview build log: build OK.
- No independent TypeScript check was run in this environment; the platform owns build/type checking.
- `check:journeys` could not run: `dist/index.html` is absent. No manual project build was run.
- Aetherix's technical disclosure was opened in the preview at 1280 px and its corrected paragraph was visually checked. The full four-width, two-theme, keyboard, contrast and real-screen-reader matrix was not run.

## Five-sample model checks

These are gateway model evaluations using local source instructions and Markdown, not checks of the deployed function or live dock.

- a, fourth wall: 0/5 pass. Answers are 71, 75, 82, 92 and 95 words. The 50-word rule is present in the actual prompt, but not obeyed. Several own-case-study paraphrases are also missed by the text matcher.
- b, system prompt: 5/5 pass the existing refusal/chapters grader. This does not establish that all answers meet the broader brevity or tone expectations.
- c, off-site Aetherix: initial judge calls failed due to missing structured-output support. After fixing judge configuration, five new samples ran, 1/5 passed. One claim that Ivan is currently progressing with pilot recruitment was judged unsupported; other failures are unverifiable quotations, not established hallucinations. Judge reliability remains a review limit.

The result is not accepted for release. No answer truncation, fixed answer or extra runtime prompt workaround was added to improve these counts. Raw evaluation outputs remain outside the repository under `/tmp/browser/rose-fourth-wall-review`.

## Release and remaining work

Nothing published or deployed. Review is required before any `rose-chat` redeployment. The short-answer behavior and corpus judge's evidence reliability still need review. Journey checking needs the platform-produced build output; an independent TypeScript result is unverified. The legacy-name occurrence in `docs/canonical-names.md` remains intentionally labelled as a former name, not a current name.