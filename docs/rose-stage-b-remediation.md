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

## Remaining release blockers

- Confirm the model no longer confuses the launch year or omits retention.
- Confirm it answers Rose-specific measurement and Chapter 03 questions without drifting to other projects.
- Confirm the model uses structured follow-up tools rather than printing their syntax; UI sanitation alone is insufficient.
- Confirm sandbox, runtime guardrail and reliability claims do not overstate the evidence.
- Re-run actual browser dock flows in preview and verify actual deployed-handler equivalence before any production release.

No deployment or public publication is authorized by this pull request.
