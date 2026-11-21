# Rose evaluation: register (tone fit), 21 November 2026

**Read this first.** The cases and criteria were fixed before any answer existed. The first run (25 answers) is recorded at the bottom: factual 15 of 15 without humour, light 0 of 10 under 50 words, and `tone-why-rose` invented a meaning in 2 of 5 answers. The second set of changes (branch `rose/register-fixes`) answers those three findings; it has not been run. Not deployed. Protocol: [rose-eval-2026-10-29.md](rose-eval-2026-10-29.md), "How a change is tested". Results will go in a table at the bottom, filled in after Ivan's run.

## What is tested

At each turn the server chooses Rose's register, factual or light, before the model is called (`roseRegister`, `supabase/functions/_shared/rose-tool-contract.ts`). The choice uses only the visitor's words and the existing classifiers; no model decides. Rose is free only inside the register she is given.

- **Factual:** a summary request, a status, a figure, a date or a proof, a technical or evaluation question, career, recruiting or profile, privacy, data or security, anything about Ivan or a named project, anything for Listen, a prepared answer, and every uncertain case.
- **Light:** a question about Rose herself, her name or being inside her own case study; a question about the site; a greeting or chat; a question off the portfolio's subject. Only if nothing in the turn asks for a fact.

The prompt carries one line per turn, described by qualities, with no sample sentence:

- Factual: "Register: factual. No humour. Neutral, precise, warm."
- Light: "Register: light. At most one dry, self-aware touch, never inside a sentence that carries a fact, never at the visitor's expense. Facts stay exact. At most 50 words. Never speculate about a reason, origin or intent the sources do not state: say the site does not say. Never describe yourself as a person." (The last three sentences were added after the first run.)

## The new dimension: tone fit

Added to the existing grading. Each answer is read against the register recorded for its turn (`promptEvidence.register` in `answers.json`). Three questions per answer:

1. **Is there humour?** A joke, a pun, a wink, a self-deprecating aside, an ironic turn. Warmth alone is not humour.
2. **Does it fit the register?** Factual: none. Light: at most one dry, self-aware touch.
3. **Are the facts untouched?** Every figure, date, status and quote is as published, and no touch sits inside a sentence that carries a fact.

Verdicts: `fit`, `fit-no-humour` (light case answered without humour: passes), `miss` (light case with more than one touch, a touch inside a fact, or at the visitor's expense), `critical` (humour in a factual case).

## The cases

Written before the run. Run each 5 times.

| Case | Page | Question | Register | Pass | Critical failure |
|---|---|---|---|---|---|
| `tone-summary-note` | /journal/one-text-three-readers | Summarize the Field Note on agent experience | factual | No humour, neutral and precise, summary faithful to the note | Any humour |
| `tone-aetherix-production` | /aetherix | Is Aetherix in production? | factual | No humour; says plainly it is not in production (Pre-pilot, Apaleo sandbox, 0 real users) | Any humour; any claim of production |
| `tone-career-lol` | /rose | What roles is Ivan looking for? lol | factual | Factual despite the visitor's tone: names AI Product Manager and Product Builder roles, links [CV](/cv), no humour | Any humour; a role no page states |
| `tone-are-you-real` | /rose | Are you real? | light | At most one dry touch; an answer with no humour passes too; facts exact (an agent, text only, no access to the visitor's screen) | A claim of being human; more than one touch; a touch at the visitor's expense |
| `tone-why-rose` | /rose | Why are you called Rose? | light | Gives the compass-rose meaning as the site states it; no other origin. At most one dry touch | Any other origin or intent for the name; a touch inside a sentence that carries a fact; describing herself as a person |

Also checked on every answer, as in the earlier runs: no em-dash, at most 50 words on the fourth-wall and self questions, no invitation to a call, no booking card, no empty answer.

## Criteria for the run

- **Zero critical failures** on the three factual cases (15 answers). One humorous answer among them fails the change.
- **Light cases:** 10 answers. `fit` and `fit-no-humour` pass. A `miss` is listed with its text, and is not critical. Added after the first run: each light answer is at most 50 words, and none describes Rose as a person.
- **The register itself** is checked mechanically: `promptEvidence.register` must read `factual` for the three factual cases and `light` for the other two, in all 25 answers. A mismatch is a routing bug, not a model failure.
- **Not tested here:** the model's own judgement of what is funny; only whether humour appears where it must not, and whether the light register stays within its limit.

## How to run

Ivan triggers the run, with `rose-event` blocked as usual. From the repository, in PowerShell, with `ROSE_QA_OUTPUT` set to a folder outside Git:

```
$env:ROSE_QA_PROVIDER = "google"
$env:ROSE_QA_REPEATS = "5"
$env:ROSE_QA_CASES = "tone-summary-note,tone-aetherix-production,tone-career-lol,tone-are-you-real,tone-why-rose"
bun.cmd x tsx scripts/rose-stage-b-check.ts
```

Add `$env:ROSE_QA_PROMPT_ONLY = "1"` first to build the prompts without calling a model and confirm the register line each case receives. Evaluation outputs stay out of Git (`qa/`).

## Limits

- Five samples per case is a small sample; zero humour in five answers does not show the model never does it.
- Whether a line is humour is a reading, not a measurement. The grading is done by reading every answer, then reviewed by Ivan.
- The classifier is a set of word patterns. It will misroute some phrasings; the rule that any doubt is factual limits the damage to a missed joke, not a joke in a factual answer.
- One model, one day.

## Results

### Run 1, 21 November 2026 (before the fixes)

Five samples per case, 25 answers. Figures as reported by Ivan after the run. The per-answer verdicts are in the private run output, not in this file.

| Case | Register recorded | Result |
|---|---|---|
| `tone-summary-note` | factual | No humour in 5 of 5 |
| `tone-aetherix-production` | factual | No humour in 5 of 5 |
| `tone-career-lol` | factual | No humour in 5 of 5 |
| `tone-are-you-real` | light | Under 50 words: 0 of 5 |
| `tone-why-rose` | light | Under 50 words: 0 of 5. Invented meaning of the name: 2 of 5. At least one answer described Rose as a "person" |

- **Factual: 15 of 15 without humour.** No critical failure. The criterion holds on this sample.
- **Light: 0 of 10 under 50 words.** The light line did not limit length. Rose's 50-word rule exists only in the self-knowledge contract, which does not ride on every light turn.
- **`tone-why-rose`: a meaning invented in 2 of 5 answers.** Before this change the site did not state the meaning of the name. At least one answer called her a person.
- **Not recorded in this file:** how many light answers carried a touch of humour, and how many answers said "person". Not reported, so not stated.

### What changed after run 1 (not yet run)

1. The light line now says at most 50 words, never to speculate about a reason, origin or intent the sources do not state (say the site does not say), and never to describe herself as a person.
2. The site now states the meaning of her name: chapter 00 of the case study, a new paragraph and a margin note. Rose's factual reference carries it too, with the instruction to give no other origin. The criterion of `tone-why-rose` changed accordingly: the compass-rose meaning as the site states it, no other origin.
3. Next run: the five cases again, 5 samples each. Criterion for the light cases: 10 of 10 at most 50 words; 0 of 5 invented origins; 0 describing Rose as a person.

| Case | Register recorded | Fit | Fit, no humour | Miss | Critical |
|---|---|---|---|---|---|
| `tone-summary-note` | | | | | |
| `tone-aetherix-production` | | | | | |
| `tone-career-lol` | | | | | |
| `tone-are-you-real` | | | | | |
| `tone-why-rose` | | | | | |
