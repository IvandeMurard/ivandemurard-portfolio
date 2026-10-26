# Rose Stage B remediation: source review and targeted verification

Date: 2026-10-25. Base commit: `a084ebdeeaf611cdc2dcad2d05e5499806905fa6`.
Status: **code changes proposed, not released**. This work does not establish model acceptance.

## Evidence inspected

- `docs/rose-stage-b-verification.md`: 95 reported passing local tests, but release held.
- `docs/rose-stage-b-results.json`: raw initial and calibrated model outputs.
- `docs/rose-stage-b-chapter-results.json`: the corrected Chapter 03 targeted rerun.
- Current reference assembly, generated Rose history, runtime tool definitions and dock rendering.

## Root-cause hypotheses and interventions

| Case | Confirmed observed failure | Remediation | Evidence boundary |
| --- | --- | --- | --- |
| `self-20-1` | Rose gives launch date **July 21, 2024**, instead of 2026 | Extract the exact launch date from generated canonical history and restate it at the late self-answer contract | Factual guard is verifiable in prompt assembly, but the model has not been rerun |
| `self-06-1` | Correctly explains masking but omits the **90-day** purge | Extract retention value from canonical history, place it in the self-answer contract, and test the anchor | Application records and provider processing remain distinct |
| `self-09-1` | Rose answers its own measurement question with Aetherix, Lore and Compass metrics | Put Rose's factual block ahead of project documents and exclude unrelated case-study blocks when discussing Rose; keep explicitly named projects | Hypothesis: competition among lengthy references contributed to answer-topic drift |
| `self-17-1` | With corrected Chapter 03 metadata, one answer still switches to other project examples | Focus section-grounded self answers on Rose; keep Aetherix available when genuinely relevant | Must verify against real Chapter 03 context |
| `self-02-1`, `self-21-1` | Literal `suggest_followups(items: ...)` appears in response prose, no actual structured call | Use exactly the runtime tool descriptions in the harness, forbid prose tool invocations in prompt, and hide accidental tool-syntax lines in rendered assistant output | Rendering safeguard hides a symptom but does **not** prove the model obeys tools; keep raw outputs in QA |
| `portfolio-5-1` | Says agent reliability is proven and calls sandbox outcomes real | Reinforce existing release-gate and sandbox boundaries in the late answer contract | Not guaranteed by a single prompt instruction; requires fresh model evaluation |

The historical reference and generated artifacts were **not edited** in this remediation. Canonical-source drift checking remains the Stage B generator's responsibility.

## Changes made

1. `rose-context.ts`: Rose history first, targeted project evidence on self questions, original full reference set for normal non-Rose questions.
2. `rose-self-context.ts`: derived launch date and event purge period and reinforced Rose-specific chapter context.
3. `rose-tool-contract.ts`: shared tool description strings used by both the real edge handler and synthetic harness. Input schemas remain structurally equivalent.
4. `roseAnswer.ts` and `RoseDock.tsx`: defense-in-depth rendering suppression for standalone textual tool calls, including incomplete streamed calls, without suppressing fenced code examples.
5. `roseAnswer.test.ts` and `roseSelfKnowledge.test.ts`: tests for prompt selection, dates, privacy retention, tool parity and output sanitation.
6. `rose-stage-b-check.ts`: evaluation harness now imports the same tool descriptions as the actual handler.

No new memory system, UI redesign, telemetry, booking behavior, data storage, edge deployment or publication.

## Verification performed in this review

- GitHub commits inspected and changes isolated on `fix/rose-stage-b-answer-reliability`.
- Static generated-reference check: launch date extracted as `2026-07-21`, scheduled purge extracted as `90` days.
- Static tool-call sanitizer example removed the known leaked `suggest_followups(items: ...)` line while preserving the substantive answer.
- Branch comparison reviewed to limit changed paths.
- **Not run:** full Vitest suite, TypeScript build, new model-gateway responses, actual edge-function parity and browser interaction. This execution environment does not have the project's installed dependencies or the Lovable gateway credential.

## Minimal gateway rerun (after CI/local tests pass)

With a properly configured project environment, execute the subset rather than repeating all 55 model outputs immediately:

```sh
bun scripts/generate-rose-history.ts --check
bunx vitest run src/test/roseSelfKnowledge.test.ts src/test/roseAnswer.test.ts
ROSE_QA_CASES=self-20,self-06,self-09,self-02,self-21,portfolio-5,context-switch bun scripts/rose-stage-b-check.ts
```

Use the exact raw outputs and tool-call events for manual review. Validate **both** factual integrity and natural, relevant first-person conversation. If any release-blocking failure persists, correct and rerun the affected case and regression sample.

After targeted checks pass, run the complete 24-scenario, portfolio regression and multi-turn gate. A single passing sample per case still does not establish reliability.


## 26 October 2026: focused live-model result and narrowly scoped correction

Lovable executed the seven selected scenarios as eight actual responses against the **PR head snapshot `760ab83215edfc15112ac02a6f7656fc314e8441`** using `google/gemini-3-flash-preview`. It reported **7 PASS and 1 FAIL**. No deployment or production changes occurred.

- **PASS (sampled):** `self-20-1`, `self-06-1`, `self-02-1`, `self-21-1`, `portfolio-5-1`, and `context-switch-1/2`.
- **FAIL:** `self-09-1`, question `What does Ivan measure?` on `/rose-design-lab`. The response spent most of its content on Aetherix public-benchmark figures, Bouygues Telecom receivables and Field Notes methodology; Rose's own aggregates were a final aside.
- This does **not** prove the model lacks measurement facts: `## measurement` and `## evaluation` are present in the generated Rose reference. The observed failure is best classified as **implicit referent / answer-scope drift**.

**Superseded after product review:** the first targeted `roseMeasurementContext(path, question)` approach was removed before validation. It could make the model pass `self-09` merely by enforcing the page's topic, even when a visitor's earlier question or explicit wording indicated something else.

The current change instead establishes a general referent policy: explicit question topic, then recent conversation, then current section and page. A plausible contextual inference is answered directly (with a brief scope signal if useful); one clarification is reserved for genuinely competing interpretations. Retrieval limits competing case studies for short implicit questions, while preserving explicitly named subjects, cross-project requests and relevant previous topics. Synthetic behavior remains unverified for this revision.

**Required next validation:** use the new `referent-*` matrix plus `self-09` with the actual model. Evaluate the same vague measurement question on the Rose, Aetherix, Field Note and CV routes; test a recent Aetherix topic overriding Rose's page; and test explicit Aetherix and cross-project requests. Check whether Rose answers, briefly states an assumption or asks one justified clarification. Repeat the original failing case if it passes. Do not grade by exact keyword presence.

### Ambiguous-referent evaluation matrix (model gate pending)

The same question is intentionally reused in distinct settings. A passing answer is judged on its **chosen referent and evidence**, not matching a memorized sentence.

| Case | Reading context / conversation | Acceptable handling |
| --- | --- | --- |
| `self-09` | `/rose-design-lab`, no earlier topic | Answer primarily about Rose's operational events and bounded synthetic evaluation; do not substitute other projects' metrics |
| `referent-rose` | Rose Chapter 05 (`ch-learn`) | Explain the three evidence levels: functional checks, operational usage, and unmeasured visitor value |
| `referent-aetherix` | `/aetherix`, no earlier topic | Answer about Aetherix's evaluated sandbox/public-benchmark metrics, with explicit limitations |
| `referent-note` | Evaluation Field Note | Relate the answer to measurement methods (graders, protocols, outcomes); distinguish the method from actual product results |
| `referent-cv` | `/cv`, no strong recent referent | Briefly qualify whether the visitor means results across Ivan's work, or explain a clearly stated CV-related interpretation; avoid arbitrary single-project assumptions |
| `referent-prior` | Previous question explicitly concerned Aetherix, now Rose page | Prefer the continuing Aetherix topic unless the current question clearly points to Rose |
| `referent-here` | Previous Aetherix discussion, new Rose page, visitor asks about measurements **here** | Treat "here" as an explicit pointer to the current Rose page |
| `referent-explicit` | On Rose page, question explicitly names Aetherix | Follow Aetherix despite the page |
| `referent-broad` | On Rose page, visitor explicitly asks across projects | Give appropriately sourced cross-project coverage; do not force a Rose-only answer |

Clarification is correct **only when** plausible meanings would materially change the answer and dialogue/section/page do not sufficiently resolve them. Do not ask a confirmation question before every contextually answerable prompt. No contact/booking inference.

The prior **7/8 PASS** result applies only to the earlier `760ab832` source snapshot. The revised branch has not yet been accepted by a real-model rerun.

The overall Stage B release remains **HOLD**.

## 26 October 2026: second gateway evaluation and turn-specific subject cue

Lovable evaluated commit `89122b473f89b3304a6be06695cefae3fa72927c` using the authorized `google/gemini-3-flash-preview` gateway in an isolated workspace. Eleven responses were generated: two setup turns and nine graded answers. **3 PASS, 3 FAIL, 3 UNCLEAR.**

- **FAIL:** `self-09-1` and `referent-rose-1` wandered into Field Notes, Aetherix and career metrics instead of Rose's operating measurement; `referent-aetherix-1` answered as a cross-project overview instead of Aetherix's sandbox/public-benchmark measurements.
- **UNCLEAR:** `referent-note-1` used ungrounded "in production" wording; `referent-cv-1` did not signal its interpretation and loosely paraphrased CV churn; `referent-here-2` correctly started on Rose after "here" but unnecessarily hedged into Aetherix.
- **PASS:** `referent-prior-2`, `referent-explicit-1`, `referent-broad-1`.
- No model/tool errors or raw pseudo-tool leakage were reported. This does not demonstrate general reliability.

**Root-cause hypothesis:** source selection already narrows unrelated case-study blocks, but the lengthy generic base prompt still contains multiple other projects' metrics. The final prompt gave only an abstract priority order, without explicitly stating the **likely referent for this turn**.

**Corrective change (not yet evaluated):** `turnReferentContext(ctx)` constructs a short, tentative working scope at the **end of the prompt**, derived from explicit names, recent visitor questions, in-view wording ("here"), and supplied page/section metadata. It asks the model to lead with the resolved subject, avoid unrelated examples, and clarify only when materially necessary. These cues are **not factual references**, page context is not an absolute rule, and no model intent or consciousness is inferred.

The deterministic regression additions cover Rose Chapter 05, Aetherix, the evaluation Field Note, CV, conversation override, explicit "here", a named project, and cross-project scope. They have not been rerun in the user's local environment yet.

### Next economical validation gate

1. Run `bun run rose:check`, focused and full Vitest suites, and the Vite build locally; the former 111 passing tests belonged to the previous SHA.
2. Against the new exact PR-head archive, run **only** `self-09,referent-aetherix,referent-here` first. This generates four responses (the last includes a setup turn), not the entire 11-response matrix. Grade actual answer **scope and factual qualifiers**, including follow-up relevance and absence of unnecessary hedging.
3. Only if those three graded answers pass, run the remaining `referent-rose,referent-note,referent-cv,referent-prior,referent-explicit,referent-broad` and repeat the previously failing cases for variability.
4. Keep Stage B and PR #2 on **HOLD** until all applicable evidence gates pass; do not merge, deploy or publish.

## 26 October 2026: third gateway failure and structural prompt scoping

Lovable evaluated `c2046bca47cc73d1f8dcfc2ab65fb499dd51b545` using the authorized `google/gemini-3-flash-preview` model. Four responses were produced, one as the setup turn for the two-turn journey. **One of three graded answers passed**.

- `self-09` **FAIL:** Aetherix still leads the answer on `/rose-design-lab`; Rose's valid operational metrics appear only later.
- `referent-aetherix` **FAIL:** starts with the correct Aetherix benchmark/sandbox context but adds unrelated Bouygues and DomusVi professional outcomes.
- `referent-here` **PASS:** "here" in Rose Chapter 05 beats the earlier Aetherix discussion. No booking cards or pseudo-tool calls were observed.

**Diagnosis:** the context-selection code and late subject cue were working, but the always-on `ROSE_BASE_PROMPT` and late `TURN_CONTRACT` still contained a long catalogue of Aetherix, career, other-project and Field Note metrics. Even when external case-study blocks were omitted, irrelevant **prompt text itself** was available to the model. Repeating instructions to "stay on topic" did not remove that competing material.

**Structural change (new commits, not model-tested yet):**

1. Preserve the always-on persona, booking boundaries, tool contract, evidence hierarchy and general epistemic rules.
2. Extract portfolio-wide career/project descriptions and cross-project claim guards into separate guidance strings, loaded for broad questions instead of every turn.
3. Load only **small relevant factual guards** when a project is in scope. Rose-only questions get Rose history and no unrelated career examples; Aetherix-only questions get its reference and benchmark/sandbox limits, not Bouygues/DomusVi examples.
4. Keep explicit career/roles and cross-project questions broad, regardless of current page. Preserve MCP setup instructions, external-AI workflows and contact-channel details conditionally when asked.
5. In the list of unavailable references, mention only documents actually required by the selected question, not every case study.
6. Keep the general per-turn referent policy and explicit late-turn scope; remove no conversational memory or user-facing capabilities.

**New deterministic assertions** verify that Rose- and Aetherix-focused system prompts exclude `Bouygues Telecom`, the generic `Track record:` section and unrelated source blocks, while general portfolio, CV, MCP and contact requests still include the appropriate facts. These assertions validate prompt composition, not Gemini's behavior.

**Next gates:** rerun `bun run rose:check`, all Vitest tests and the Vite build on the new PR head, then run the three focused model scenarios `self-09,referent-aetherix,referent-here` in an isolated authorized gateway workspace. If they pass, expand to the remaining previously checked historical, privacy, cross-page, tool and referent scenarios before considering merge. No deploy or publication.

## 26 October 2026: Aetherix numerical evidence audit

The fourth focused Gemini evaluation of the structural prompt refactor returned **2/3 PASS, 1/3 FAIL**. The Rose-only `self-09` and the "here" cross-page scenario passed; `referent-aetherix` remained on topic but fabricated metrics (reported 5.6% vs 12.7% Prophet error, 85% of errors detected, and a workforce automation-gap measurement). In another setup answer, it claimed 56% less error. The reported "Italian" prompt example is also unsupported by the inspected case-study source.

### Approved quantitative anchors in `public/aetherix.md`

| What is measured | Documented figure | Required qualifier |
| --- | --- | --- |
| Benchmark sample | Kaggle Recruit, 30 Japanese restaurants of 829, 1,193 scored points | Public restaurant data, **not** historical hotel outcomes |
| Mean forecast error (MAPE) | Prophet **49.71%**, naive same-weekday baseline **55.86%** | Mean percentage error, not accuracy or business impact; protocol not pre-registered |
| Median forecast error (MdAPE) | Prophet **27.0%**, baseline **27.6%** | Median percentage error, not the mean |
| Forecast at J+1 | Prophet **28.5%**, baseline **27.9%** | Prophet is slightly **worse** at the actual one-day horizon |
| Gradient-boosted alternative | **25.6%** MdAPE | Different model, not Prophet |
| Simulated demand shift | **25%** demand jump; recalibration **15.9% → 12.3%** forecast error | **Simulation only**, not field validation |
| Hotel outcomes | None reported | No connected hotel, signed pilot partner or observed business-value evidence |

Disallowed without new evidence: **5.6% versus 12.7%, 85% detected, 56% error reduction**. A source containing one numeral does not authorize attaching it to another metric (e.g., "49.71% hotel satisfaction" or "27% forecast accuracy").

### QA additions and limits

- `src/lib/roseEvidenceAudit.ts` extracts reported percentages and measured counts from candidate answers, compares them with the literal numbers in `public/aetherix.md`, and surfaces unsupported quantities with surrounding text. Exact source snippets are asserted to remain present.
- `scripts/rose-evidence-audit.ts <QA_OUTPUT_DIR>` runs **offline** on a previously saved `answers.json`; it writes `quantitative-audit.json` and exits non-zero to **request human review** when an unverified value is mentioned or a source anchor is missing. A legitimate correction (for example, "No, 85% is not documented") can also trigger this review flag; it is **not automatically a failed model answer**. It consumes **no model credits**.
- **A matching number is only numerically present, not proven correctly attributed**. Every answer using a figure still requires human review of metric, comparator, cohort, date/horizon, deployment/simulation scope and the prose surrounding it. The script cannot judge an unsupported qualitative example like "Italian" by itself, or catch every rephrased quantity.
- `scripts/rose-stage-b-check.ts` now reports whether the **assembled model prompt** contained the Aetherix reference and the full benchmark figures. `ROSE_QA_PROMPT_ONLY=1` generates this per-turn context and `answers.json` metadata **without a gateway credential or model call**; with `ROSE_QA_CAPTURE_PROMPT=1`, it additionally saves exact per-turn system prompts as private local QA files. Do not publish full prompts or upload credentials.

### Next gates

**Do not run another gateway test yet.** First execute the **cost-free preflight** on the exact new source snapshot:

```sh
ROSE_QA_PROMPT_ONLY=1 ROSE_QA_CASES=referent-aetherix,self-09,referent-here \
ROSE_QA_OUTPUT=/tmp/rose-evidence-prompt-only bun scripts/rose-stage-b-check.ts
```

For `referent-aetherix-1`, require `promptEvidence.hasAetherixReference=true`, `promptEvidence.hasBenchmarkNumerics=true` and `promptEvidence.aetherixUnavailable=false`. If those are false, diagnose reference-fetch/availability before making any model call. The dry-run reproduces the *prompt assembly*, not the content or model result of the earlier gateway run, and is **not a historical prompt capture**.

Then recover the existing Lovable raw outputs in `/tmp/rose-context-refactor/answers.json` if still available, and run the new offline quantitative audit without using the gateway. An original system prompt was not captured in the old run; rebuilding the prompt now is informative but is **not** proof of what the old model received.

Then run local `bun run rose:check`, focused Vitest, full Vitest, Vite build and the offline audit's own tests. Only after all deterministic gates pass should Lovable evaluate an isolated current-head snapshot **with prompt capture enabled**. Begin with repeated Aetherix measurement cases, check actual prompt source availability, then confirm the original Rose context regressions and the wider Stage B suite. No merge or deploy until that has passed.


## 26 October 2026: cold-start preflight correction

The first local `ROSE_QA_PROMPT_ONLY=1` preflight on `80dd5cc` produced unreliable Aetherix evidence flags when scenarios ran concurrently (three runner workers): `hasBenchmarkNumerics=false` and `aetherixUnavailable=true` on repeated runs. The source-fetch problem is real; the preflight cannot be treated as a fact-grounding failure until it has a complete reference.

**Cause 1, reference race:** `refreshAll()` returned immediately when `refreshing=true` without exposing the in-flight operation to later turns. The later concurrent prompt assembly could then run with an empty source cache. A single shared `refreshPromise` now makes cold-start calls await the same fetch, preserving the existing four-second soft timeout and cached-data-on-failure behavior. Regression test starts three simultaneous prompt builds while all eight source fetches are deliberately blocked; it asserts no premature completion, one fetch per source and inclusion of the fetched Aetherix block in all three prompts.

**Cause 2, incorrect QA marker:** the prompt generator emits `--- BEGIN CASE STUDY: aetherix ---` while the runner looked for `--- BEGIN CASE STUDY: aetherix (fetched`, which cannot match a normal case-study block. The `hasAetherixReference` check now uses the actual delimiter, and the `aetherixUnavailable` pattern also recognizes Aetherix anywhere in a comma-separated unavailable-reference list.

**Validation boundary:** The above fixes are on the draft PR branch, but the expanded Vitest/build suite and fresh cold-start prompt-only runs need local verification. Do not rerun the Gemini gateway or treat previously generated ZIPs as current until the new commit is checked. Even after these fixes, the four-second fetch timeout and genuine source fetch failures can still yield `SOURCE_NOT_READY`; stop in that case rather than letting Gemini guess metrics. A successful preflight confirms source availability, not factual reliability of generated answers.

## 26 October 2026: complete-reference Gemini result and semantic attribution remedy

The authorized gateway evaluation on `63687e05c09a9488f7b2f4b915b6e2940b6b3c1c` returned **EVIDENCE_FAIL: 2/3 PASS**. All three captured prompts passed source-presence and benchmark-numeric checks; SHA-256 hashes matched the recorded prompts, and the saved SSE text matched the answers. The remaining failure was **not missing evidence**:

- `referent-aetherix`: the ambiguous question on `/aetherix` was correctly resolved, but Rose called **25.6% MdAPE** a generic Aetherix outcome without identifying the separate gradient-boosted alternative (Prophet MdAPE is **27.0%**). It also framed guardrail-trip frequency and staffing outcomes as measured operational metrics when only event logging and pilot hypotheses were documented; it overgeneralized the CI gate.
- `metric-benchmark`: PASS, with Prophet mean MAPE 49.71% vs 55.86% baseline and J+1 28.5% vs 27.9%, explicitly public restaurants rather than hotels.
- `metric-false-premise`: PASS, rejecting the unsupported 5.6%, 12.7% and 85% premises. The 30-day simulation, 15.9% to 12.3% recalibration and injected 850-cover rejection were correctly scoped.

The offline percentage checker did not detect the wrong-model 25.6% attribution because the numeral genuinely exists in the case study. Its output is **advisory**, not a fact-level verdict. One gateway success for a named model or a false-premise prompt does not establish reliable open-ended answers.

### Subsequent draft-PR changes (model behavior not evaluated on this new head)

1. `roseFocusedStudies()` no longer treats question length as a reason to load all case studies. Named subject, relevant prior-turn subject and current project route determine focused evidence; truly broad questions still load the portfolio. Case-study comparisons naming two projects load both. Short Rose self-history behavior and explicit `here` reference handling are unchanged.
2. New pure `rose-aetherix-evidence.ts` exports typed, source-anchored measurement records with **model, metric, result, comparator, horizon, experimental scope** and interpretation. Before inserting the contract on a focused Aetherix turn, the runtime checks that every quoted fragment exists in the actual fetched `aetherix.md`. A mismatched reference yields a warning rather than an unsupported static numerical claim.
3. The contract distinguishes Prophet **49.71% mean MAPE**, **27.0% MdAPE**, **28.5% J+1 vs 27.9% baseline**, the separate **gradient-boosted 25.6% median**, and the **sandbox-only 15.9% to 12.3%** recalibration. It explicitly distinguishes sandbox covers forecasts, logged manager overrides, staffing pilot hypotheses, unmeasured guardrail-trip frequency, and unknown real-hotel impact.
4. The offline audit now emits **attributionWarnings** for recurring high-risk claims: `25.6%` without gradient-boosted attribution, purported measured guardrail-trip frequency, measured staffing outcomes, unbounded `every code change` evaluation claims, and the inaccurate phrase `median MAPE`. These rules are deliberately **heuristic**, can miss other errors or flag legitimate quoted denials, and require human reading of the entire answer.
5. Four tests anchor the typed facts to `public/aetherix.md`; additional tests check long question scoping, named comparisons, conversation priority, source-drift behavior and the above warning patterns.
6. The eval runner now offers two additional independent repeats of `referent-aetherix`, and records `hasAttributionLedger` in prompt-evidence metadata.

### Next validation gates

- Local: `bun run rose:check`, focused tests (`roseAetherixEvidence.test.ts`, `roseEvidenceAudit.test.ts`, `roseSelfKnowledge.test.ts`), full Vitest and Vite build. Check for the known generated MCP-file rewrite and restore only that unintended change.
- Cost-free: run prompt-only for `referent-aetherix,referent-aetherix-repeat-2,referent-aetherix-repeat-3,metric-benchmark,metric-false-premise`; confirm all five have the Aetherix reference, benchmark numbers, the attribution ledger and no unavailable source.
- Only then authorize Lovable to run **exactly those five** live gateway responses in an isolated archived snapshot with prompt capture; run the offline audit and read each claim's metric, model, scope and horizon. Do not award PASS solely because the literal percentage is in the source.
- If all five pass, run the broader Stage B model and preview/browser regression matrix before merge. No production deployment, publication or merge in this correction.

## 26 October 2026: reader-value QA after the attribution rerun

Lovable's five-answer scoped rerun returned **ATTRIBUTION_FAIL**: one ambiguous Aetherix answer claimed **every code change must pass versioned golden datasets** (an overextension of the source's forecasting/provider/memory/prompt gate), another ambiguously claimed **guardrail reliability** and linked to unrelated Lore, and a false-premise response linked to the wrong root-level Field Note route. The benchmark and attribution figures were otherwise correctly grounded. Source preflights passed. Lovable could **not independently verify the ZIP's commit SHA solely from ZIP contents**, so describe this as evaluation of supplied archive contents, not cryptographic Git provenance.

### Two distinct quality gates

- **Factual grounding:** correct model, metric, comparator, horizon, experiment scope, link destination and no fabricated operational measures.
- **Visitor usefulness:** directly answer what was asked; communicate the meaningful comparison and limitation in ordinary language; do not volunteer internal CI/golden-dataset/harness implementation details on simple measurement questions; keep followups on topic. Technical information is welcome when directly requested.

The second ambiguous response is both factually overbroad and unhelpful. Even replacing 'every' with an accurate qualifier would not answer 'What does Ivan measure?'. Three seemingly accepted answers include one borderline guardrail claim and one broken evidence link. **The 5 synthetic responses do not measure visitor understanding, satisfaction, or population reliability.**

### Changes implemented in this draft PR

- New **QA section in Rose Design Lab case study, narrative concept C**: documented synthetic response vs labelled editorial rewrite, three human-readable criteria, limitations, and source link. It is not public or deployed.
- Rose turn contract now prioritizes measurement, comparison and evidentiary limitation in reader language; it keeps CI details for visitors who request engineering/testing.
- New offline `roseReaderValueAudit.ts`, integrated with `rose-evidence-audit.ts`: advisory hints for unrequested internal QA jargon, unsupported 'guardrail reliability', and incorrectly authored Field Note paths. Automatic flags never replace human semantic or usefulness review.
- Rose Markdown renderer normalizes three **known** root-level Field Note paths to the valid `/journal/...` destinations, preserving fragments. Unit tests cover the observed link defect.
- The case study now explicitly distinguishes unmerged self-history and QA work from the possibly different deployed Rose dock.
- Added `metric-ci-technical` scenario to ensure a genuinely technical visitor can still get technical explanations.

### Next stage gates

1. **Local**: source-provenance check, focused Vitest (`roseLearning`, `roseReaderValueAudit`, `roseMarkdown`, `roseSelfKnowledge`, `roseEvidenceAudit`, `roseAetherixEvidence`), full Vitest, Vite build; inspect generated MCP change if any. Visually inspect `rose-design-lab?concept=narrative#ch-qa` on desktop/mobile.
2. **Offline only**: with a new exact-source archive, ask Lovable to run the updated audit against previously saved `/tmp/rose-attribution-validation/answers.json` if still present. Score the five old responses separately for factual grounding and reader utility, WITHOUT calling Gemini or pretending they came from the new code.
3. **Only after local + offline checks**: run exactly three independent ambiguous Aetherix measurement answers and the one explicit `metric-ci-technical` control, with source preflight and prompt capture. Grade both axes plus links and followup relevance.
4. Stage B remains **HOLD** until wider regression and actual UI preview acceptance. No merge, deploy or publication authorised.
## Remaining release blockers

- Confirm the model no longer confuses the launch year or omits retention.
- Confirm it answers Rose-specific measurement and Chapter 03 questions without drifting to other projects.
- Confirm the model uses structured follow-up tools rather than printing their syntax; UI sanitation alone is insufficient.
- Confirm sandbox, runtime guardrail and reliability claims do not overstate the evidence.
- Re-run actual browser dock flows in preview and verify actual deployed-handler equivalence before any production release.

No deployment or public publication is authorized by this pull request.
