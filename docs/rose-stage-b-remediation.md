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

## Remaining release blockers

- Confirm the model no longer confuses the launch year or omits retention.
- Confirm it answers Rose-specific measurement and Chapter 03 questions without drifting to other projects.
- Confirm the model uses structured follow-up tools rather than printing their syntax; UI sanitation alone is insufficient.
- Confirm sandbox, runtime guardrail and reliability claims do not overstate the evidence.
- Re-run actual browser dock flows in preview and verify actual deployed-handler equivalence before any production release.

No deployment or public publication is authorized by this pull request.
