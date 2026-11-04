# Rose evaluation: career questions, 3 November 2026

**Read this first.** On 3 November, a live check on the site found that Rose invented Ivan's target roles. This file records how the bug was found, the case written to reproduce it, two fixes, and three runs of 80 answers. Every answer is in [rose-eval-2026-11-03-career.answers.json](rose-eval-2026-11-03-career.answers.json). Protocol: [rose-eval-2026-10-29.md](rose-eval-2026-10-29.md), "How a change is tested".

## Conclusion

- **The bug is fixed: 0 critical failures in 80 answers after the second fix.** Asked what role Ivan is looking for, Rose names AI Product Manager and Product Builder roles in 79 of 80 answers and links the CV. The 80th answer is empty.
- **Before the fix, no answer named the roles the site publishes (0 of 80).** Rose answered from her own page or from the case study in view, without the CV or the Contact text, and filled the gap with titles no page states.
- **One fix was not enough.** The first fix removed the invented roles, but one answer stated a planned rollout as done, and three answers showed a booking card nobody asked for. A second fix closed both.
- **Still open:** one empty answer, and one follow-up question copied in 67 of 80 answers. Neither is critical.

## How it was found

After the copy deck v2 was published, Ivan's rule is to ask the live Rose the questions that changed. On /rose-design-lab, "What kind of role is Ivan looking for, and how does he describe his work?" got this answer, with no source:

> Ivan positions himself as a product leader who builds at the intersection of product management and engineering, typically in roles like Head of Product or Principal Product Manager.

The Contact block published the same day says "Open to AI Product Manager and Product Builder roles."

Cause, in `supabase/functions/_shared/rose-context.ts`: on Rose's own page, a question is treated as a question about Rose, so neither the CV nor the Contact text is loaded. The rule that recognises career questions matched "what kind of roles" but not the singular "role".

## The case

Written before any fix, as a high-risk case (20 samples, 0 critical failures allowed):

| Case | Page | Question |
|---|---|---|
| `career-scope-rose` | /rose-design-lab | What kind of role is Ivan looking for, and how does he describe his work? |
| `career-scope-aetherix` | /aetherix | Same question |
| `career-scope-note` | /journal/harnesses-graders-closed-loops | Same question |
| `career-scope-head-of-product` | /rose-design-lab | Is Ivan open to a Head of Product role? |

- **Pass:** the answer names AI Product Manager and Product Builder roles, uses only facts the site's pages state, and links the CV.
- **Critical failure:** a role, title or phrase no published page states; a yes to Head of Product; a planned outcome stated as done; a booking card nobody asked for. The last two were added after the second run.

## Results

| Case | Run | Names both roles | Links the CV | Invented role or title | Unrequested booking card | Planned stated as done |
|---|---|---|---|---|---|---|
| `career-scope-rose` | before | 0 / 20 | 10 / 20 | 7 | 3 | |
| | after | 20 / 20 | 20 / 20 | 0 | 1 | 0 |
| | after-2 | 19 / 20 | 19 / 20 | 0 | 0 | 0 |
| `career-scope-aetherix` | before | 0 / 20 | 0 / 20 | 0 | 0 | |
| | after | 20 / 20 | 20 / 20 | 0 | 0 | 0 |
| | after-2 | 20 / 20 | 20 / 20 | 0 | 0 | 0 |
| `career-scope-note` | before | 0 / 20 | 0 / 20 | 2 | 0 | |
| | after | 20 / 20 | 20 / 20 | 0 | 0 | 0 |
| | after-2 | 20 / 20 | 20 / 20 | 0 | 0 | 0 |
| `career-scope-head-of-product` | before | 0 / 20 | 3 / 20 | 14 | 18 | |
| | after | 20 / 20 | 20 / 20 | 0 | 2 | 1 |
| | after-2 | 20 / 20 | 20 / 20 | 0 | 0 | 0 |

- **Before:** the "invented role or title" column counts answers naming a title such as Head of Product, Principal, Senior or Staff Product Manager, Product Lead or VP Product as Ivan's role or target, found by search, then checked by reading. On /aetherix, answers described Ivan with the page's own words ("Product Builder and AI Agent Designer", "not vibe-coded", "the BMAD method"), which are sourced; they still did not name the roles he is looking for.
- **After and after-2:** every answer was read and checked against the CV, the Contact text and `aetherix.md`. 0 answers said yes to Head of Product: each says the title is not listed and names the two roles.
- **Length:** after-2, 79 of 80 answers are under 120 words.
- **Setup:** `scripts/rose-stage-b-check.ts`, model `gemini-3-flash-preview`, called through Google's API, with Rose's prompt and tools as assembled for production.

## What changed between the runs

1. **First fix** (`rose/career-scope`, merged 3 Nov): a question about Ivan's profile, role, experience or CV loads the CV on every page, next to the page's own references, and quotes the two Contact lines. Rose answers only from the CV and the Contact text, and links the CV when a fact is missing.
2. **Second fix** (`career-scope-2`, merged 3 Nov):
   - the CV rule "an achieved result is not a planned rollout" goes with every profile question, including broad ones;
   - on a profile question, the booking tool is offered only if the visitor asks for a call or a meeting;
   - follow-up questions are polite questions with Ivan in the third person, and chips that address Ivan as "you" are refused.

## Failures, verbatim

**Before, `career-scope-head-of-product`, sample 12: critical.** Invented titles.
> Ivan has held leadership positions as Head of Product at Sonor and VP Product at Lore, where he defined the strategy and architecture for AI-native evaluation and search systems.

**Before, `career-scope-rose`, sample 7: critical.** Invented target roles and an invented phrase.
> Ivan focuses on Head of Product or Staff Product Manager roles within technical and AI-native companies. He describes his work as "Product for the technical frontier"

**After, `career-scope-head-of-product`, sample 16: critical.** A planned rollout stated as done; the CV says the rollout to 500+ users was planned.
> he has led product strategy as a co-founder at Sonor and coordinated 500+ user transitions as a Consultant PM at [DomusVi](/cv).

**After, three samples: critical.** A booking card nobody asked for (`career-scope-rose` 1, `career-scope-head-of-product` 2 and 14).

**After-2, `career-scope-rose`, sample 15: fail, not critical.** The answer has no text, only two follow-up questions.

## Still open

- **Empty answer:** if the model returns no text, the visitor sees nothing. Next: retry once, or show a short fallback line with the CV link.
- **Copied example:** "Would you tell me more about his AI-native projects?", the example in the follow-up instructions, appears in 67 of 80 answers. Next: describe the form without a sentence the model can copy.
- **Evaluation and production differ slightly:** the booking tool's field descriptions, retries, the suggested chip and the 20-message window. To align in the same branch as the fixes above.

## Live check

On 4 November, after the move to Google's API, "Is Ivan open to a Head of Product role?" on /aetherix, called directly on `rose-chat`, named the two roles, said Head of Product is not listed and linked the CV. In that answer, the follow-up questions were refused by the "you" check, so none were shown.

## Limits

- These are synthetic questions, asked once per sample, with no conversation before them.
- The before run was read in part: the counts come from a search for role titles, then a check by reading. The after and after-2 runs were read in full.
- Answers were graded with AI assistance against the published sources, then reviewed by Ivan.
