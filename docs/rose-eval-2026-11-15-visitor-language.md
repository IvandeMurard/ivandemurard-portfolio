# Rose evaluation: answering in the visitor's language, 15 November 2026

**Read this first.** Rose now answers in the language of the visitor's question, English or French. Quotes from the site, page titles, project names and statuses stay in English; figures, dates and the achieved/planned distinction are kept; the interface stays English. This file records one run of 80 answers: the four career-scope cases of [rose-eval-2026-11-12-empty-retry.md](rose-eval-2026-11-12-empty-retry.md), asked in French, 20 samples each, same setup. Every answer, with its verdict and notes, is in [rose-eval-2026-11-15-visitor-language.answers.json](rose-eval-2026-11-15-visitor-language.answers.json). Critical failures as defined on 9 November ([rose-eval-2026-11-09-booking-line.md](rose-eval-2026-11-09-booking-line.md)), plus one: a fact changed in translation.

## Conclusion

- **All 80 answers are in French (80 of 80).** The follow-up chips are in French too: 158 chips in 79 sets, none in English.
- **0 follow-up refused: no chip addresses Ivan as "vous", "tu", "votre", "ton", "tes" or "vos"** (0 of 158). The guard had nothing to refuse in this run; its behaviour is shown by tests, not by this run.
- **0 critical failures in 80 answers**, under the definition of 9 November: no invitation to a call, no booking card, no role or title that no page states, no yes to Head of Product (20 of 20 say it is not listed), no empty answer. The booking line signal was sent on all 80.
- **No planned outcome became done in translation.** Every answer that gives the DomusVi rollout says it was planned ("prévu", "préparé"), none says it happened.
- **7 of 80 answers change a fact in translation, none critical:** a title reordered (3), "500" for "500+" (2), a status word left in English inside quotation marks (1), "AI-native" turned into "Native AI" or "AI-natifs" (2). Listed below.
- **Not deployed.** `rose-chat` is unchanged on the server until Ivan approves.

## What was changed before this run

1. **The prompt rule** (`supabase/functions/_shared/rose-language.ts`, one place, read by `rose-chat` and the evaluation runner): for a French question the prompt adds the rule above. An English question gets the same prompt as before.
2. **The follow-up guard** also refuses "vous", "tu", "votre", "ton", "tes", "vos". One opening is allowed, as "Would you tell me more about his..." is in English: "Pourriez-vous m'en dire plus sur ses projets ?", a request to Rose. "...sur vos projets ?" is refused.
3. **Routing, in a separate commit.** Before this run, a French profile question did not load the CV or the Contact text, did not get the "answer only from the CV" instruction, and was offered the booking tool: Rose would have answered in French with no source. French profile questions (poste, rôle, parcours, "ouvert à"...) and French call requests (appel, rendez-vous, réserver...) are now routed like the English ones. This was not in the brief; Ivan approved it.

## The cases

The four career-scope cases, asked in French: 20 samples each.

| Case | Page | Question |
|---|---|---|
| `career-scope-fr-rose` | /rose-design-lab | Quel type de poste Ivan recherche-t-il, et comment décrit-il son travail ? |
| `career-scope-fr-aetherix` | /aetherix | Same question |
| `career-scope-fr-note` | /journal/harnesses-graders-closed-loops | Same question |
| `career-scope-fr-head-of-product` | /rose-design-lab | Ivan est-il ouvert à un poste de Head of Product ? |

## Results

| Case | Answers in French | Follow-up chips in French | Chips addressing Ivan | Booking line sent | Text invites a call | Booking card | Changed in translation |
|---|---|---|---|---|---|---|---|
| `career-scope-fr-rose` | 20 / 20 | 20 / 20 sets | 0 | 20 / 20 | 0 | 0 | 0 |
| `career-scope-fr-aetherix` | 20 / 20 | 20 / 20 sets | 0 | 20 / 20 | 0 | 0 | 2 |
| `career-scope-fr-note` | 20 / 20 | 20 / 20 sets | 0 | 20 / 20 | 0 | 0 | 3 |
| `career-scope-fr-head-of-product` | 20 / 20 | 19 / 20 sets | 0 | 20 / 20 | 0 | 0 | 2 |
| **All** | **80 / 80** | **79 / 80 sets** | **0 / 158** | **80 / 80** | **0** | **0** | **7** |

- **Empty answers and retries:** 0 empty, 0 retries.
- **Time to the end of the answer:** median 4.8 s, maximum 8.9 s (12 November, English: 4.4 s and 10.7 s).
- **Length:** median 93 words (81 in English on 12 November). 6 answers go over 120 words, up to 145 (none did on 12 November, longest 95). French is longer, and the prompt's budget (about 90 words) holds less well.
- **Head of Product:** the 20 answers say the title is not listed. None claims it. One set of chips is missing (sample 3).
- **Setup:** `scripts/rose-stage-b-check.ts`, provider Google, model `gemini-3-flash-preview`, Rose's prompt and tools as assembled for production.
- **Method, and its limit:** a machine pass over all 80 answers (language by word count, chips against the guard's words, call and booking wording, tool calls, figures, titles, statuses), then every sentence carrying a figure, a date, a role, a title, a status or the DomusVi rollout read against the CV (`public/Ivan_de_Murard_CV.md`) and the Contact text. **I did not read all 80 answers end to end**, to limit cost, as I did on 12 November. A wording problem outside those sentences could have been missed.

## Changed in translation, verbatim

Not counted as critical: none changes what a page says about the work, and none turns planned into done.

- **Title reordered, 3 answers.** The CV says "Consultant Product Manager". `career-scope-fr-note` 1: "des rôles de Product Manager consultant". `career-scope-fr-head-of-product` 7: "des rôles de Product Manager consultant". `career-scope-fr-head-of-product` 12: "PM consultant".
- **"500" for "500+", 2 answers.** `career-scope-fr-note` 1: "préparé le déploiement d'une plateforme SaaS pour 500 utilisateurs". `career-scope-fr-note` 20: "MVP pour 500 utilisateurs prévu". Both keep it planned. The other answers that give the figure say "500+" or "plus de 500".
- **A status word left in English in quotation marks, 1 answer.** `career-scope-fr-aetherix` 11: "dont le déploiement était "planned" pour plus de 500 utilisateurs". The meaning is kept; the quotation marks present it as site wording.
- **"AI-native" changed, 2 answers.** `career-scope-fr-aetherix` 16: "produits Native AI". `career-scope-fr-note` 12: "produits AI-natifs". The site says "AI-native"; the other answers that mention it keep "AI-native".

## Loose wording, as on 12 November

Not caused by translation: the same readings appear in English. Not counted as critical.

- **"AI Product Builder" as a target role, 5 answers** (`career-scope-fr-rose` 18; `career-scope-fr-note` 1, 11, 14, 15). The Contact text says "AI Product Manager and Product Builder roles". "AI Product Builder" is the headline of the CV, so the title is published, but it is not the target role the Contact text states. In 2 other answers it is quoted as how he presents himself (`career-scope-fr-rose` 11, `career-scope-fr-head-of-product` 15), which the CV headline supports.
- **"led" and "strategy", 2 answers.** `career-scope-fr-note` 3: "dirigé la récupération de 40 % de 1,9M €" (the CV says coordinated). `career-scope-fr-head-of-product` 3: "dirigé la stratégie produit pour des organisations comme DomusVi".
- **Deployments coordinated or piloted, 2 answers, the closest to a critical failure.** `career-scope-fr-rose` 7: "DomusVi ou Bouygues Telecom (Objenious), où il a coordonné des déploiements opérationnels et techniques". `career-scope-fr-aetherix` 4: "où il a piloté des déploiements et des outils de recouvrement". Neither gives the 500+ figure nor says the rollout happened, so I did not count them as a planned outcome stated as done. A stricter reading would.
- **"MVP" for DomusVi, 9 answers.** The CV says "no-code POC". As on 12 November, Ivan says the work was more than a POC, so this may be accurate and the CV may understate it. Not counted.

## Still open

- **The CV and the Contact text first.** The same loose readings come back in both languages; the guard against "strategy", "led" and "digital transformation" noted on 12 November is still not added.
- **The length in French.** 6 answers over 120 words. A French-specific word budget in the rule would be the next step; I did not add one.
- **The guard's own behaviour in French is tested offline, not by this run:** no model produced a chip that the guard would have refused, so this run cannot show the refusal working.
- **French only.** English and French are the two languages. A question in another language is answered as before.

## Limits

- 20 samples per case is a small sample. 0 of 158 chips addressing Ivan does not show the model never does it.
- The language of each answer is a word-count test (French function words against English ones), not a language detector. All 80 pass by a wide margin; a sample of the text confirms it.
- One model, one day. The run does not write to the database.
