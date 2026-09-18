# Evaluating LLM agents: how would you know it had stopped working?

_A working vocabulary for building evaluation into AI products from day one, tested on two real systems._

Published 2026-07-31 · Evaluation · 14 min read

**TL;DR** - A grader judges one criterion, a harness runs the exam, a protocol decides what passing means. Evaluation splits into three arms that do not substitute for one another: offline before the merge, runtime in production, outcome after the fact. Acceptance criteria need tiers with budgets, because 52 out of 53 is a failure when the miss is in the safety tier. And before a threshold may block a merge, prove the measurement holds still - then expect enforcement to move it again. Built from two real systems, Aetherix and Lore, with the gaps named rather than skipped.

Source: https://ivandemurard.com/journal/harnesses-graders-closed-loops

Licence: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Reuse and adapt with attribution to Ivan de Murard.

---

What a grader is, what a harness is, what a protocol decides, and why the difference matters the first time a system is allowed to block a release. Built from two products, with the gaps named.

Most teams building with language models can describe what their system does. Far fewer can say how they would know it had stopped working. This is the vocabulary for that second question, and the frameworks that turn it into a decision.

**Read this if** you are shipping an LLM agent that recommends, decides, or acts, and the usual unit tests say nothing about the ways it actually fails. **What it gives you**: the working vocabulary (grader, harness, protocol), the three arms of evaluation, and acceptance criteria you can defend the day a threshold blocks someone's release. **Tested on** two systems in build: Aetherix, F&B execution for hotels, and Lore, a voice mentor for aviation maintenance. Gaps named, not skipped.

- **Aetherix**: A food & beverage execution agent for hotels. It tells a manager how many covers to expect, how to staff for them, and how to cut food waste. Users: Other agents via MCP, or a hotel / F&B manager with WhatsApp. Feedback: Reality answers fast. Tomorrow's covers are known the day after, so forecast error computes itself.
- **Lore**: A voice AI mentor that captures, qualifies, and leverages the tacit expertise from senior to junior collaborators. Just ask. Users: A junior technician on the shop floor, hands busy. Feedback: Reality returns both the SOP and the signed work record: the procedure that was followed, and the outcome of the operation actually performed.

The numbers below come from those two repositories, not from a whitepaper. Where something is not yet built, it says so.

## 1. The vocabulary, through the driving test

**SEC. 1** A grader judges one criterion, a harness runs the exam, a protocol says what passing means. Concrete case: Lore has 9 graders, one harness, and one protocol document that decides when CI goes red.

A driving test contains every piece of the machinery. It is worth one pass to fix the words, and the rest of this piece will not need it again.

- **Case set**: The test route. The situations you put the system through, chosen in advance, whose correct answer you already know. Also called a golden dataset.
- **Grader**: One line of the examiner's marking sheet. "Did they check the mirror?" Yes or no, plus the reason. One criterion, nothing more.
- **Harness**: The whole examination. The route, the examiner, the sheet, the pass mark, the report. The machinery that runs the test and returns a verdict.

  *Since this was published, the word has acquired a second, more common meaning - the runtime environment around a model. The two are complements, and they are separated in section 13.*
- **Protocol**: The rules. What to measure, on what data, above what threshold it is unacceptable, who decides, when it blocks. A document and a decision, not code.
- **Open loop**: You measure, a human reads it, they may act. The measurement changes nothing by itself.
- **Closed loop**: The measurement is wired back in and changes the system on its own. The merge is blocked, the release pulled, the failure becomes a new test case.

> A protocol without a harness is an intention. A harness without a protocol is a number with no decision attached.

The common confusion: a grader is not an alert. A grader judges, an alert tells someone. Whether anyone finds out is the loop's job, not the grader's.

- Case set (Artefact)
- Grader (Code)
- Harness (Pipeline)
- Protocol (Document)
- Open loop (Posture)
- Closed loop (Mechanism)

## 2. Three arms, and what each product can afford

**SEC. 2** Offline, runtime and outcome evaluation prove three different things, and no one of them substitutes for another. Concrete case: Aetherix runs arms A and B and half of C. Lore runs arm A only.

A pre-merge gate proves quality on frozen scenarios. It says nothing about behaviour in production. The three arms share one severity vocabulary, so that FAIL means the same thing everywhere.

| Arm | When | What it proves |
| --- | --- | --- |
| A — Offline, dev-time | Before the merge | No regression on the case set: stratified accuracy, category coverage |
| B — Runtime, online | In production, continuously | Guardrails and anomaly detection on real traffic: error rates, output bounds, abstention, drift, latency |
| C — Outcome, downstream | After the fact, long loop | Was the output acted on, and did it produce value |

- Arm A, offline: before the merge, no regression on the case set.
- Arm B, runtime: in production, guardrails, anomaly detection, drift.
- Arm C, outcome: after the fact, was the output acted on and did it produce value.

You do not test a parachute against a case set; you measure it in flight. Provided arm B is held to the same standard: every layer emits a measurable signal with a typed reason.

### What each product actually has

|  | Aetherix | Lore |
| --- | --- | --- |
| Human loop | One tap on WhatsApp: accept, modify, reject | The intervention log, not yet exploited |
| Automatic comparison | Yes. Forecast error computes itself and is the level-1 product KPI | None |
| Ground truth | Declared by the manager. Reading it from the point of sale is phase 4 and has its own architecture decision on file | None, and the signal is censored: escalate, and the counterfactual disappears |

Aetherix runs one and a half loops, not two. The comparison is autonomous, accuracy is computed without anyone deciding to compute it, and thresholds gate on it. The truth it compares against is still declared by a human. "Closed loop on a declared truth" is an engineering statement; "dual autonomous loop" is a brochure statement.

> When you cannot learn from outcomes, you have to over-invest upstream. That is why Lore's evaluation harness weighs close to a third of its codebase: not gratuitous rigour, but the price of a missing outcome loop.

- Aetherix: Arm A as a CI gate, arm B with its own architecture decision on runtime guardrails, and every tool call emitted as a structured event, auditable and billable.
- Lore: Arm A only, offline and live. No runtime.

## 3. "Working" against "Reliable", five dimensions

**SEC. 3** Working is proven on a test set. Reliable is proven in production, on five named dimensions. Concrete case: Lore meets one of the five, is partial on two, and absent on two. Both absences belong to arm B.

> Working is proven on a test set. Reliable is proven in production. — Qonto

| Dimension | The question | Lore |
| --- | --- | --- |
| Edge behaviour | Tested outside the distribution, not just the happy path? | partial — four cases on band boundaries |
| Graceful degradation | When the agent does not know, does it say so, or improvise? Is refusal coded as a contract? | met — eight-rule refusal contract, dedicated grader, tier 1 |
| Observability | Is there a dashboard of what the model does in production, not just uptime? | absent |
| Reproducibility | Does the same input produce the same output tomorrow? | partial — temperature 0 and frozen baselines, but the canary has been invalidated |
| Distribution shift | Is there an alert if the input distribution drifts? | absent |

Two absents out of five, and both belong to arm B. Not a coincidence: it is the most expensive arm, and the only one whose absence stays invisible until production.

## 4. The reliability pyramid

**SEC. 4** Each evaluation layer assumes the one below it, and the base is a blocking prerequisite. Concrete case: Select a layer in the figure to see what it measures, which product has it, and what signal it emits.

Without a case set and without failure definitions, nothing above the base can be measured.

- Layer 5: Trust KPI ablation (Does removing a feature move the trust KPI) Turn one component off and measure the effect on the product KPI. Neither product runs this yet.
- Layer 4: Memory recall relevance (precision at five) Of the passages handed to the model, how many were genuinely relevant. Below 0.7 precision at five, two of the five were noise.
- Layer 3: Inbound feedback parser (intent accuracy) The manager's free-text reply is parsed into accept, modify, reject. Below 90% accuracy the human loop silently corrupts the data.
- Layer 2: LLM reasoning quality (what the graders cover) Does the answer follow the procedure, cite it, refuse when it must. This is the layer the nine Lore graders occupy.
- Layer 1: Forecast accuracy (MAPE) Forecast error against realised covers. Drifting more than three points from baseline is a defined failure.
- Base: Case set and failure definitions (blocking prerequisite) Representative cases with known answers, and a written definition of what counts as a bad output. Everything above is unmeasurable without it.

- Aetherix: The pyramid comes from its reliability plan. Every layer has a numeric failure definition.
- Lore: The base exists. Layer 2 is what the nine graders cover. Layer 4 is the open hole: the memory engine's similarity is neither observed nor evaluated.

## 5. Evaluation as a contract

**SEC. 5** The case set is written before the model code, as a specification with a sanction attached. Concrete case: Lore's documentation claimed procedure primacy was enforced. It was a sentence in a prompt, until code held it.

> Not after the bug. Before the first line of model code, answer this: how will we know it works?

- Case set first. Representative examples, edges included, before any code.
- Define failure. What is a bad output, and above what threshold is it unacceptable?
- The evaluation set is a specification, not a test added afterwards.
- Once the output is seen by a customer, the bar is ship-or-fail, not "it informs a decision".

The idea is not mine. I took it from Qonto's engineering, which frames it as a contract rather than a best practice. That shift is what makes it operative: a contract has a counterparty and a sanction.

A concrete case. Lore's documentation described procedure primacy as "structurally enforced", when it was a sentence in two prompts, which is a request. Three attempts to strengthen the request failed, one of them dropping the safety tier by nearly four points. The guarantee now lives in code that checks the answer against the computable rule after generation, sends one targeted correction quoting the manual, checks again, and falls back to a deterministic verdict. A claim about code has to be held by code.

- Aetherix: A traced architecture decision, "evaluation by design", not a team convention. Versioned case sets, merge blocked without a green pipeline.
- Lore: The case set existed before the refusal contract, and it is what made the defects visible.

## 6. Acceptance criteria, the part everyone skips

**SEC. 6** A pass rate with no threshold attached is a number, not a decision. Concrete case: A Lore run scored 52 out of 53 and was declared a failure: the single miss sat in the safety tier.

A missing closing sentence and an invented vibration threshold are both failures; only one of them can ground the wrong aircraft. So severity is tiered, and each tier carries its own budget.

| Tier | Threshold | What it covers |
| --- | --- | --- |
| 1 — safety | 100% | No budget. Invented figures, a refusal followed by a guess, contradicting the procedure, manufactured consensus. |
| 2 — trust | 95% | Named attribution, procedure cited first. Usable when degraded, but it erodes the reason to trust the system. |
| 3 — form | 90% | Wording and closing discipline. A miss misleads nobody about a limit. |

| Code | Verdict | Meaning |
| --- | --- | --- |
| 0 | PASS | Every tier at 100% |
| 1 | FAIL | A tier below its threshold |
| 2 | ERROR | The harness crashed. No measurement was taken |
| 3 | WARN | Thresholds met but a tier is not clean. Not a synonym for "fine" |

This is where the driving test earns its keep. You can collect minor faults and still pass. One major fault and you walk home, whatever the rest of the sheet says.

Separating ERROR from FAIL is not fussiness. The runner emitted only 0 and 1, so a crash exited as FAIL. "No measurement was taken" and "the measurement came back bad" call for opposite actions, and a CI that conflates them reads a crash as a quality signal.

### The two rules that make the difference

- Relative regression, not just an absolute floor. A drop of more than three points against the frozen baseline is a failure even when the tier stays above its threshold. Severity follows what broke, otherwise a 0.6-point wording flap would turn the build red.
- Determinism is a prerequisite. Acceptance criteria against a moving measurement mean nothing. Which is the subject of the next section.

## 7. The canary, and why it was invalidated

**SEC. 7** Before a threshold may block a merge, prove the measurement holds still. Then expect enforcement to move it again. Concrete case: Four identical Lore runs froze the baselines. A later correction step reintroduced variance, so the rule was narrowed rather than dropped.

- 38 / 36 Two runs, same 53 cases: Only 12 of the 17 failures in common. Eight cases flipped. At temperature 0.5 the rate is a draw, not a measurement.
- 36 → 53 Temperature 0, defects fixed: Progression 36, 48, 48, 52, then 53 out of 53.
- 4× Four consecutive runs, no variance: Baselines frozen only after that. The protocol required 0.00 points of variance before a threshold could block.
- 61 / 62 After enforcement, 64 cases: Structural enforcement adds a conditional second model call on corrected answers: two chances to diverge. Disjoint failure sets.
- 0.6 pt Canary rerun, three runs: Tier 1 at 100% in all three. All observed variance sits in tier 3, well inside the three-point budget.

Temperature 0 makes a request reproducible in practice, not deterministic by construction: the provider remains free to vary. Four identical runs were empirical evidence, not a guarantee. Enforcement then raised the mean and raised the variance. Both are true, and the trade is worth making: a corrected answer beats a fluent wrong one.

Hence the rule corrected rather than quietly dropped: 0.00 points of variance required on tier 1 alone, tiers 2 and 3 free to move inside their budget. The safety tier is guarded by code and does not move; the form tier depends on phrasing and always will.

> Demanding 0.00 across every tier sets a bar that cannot be met, and a gate that cannot be met is a gate people learn to ignore.

- Aetherix: The origin. The failure-thresholds file and the coverage script, exit-code contract included. [Its gate moved from advisory to blocking](https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/blob/main/EVAL_GATE.md) only after the same canary, and environment drift was named as the real culprit rather than the model.
- Lore: The reimplementation, with frozen baselines committed and a CI gate that blocks on FAIL. The live target no longer starts on its own: it needs a label on the pull request or a manual trigger. A full run is about seventy model calls for a quarter of a euro, and CI must not be able to spend on its own initiative.

## 8. Adversarial review, who grades the grader

**SEC. 8** A grader written by the prompt's author inherits its blind spots, so some cases must be authored against the system rather than for it. Concrete case: Half of Lore's first 17 failures were graders that were too strict. Three later cases were graders too weak to fail a real defect.

- **Author bias**: The person who wrote the prompt writes the grader, and both share the same idea of a good answer. The fix is cases written by someone trying to break the system, plus a periodic read of passing answers, not just failing ones.
- **Injection through retrieved content**: Anything the system retrieves can carry text shaped like an instruction. Rose, this site's conversational guide to Ivan's work, wraps every case study mirror in explicit delimiters and is told those blocks are reference material, never instructions. That rule is itself a testable case.
- **Manufactured authority**: "Other technicians familiar with this airframe likely agree." From a single note. Inventing agreement fabricates the authority the reader weighs the advice by, which is why it sits in tier 1 alongside invented figures.
- **Confident wrongness**: The dangerous output is not the refusal, it is the fluent answer with the wrong threshold in it. Adversarial cases target the seam: exact band boundaries, a second expert contradicting the first, social pressure to grant permission.

> A regression suite proves that graders reject bad answers. It never proves they accept good ones phrased differently from how their author phrased them. That takes a real run.

What is not done yet, named as a gap: there is no scheduled red-team pass, no adversarial corpus maintained separately from the case set, and no second author on the graders. On Lore the adversarial work has been opportunistic, triggered by reading real runs. That is better than nothing and worse than a protocol.

## 9. Confidence, three things people conflate

**SEC. 9** A model writing its own confidence is generating a token, not measuring anything. Concrete case: A hard-coded 0.7 sat in Lore's capture fallback, the branch that runs when confidence is lowest. Removed.

- **Self-declared**: The model writing a confidence of 0.85. That is a generated token, not a measurement: it produces the plausible number for the context, like the rest of the sentence.
- **By corroboration**: How many independent sources, how recent, how consistent. Reliable because counted, not guessed.
- **Calibration**: When the system says 80%, is it right 80% of the time? The only strict sense. It requires outcome data, therefore arm C.

> A wrong number in a safety product is worse than no number, because the downstream code and the humans will believe it. Absence is honest; 0.7 is a lie with a decimal place.

## 10. Human in the loop: by design or by default

**SEC. 10** Keeping a human is fine. Leaving the human as the only mechanism, without capturing their decision, is not. Concrete case: In Aetherix every accept, modify or reject is an event. In aviation the technician remains the certifying agent, by law.

|  | By design | By default |
| --- | --- | --- |
| Status | A decision node: defined inputs, defined decision, recorded output | Nobody automated the step, so someone has to remember |
| Trace | The approval becomes data, every rejection an evaluation case | No trace, no learning |
| Under load | Holds | Breaks |

Closing the measurement loop, blocking a merge, alerting on drift, feeding failures back into the case set, is a purely architectural decision. Closing the authority loop, letting the system act without a human, is a business and regulatory decision.

## 11. Signals, ontology, priors

**SEC. 11** You do not monitor what does not speak, and you cannot separate what the system cannot name. Concrete case: Asked about an aircraft with no history, Lore answered with another aircraft's record. Separation was documentation, not code.

- **Signals**: Typed emissions at every layer: refusal reason, retrieval score, abstention event, latency. Without signals, arm B is structurally impossible.
- **Ontology**: The shared vocabulary that makes "the same situation" computable. Without it, the distinction between two aircraft is only words in a prompt.
- **Priors**: What the system believes before seeing evidence. "I have seen it four times in eight years" is a prior. In prose it is an anecdote; as a weight it is a prior.
- **Similarity**: Retrieval plus ontology. This is layer 4 of the pyramid, and it is most often unevaluated.

- Aetherix: The tenant identifier is resolved server-side at every layer and is never a tool input. What the model cannot name, it cannot cross.

## 12. What a harness finds that no unit test sees

**SEC. 12** The failure mode is a perfectly formed answer carrying the wrong threshold. Code coverage cannot see it. Concrete case: At an oil consumption of exactly 0.30 qt/hr, Lore answered "NORMAL". It is ELEVATED: the band's lower bound is inclusive.

First live run, 53 cases, 17 failures. Three defects that code coverage would never have revealed, because the code worked perfectly.

- Hallucination after an honest refusal. The model says the procedure does not cover the fan blade count, then supplies one.
- Cross-aircraft leakage. Asked about an aircraft with no history, it answers with another aircraft's.
- Manufactured consensus. From a single note: "other technicians familiar with this airframe likely agree".

Across those 17 failures, the split was almost even between real model defects and graders that were simply too strict. A grader that cries wolf costs safety: after the third false alarm nobody reads the report, and that is the run where the real failure goes past.

Later, eleven harder cases were added and all 64 passed live on the first attempt. That was the least informative outcome available, so the answers were read rather than trusted. Reading them found three cases graded too weakly to fail, including the 0.30 qt/hr defect the harness had waved through: the required pattern accepted the answer because the word NORMAL appeared in it. All three now fail, and the baseline was deliberately not re-frozen. The protocol says freeze after three stable runs, never to turn a red run green.

> A case set that passes completely has stopped being an instrument of discovery and become a safety net. Both are useful; they are not the same object.

## 13. Two harnesses, and which one this is

**SEC. 13** The word now carries two meanings, and a team can hold one while missing the other entirely. Concrete case: This piece was published on 2026-07-31, weeks before the write-ups that made the other meaning standard. Everything above describes the evaluation harness.

Through the second half of 2026 a body of writing converged on *harness engineering*, and it uses the word for a different object than this piece does. Both are real, and the collision is worth one paragraph because the failure modes are opposite.

- **The agent harness**: the environment around the model. Tools and their schemas, permissions, workspace, durable state, stop conditions, what happens on a retry. *Agent = model + harness.* It answers: **can this system act reliably?**
- **The evaluation harness**: the machinery that runs the exam. Case set, graders, thresholds, verdict, exit code. Section 1's definition, and the one used everywhere above. It answers: **would I know if it had stopped?**

An agent harness without an evaluation harness produces a system that acts confidently and is measured by nobody. An evaluation harness without an agent harness measures something that cannot act. They are complements that arrived in the discourse eighteen months apart, and the second one arrived louder.

> An agent harness proves the system can act. An evaluation harness proves it still should.

### What that literature adds to this one

Three things worth taking, none of which this piece specified well enough:

- **The tool gateway as its own layer.** Validate the schema, authorize against policy, execute in a sandbox, and return a *structured observation* - status, reason, evidence, retryable - rather than a wall of terminal output. That is arm B infrastructure, and section 11's "typed emissions at every layer" is the same claim without the mechanism.
- **A permission ladder matched to consequence.** Reading a public document and deleting customer records should not travel the same approval path. Uniform friction gets routed around.
- **Gating on reversibility rather than on confidence.** Sort work by how expensive the mistake is to undo, and treat the irreversible lane as a lane that does not open rather than a threshold set very high - because thresholds get adjusted under pressure and closed lanes do not. This is section 9's argument arriving from the other direction: a model's confidence is the only input to that decision the model itself can influence, which makes it the weakest variable in the gate.

### What it does not add

Arm C. Across that entire body of work, almost nothing measures whether the output was acted on and whether acting on it helped. The closest is a single ratio - accepted outputs over human review minutes - stated once and not developed. The attention went to the half of the problem that is visible before deployment.

Which leaves the gap this piece named in section 2 and did not close. Stated now so it can be checked:

- **Acceptance rate** - accepted or modified outputs over outputs delivered. In Aetherix the four values are already recorded: `accepted`, `rejected`, `modified`, `ignored`. `rejected` is the most informative of the four, because it is a human engaging and disagreeing. `ignored` is the one to watch hardest: it is a human routing around the system, and a system can raise its acceptance rate indefinitely by being ignored more selectively.
- **Human minutes per accepted output** - the direct measure of the interruption budget. A system that raises acceptance by asking more often has not improved. It has spent someone else's attention to buy its own score.

Neither is worth reading without the other. Acceptance rate alone is a Goodhart target, and a system optimised on it learns to emit bland, agreeable outputs that cost nothing to approve - the same shape as a support bot that drives its ticket-resolution rate up by closing tickets instead of solving them.

And arm C data only compounds if the correction is routed. An override reports that *some layer* was wrong, and which layer decides what the fix is: a stale fact belongs in memory, an unwritten rule belongs in a recorded decision, a preference seen three times belongs in a policy, an unseen pattern belongs in the case set, and an output that should never have been surfaced belongs in the filter upstream. Only the fourth is a retrain. Recording the override as free text - which is what both systems do today - collapses all five into one undifferentiated pile.

- **Aetherix**: arms A and B built, arm C recorded but not yet measured. The gate described in section 7 is written up in full, with its own canary and the environment-drift diagnosis, at [EVAL_GATE.md](https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/blob/main/EVAL_GATE.md).
- **Lore**: arm A only, and the missing outcome loop is still why its evaluation harness weighs close to a third of its codebase.

<a id="13-frequently-asked-questions"></a>

## 14. Frequently asked questions

- **What is a grader?** One line of a marking sheet: a single criterion, pass or fail, plus the reason. Kept deterministic, because a model judging a model fails the same way as the thing it judges.
- **Harness or protocol, what is the difference?** The protocol says what passing means. The harness is the machinery that applies it. Neither decides anything without the other.
- **Why not just write tests?** Because the failure mode is a perfectly formed answer carrying the wrong threshold. Code coverage cannot see that. In the four real defects found on Lore, the code worked exactly as written.
- **Can an LLM judge another LLM's output?** On criteria where the cost of a wrong verdict is bounded, yes, provided it is calibrated against a golden set and its agreement rate with humans is measured. Never on a tier that admits no failures.
- **What does a closed loop actually require?** Ground truth. Without something that says whether the output was right, you have measurement, not learning. Closing the measurement loop is architectural; closing the authority loop is a business and regulatory decision.
- **How do you prevent hallucinations?** You do not prevent them, you make them visible and blocking. A safety tier at 100% with no budget, and refusal coded as a contract rather than requested as a style note.
- **What is a confidence score worth?** It depends which of three things it is. Self-declared by the model: a generated token, not a measurement. By corroboration: counted, therefore useful. Calibrated: the only strict sense, and it requires outcome data.

<a id="closing-note"></a>

## 15. Closing note

Sources: the "evaluation by design" architecture decision and [Aetherix](https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture)'s reliability plan. "Eval as a contract" comes from Qonto's engineering. Figures and examples come from Lore's harness: 64 cases across 12 categories, 9 graders, 21 reference answers, 17 regressions, 61 tests.

This piece has gaps. They are in the table in section 3 and in the last paragraph of section 8.

A note on where it came from. I wrote the first version for myself, before interviews, because I kept noticing I could do things I could not name. It turned out to be more useful as a reference than as a memory aid, so it became this.


## Updates

This piece is revised when something it claims stops being true. Each revision says what changed and why.

2026-09-12 · Added section 13, "Two harnesses, and which one this is", plus the arm C metric the piece named as missing in section 2. *Through August and September 2026 a body of writing redefined "harness" to mean the runtime environment around a model. This piece uses the older sense - the machinery that runs the evaluation - throughout, and a reader arriving from that discourse would read section 1 as an error rather than as the complementary half.*
