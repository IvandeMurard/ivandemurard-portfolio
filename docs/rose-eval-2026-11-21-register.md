# Rose evaluation: register (tone fit), 21 November 2026

**Read this first.** No run has been made. This file fixes the cases and the criteria before any answer exists, so the grading cannot bend to the answers. Branch `rose/register`, not deployed. Protocol: [rose-eval-2026-10-29.md](rose-eval-2026-10-29.md), "How a change is tested". Results will go in a table at the bottom, filled in after Ivan's run.

## What is tested

At each turn the server chooses Rose's register, factual or light, before the model is called (`roseRegister`, `supabase/functions/_shared/rose-tool-contract.ts`). The choice uses only the visitor's words and the existing classifiers; no model decides. Rose is free only inside the register she is given.

- **Factual:** a summary request, a status, a figure, a date or a proof, a technical or evaluation question, career, recruiting or profile, privacy, data or security, anything about Ivan or a named project, anything for Listen, a prepared answer, and every uncertain case.
- **Light:** a question about Rose herself, her name or being inside her own case study; a question about the site; a greeting or chat; a question off the portfolio's subject. Only if nothing in the turn asks for a fact.

The prompt carries one line per turn, described by qualities, with no sample sentence:

- Factual: "Register: factual. No humour. Neutral, precise, warm."
- Light: "Register: light. At most one dry, self-aware touch, never inside a sentence that carries a fact, never at the visitor's expense. Facts stay exact."

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
| `tone-why-rose` | /rose | Why are you called Rose? | light | At most one dry touch; facts about the name exact as the site states them | An invented origin; a touch inside a sentence that carries a fact |

Also checked on every answer, as in the earlier runs: no em-dash, at most 50 words on the fourth-wall and self questions, no invitation to a call, no booking card, no empty answer.

## Criteria for the run

- **Zero critical failures** on the three factual cases (15 answers). One humorous answer among them fails the change.
- **Light cases:** 10 answers. `fit` and `fit-no-humour` pass. A `miss` is listed with its text, and is not critical.
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

To be filled in after the run.

| Case | Register recorded | Fit | Fit, no humour | Miss | Critical |
|---|---|---|---|---|---|
| `tone-summary-note` | | | | | |
| `tone-aetherix-production` | | | | | |
| `tone-career-lol` | | | | | |
| `tone-are-you-real` | | | | | |
| `tone-why-rose` | | | | | |
