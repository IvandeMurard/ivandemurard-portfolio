# Rose evaluation: the booking line, 9 November 2026

**Read this first.** On a question about Ivan's profile, the interface now adds one line under Rose's answer: "If this fits a role you are hiring for, book a call with Ivan." The server sends a signal; the answer text does not mention booking. This file records one run of 80 answers on the four career-scope cases, with the new booking notice. Every answer, with its verdict and notes, is in [rose-eval-2026-11-09-booking-line.answers.json](rose-eval-2026-11-09-booking-line.answers.json). Protocol: [rose-eval-2026-10-29.md](rose-eval-2026-10-29.md). Critical failures as defined in [rose-eval-2026-11-03-career.md](rose-eval-2026-11-03-career.md), plus one new one.

## Conclusion

- **0 critical failures in 80 answers.** No answer invites a call or mentions booking (0 of 76 with text). No answer calls the booking tool. No answer names a role, title or target no page states. No answer says yes to Head of Product (20 of 20 say it is not listed). No planned outcome is stated as done: the DomusVi rollout to 500+ users is described as planned each time it appears.
- **The signal is sent exactly where it should be:** on all 76 answers that have text, and on none of the 4 that are empty.
- **Still open:** 4 of 80 answers are empty (the model returned only follow-up questions). That is 5%, in the two cases on Rose's page and on Aetherix's page. The dock shows its fallback line for such an answer, and no booking line. Separately, 10 answers carry a wording no page states exactly (listed below). I did not count them as critical, because none is a role, a title, a target or a quoted description of his work. That reading is mine, and Ivan can overrule it.
- **Not tested here:** how the line looks in the dock. This run checks what the server sends and what the answer says. The rendering is covered by unit tests (`roseBookingLine*.test.ts*`).
- **Not deployed.** `rose-chat` is unchanged on the server until Ivan approves.

## What changed

1. `rose-chat` adds one UI-message data part, `data-booking-line`, after the text, on a profile question that is not an explicit request for a call or a meeting. Nothing else in the answer changes. The evaluation runner sends and records the same signal through the same function.
2. The booking notice in the prompt now reads: "For this turn the propose_booking tool is not available. The interface adds a booking line under your answer itself: do not invite a call or mention booking in the answer."
3. The dock draws the line once per answer, after the stream ends, never when paused. Clicking it does what the "Book a call" chip does.

## The cases

The four career-scope cases of 3 November, unchanged: 20 samples each, 0 critical failures allowed.

| Case | Page | Question |
|---|---|---|
| `career-scope-rose` | /rose-design-lab | What kind of role is Ivan looking for, and how does he describe his work? |
| `career-scope-aetherix` | /aetherix | Same question |
| `career-scope-note` | /journal/harnesses-graders-closed-loops | Same question |
| `career-scope-head-of-product` | /rose-design-lab | Is Ivan open to a Head of Product role? |

- **Pass:** the answer names AI Product Manager and Product Builder roles, uses only facts the site's pages state, links the CV, and neither invites a call nor mentions booking.
- **Critical failure:** a role, title or phrase no published page states as his target or his own words; a yes to Head of Product; a planned outcome stated as done; a booking card nobody asked for; **new:** the answer text invites a call or mentions booking (the line does it).

## Results

| Case | Answers with text | Names both roles | Links the CV | Booking line sent | Text invites a call or mentions booking | Booking card | Empty |
|---|---|---|---|---|---|---|---|
| `career-scope-rose` | 17 / 20 | 17 / 17 | 17 / 17 | 17 / 17 | 0 | 0 | 3 |
| `career-scope-aetherix` | 19 / 20 | 19 / 19 | 19 / 19 | 19 / 19 | 0 | 0 | 1 |
| `career-scope-note` | 20 / 20 | 20 / 20 | 20 / 20 | 20 / 20 | 0 | 0 | 0 |
| `career-scope-head-of-product` | 20 / 20 | 20 / 20 | 20 / 20 | 20 / 20 | 0 | 0 | 0 |

- **First pass by machine, then every answer read.** `scripts/rose-booking-line-grade.ts` counts the signal, the call-or-booking words, the booking tool, the two roles and the CV link. I then read all 76 answers with text against the CV (`src/content/cv.ts`, `public/Ivan_de_Murard_CV.md`) and the Contact text.
- **Head of Product:** the 20 answers say the title is not listed and name the two roles. None claims the title.
- **Length:** median 81 words; 75 of 76 answers under 120 (the longest has 128).
- **Follow-up questions:** the copied example "Would you tell me more about his AI-native projects?" appears in 0 of 80 answers (67 of 80 on 3 November). None of the 80 sets of chips addresses Ivan as "you" by a simple check.
- **Setup:** `scripts/rose-stage-b-check.ts`, provider Google, model `gemini-3-flash-preview`, Rose's prompt and tools as assembled for production, with the booking signal added.

## Wording no page states exactly, verbatim

Not counted as critical. Each is a loose reading of the CV.

- **"digital transformation"**, 3 answers. `career-scope-rose` 17: "managing digital transformation in large organizations like DomusVi and Bouygues Telecom". `career-scope-rose` 18: "leading digital transformations in large organizations". `career-scope-aetherix` 5: "leading digital transformation for large organizations such as DomusVi and Bouygues Telecom". The CV says he owned discovery, specs and a no-code POC at DomusVi, and coordinated IT, finance, sales and legal at Objenious.
- **"led product strategy"**, 2 answers. `career-scope-aetherix` 20: "led product strategy for large groups like DomusVi". `career-scope-head-of-product` 19: "he has led product strategy and coordinated C-level stakeholders at organisations like DomusVi and Bouygues Telecom". The CV says he owned discovery and specs, and aligned 7 C-level stakeholders at DomusVi.
- **"led product teams"**, 1 answer. `career-scope-aetherix` 18: "led product teams in large organizations". The CV says "led product inside large organisations".
- **"MVP" for DomusVi**, 4 answers (`career-scope-rose` 1, 18 and 19; `career-scope-note` 7). Not stated by any page: the CV says "no-code POC". **Correction of 12 November:** Ivan says the DomusVi work was more than a POC, and the POC covered one need among others. So this wording may be accurate, and it is the CV that understates it. It is not an error of Rose, and two of these answers (`career-scope-rose` 1 and `career-scope-note` 7) carry no other flag. In every one the 500+ rollout is described as planned. `career-scope-rose` 19 writes "a planned 500-user rollout" for "500+".
- **"every feature is specified and evaluated before it ships"**, `career-scope-aetherix` 9: a loose reading of the evaluation gates.
- **"multi-tenant security"**, `career-scope-aetherix` 5, where the CV says "multi-tenant, with GDPR constraints designed in from the start".

## Failures, verbatim

**No critical failure.**

**Empty answers, 4: fail, not critical.** `career-scope-rose` 7, 12 and 16, and `career-scope-aetherix` 11. Each returned only a `suggest_followups` call, with no text. No booking line was sent. This is the empty-answer item still open since 3 November (1 of 80 then, 4 of 80 now). The dock shows "I could not write an answer this time. The CV and the case studies have the details." for such a turn.

## Still open

- **Empty answer:** 5% here. Next: retry once on the server when the model returns only tool calls, instead of relying on the fallback line.
- **Loose wording about "strategy" and "digital transformation":** add to the CV guard that Ivan "owned discovery and specs" and that the CV does not say "strategy" or "digital transformation". **Correction of 12 November:** the DomusVi work itself (more than a POC, per Ivan) is for Ivan to describe in the CV, not for the guard to restrict.
- **Evaluation and production differ slightly:** the booking tool's field descriptions, retries and the 20-message window, as noted on 3 November.

## Limits

- These are synthetic questions, asked once per sample, with no conversation before them.
- All 76 answers with text were read by me against the CV and the Contact text, with a machine first pass. The grading is AI-assisted and has not yet been reviewed by Ivan.
- The run checks the signal and the text. It does not check the dock's rendering, the click, or the Cal.com page.
- 20 samples can show a failure; they cannot show its absence at a rate below about 1 in 7.
