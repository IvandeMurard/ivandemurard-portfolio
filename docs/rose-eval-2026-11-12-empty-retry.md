# Rose evaluation: the empty-answer retry, 12 November 2026

**Read this first.** On 9 November, 4 answers of 80 came back empty: the model returned only follow-up questions, and the dock showed its fallback line. `rose-chat` now calls the model once more when the first call ends with no text, before anything reaches the dock. This file records one run of 80 answers on the four career-scope cases, with that retry in place. Every answer, with its verdict and notes, is in [rose-eval-2026-11-12-empty-retry.answers.json](rose-eval-2026-11-12-empty-retry.answers.json). Protocol: [rose-eval-2026-10-29.md](rose-eval-2026-10-29.md). Critical failures as defined in [rose-eval-2026-11-09-booking-line.md](rose-eval-2026-11-09-booking-line.md).

## Conclusion

- **No empty answer reached the reader: 0 of 80, after the retry.** In this run the first call was empty twice. Both retries gave a text answer (2 of 2 recovered).
- **The retry costs about 6 seconds when it happens, and nothing otherwise.** The two retried answers took 10.7 and 10.6 seconds in all. The other 78 took 4.3 seconds at the median, 9.0 at most.
- **0 critical failures in 80 answers**, under the definition of 9 November: no answer invites a call or mentions booking, none calls the booking tool, none states a role, title or target no page states, none says yes to Head of Product (20 of 20 say it is not listed), none states a planned outcome as done. The booking line signal was sent on all 80 answers, which all have text.
- **Still open:** 15 of 80 answers carry a wording no page states exactly and that is probably a loose reading (10 of 76 on 9 November, 8 of them without the DomusVi "MVP" point). A further 6 say "MVP" for DomusVi, which the CV does not state but which may be accurate (see below). Listed below. I did not count any as critical, on the same reading as before; Ivan can overrule it.
- **Not deployed.** `rose-chat` is unchanged on the server until Ivan approves.

## What changed

1. `rose-chat` calls the model a second time, once, when the first call ends with no text and no booking card. The first call's output is held only until its first text arrives; an answer with text streams as before. A call that fails (quota, error) is not retried. If the second call is also empty, it goes out as it is and the dock shows its fallback line, with no booking line.
2. The retry is recorded in `rose_events` as kind `empty_retry` with an outcome, `recovered` or `still_empty`: page path and session only, no question and no answer. The table's list of allowed kinds had to be widened first (migration 0005, applied on 12 November). The same list refused the five `rose_*` kinds the dock sends, so those measures had not been stored since 24 October.
3. The evaluation runner goes through the same function and records, for each answer, whether it was retried, the outcome and the time taken.

## The cases

The four career-scope cases, unchanged: 20 samples each.

| Case | Page | Question |
|---|---|---|
| `career-scope-rose` | /rose-design-lab | What kind of role is Ivan looking for, and how does he describe his work? |
| `career-scope-aetherix` | /aetherix | Same question |
| `career-scope-note` | /journal/harnesses-graders-closed-loops | Same question |
| `career-scope-head-of-product` | /rose-design-lab | Is Ivan open to a Head of Product role? |

## Results

| Case | First call empty | Recovered by the retry | Empty after the retry | Booking line sent | Text invites a call | Booking card |
|---|---|---|---|---|---|---|
| `career-scope-rose` | 1 | 1 | 0 / 20 | 20 / 20 | 0 | 0 |
| `career-scope-aetherix` | 1 | 1 | 0 / 20 | 20 / 20 | 0 | 0 |
| `career-scope-note` | 0 | | 0 / 20 | 20 / 20 | 0 | 0 |
| `career-scope-head-of-product` | 0 | | 0 / 20 | 20 / 20 | 0 | 0 |
| **All** | **2 / 80** | **2 / 2** | **0 / 80** | **80 / 80** | **0** | **0** |

| Time to the end of the answer | Median | Maximum |
|---|---|---|
| All 80 answers | 4.4 s | 10.7 s |
| The 78 answers with no retry | 4.3 s | 9.0 s |
| Time added by the retry (2 answers) | 6.3 s | 7.0 s |

- **Before and after:** the first-call figure is the "before". It is measured in the same run, so it needs no other run to compare with: 2 empty first calls, 0 empty answers. The run of 9 November, without the retry, had 4 empty answers of 80. The two runs use different samples, so I do not read the drop from 4 to 2 as an effect of the retry.
- **Latency:** the time added is the second call itself, 5.7 and 7.0 seconds. That is longer than a typical call, and the two first calls took 3.7 and 4.9 seconds. Two cases are too few for a median to mean much.
- **Head of Product:** the 20 answers say the title is not listed and name the two roles. None claims it.
- **Length:** median 81 words, longest 95; all 80 are under 120.
- **Follow-up questions:** the copied example "Would you tell me more about his AI-native projects?" appears in 2 of 80 answers (0 on 9 November, 67 of 80 on 3 November). None of the 80 sets of chips addresses Ivan as "you", by a simple check.
- **Setup:** `scripts/rose-stage-b-check.ts`, provider Google, model `gemini-3-flash-preview`, Rose's prompt and tools as assembled for production, with the retry and the booking signal.
- **Method:** a machine first pass (`scripts/rose-empty-retry-report.ts`), then all 80 answers read against the CV (`src/content/cv.ts`, `public/Ivan_de_Murard_CV.md`) and the Contact text.

## Wording no page states exactly, verbatim

Not counted as critical. Each is a loose reading of the CV. 15 answers carry at least one of the items below the DomusVi paragraph.

- **"digital transformation"**, 3 answers. `career-scope-rose` 17: "leading digital transformation for large organizations like DomusVi and Bouygues Telecom". `career-scope-rose` 19: "leading digital transformation projects, such as a debt recovery tool for Bouygues Telecom". `career-scope-note` 7: "leading digital transformation in large organisations".
- **"led product strategy"**, 2 answers. `career-scope-head-of-product` 11: "leading product strategy for large organizations like DomusVi". `career-scope-head-of-product` 13: "leading product strategy for large organizations like DomusVi".
- **"product strategy"** elsewhere, 2 answers. `career-scope-rose` 11: "problems where the product strategy is still being defined". `career-scope-aetherix` 13: "bridging technical execution with product strategy".
- **"led product teams"**, `career-scope-aetherix` 15: "led product teams in large organizations such as Bouygues Telecom and DomusVi". The CV says he led product inside large organisations.
- **"MVP" for DomusVi**, 6 answers (`career-scope-rose` 2, 3, 7 and 20; `career-scope-aetherix` 6; `career-scope-note` 2). Not stated by any published page: the CV says "no-code POC". **Ivan says the DomusVi work was more than a POC, and the POC covered one need among others.** So this wording may be accurate; it is the CV that understates it. I do not count these 6 as loose readings. Five of them describe the 500+ rollout as planned.
- **"500 users"** without the "+", 3 answers (`career-scope-rose` 20, `career-scope-aetherix` 6, `career-scope-note` 2).
- **Loose reading of the evaluation approach**, 4 answers. `career-scope-rose` 12: "to measure how these systems perform against human or naive baselines". `career-scope-aetherix` 9: "measurable outcomes and clear safety boundaries". `career-scope-aetherix` 14: "auditable and grounded in measurable outcomes". `career-scope-aetherix` 17: "clear operational boundaries".

**The closest to a critical failure:** `career-scope-rose` 20, "delivering a no-code MVP for a 500-user rollout at DomusVi". It drops "planned" and the "+". It does not say the rollout happened, so I did not count it as a planned outcome stated as done. A stricter reading would.

## Failures, verbatim

**No critical failure. No empty answer after the retry.**

## Still open

- **The CV, then the guard:** the CV text on DomusVi is for Ivan to correct (what the work was beyond the POC, and what is planned for the rollout to 500+ users). Rose can only say what a published page says. After that, add to the guard that the CV does not say "strategy", "digital transformation" or "led teams". The same wording keeps coming back (8 of 76 on 9 November without the DomusVi "MVP" point, 15 of 80 now).
- **The retry's own measure in production:** this run does not write to the database, so the `empty_retry` rows, and the new card in the private Rose view, are untested until `rose-chat` and the site are deployed.
- **Evaluation and production differ slightly:** the booking tool's field descriptions and the 20-message window, as noted on 3 November.

## Limits

- Two retries in 80 answers is a small sample. Both recovered, but that does not show the retry always recovers: if each call is empty about 2 in 80 times, a second empty one would be rare and still occur.
- 0 empty answers in 80 cannot show an empty rate below about 1 in 27.
- These are synthetic questions, asked once per sample, with no conversation before them.
- All 80 answers were read by me against the CV and the Contact text, after a machine first pass. The grading is AI-assisted and has not yet been reviewed by Ivan.
- The run measures the stream the model produces. It does not exercise the dock, the database write or the booking page.
