## Goal

Tighten the Aetherix case study so every claim matches what is actually proven today, and add a short box that frames the unpublished part as deliberate research, not a gap.

## 1. Learning claim

In `src/pages/Atherix.tsx` (hero cycle line) and `src/components/atherix/AetherixLoopCards.tsx`:

- "Every reply sharpens the next." becomes "Every reply is recorded as feedback; the pilot tests whether it improves future recommendations."
- Hero cycle line, shorter variant: "Every reply is recorded as feedback." with the full sentence carried in the Learning card body.
- The Learning card body "The day-90 receipt is sharper than the day-7 one." is rewritten as a hypothesis under test, not a stated fact.

## 2. Cold-start and Day 7 / Day 90

Separate two things that are currently conflated:

- What exists now: global and cross-property context patterns recallable through pgvector, used as a generic prior.
- What does not exist yet: a true federated cohort prior (HiveMemory as described). Tag it Research, Phase 4+.

Applied to:
- `AetherixLoopCards.tsx` Memory card body, and every `day7` / `day90` string, which move from deterministic statements ("Confidence intervals tighten", "The system knows how this property behaves") to expected-behaviour phrasing under pilot ("what the pilot is set up to measure").
- The `MEMORY_CYCLE` Memory entry in `Atherix.tsx`.
- The caveat paragraph after the loop cards: state plainly that federated cohort priors are research, not shipped.
- The architecture line "OperationalMemory + HiveMemory cold-start" gains a "(research)" qualifier on HiveMemory.

## 3. Anima status

- `AetherixMeshDiagram.tsx`: node status and the two "Shipped" badges become "Synthetic PoC" / "PoC (hackathon)"; full status text "Synthetic PoC, hackathon prototype; production DPIA-gated".
- `AetherixAnimaSpotlight.tsx`: "Shipped as a proof of concept" becomes "A synthetic hackathon prototype (June 2026); production is DPIA-gated".

## 4. Promises tagged as pilot hypotheses

`PROMISES` in `Atherix.tsx`: "Staffing that fits" and "Less waste" each get a small label chip reading "Pilot hypothesis" (and "Target outcome" for waste), rendered above the title, so the reader sees the status without extra prose. Section intro adds one line: these are the pilot's target outcomes, not measured results.

## 5. New box: What remains private

New component `src/components/atherix/AetherixWhatRemainsPrivate.tsx`, placed just after the "Built to be trusted" section (before the honesty/where-we-are section), styled like the existing bordered surface cards:

> **What remains private**
> The project includes proprietary research on cross-domain operational context and cold-start learning. Public materials focus on the engineering evidence: evaluation gates, traceability, safety guardrails, privacy boundaries, and outcome measurement.

The five engineering evidence items render as a compact inline list so the box reads as a strength.

## 6. Mirrors

Same corrections applied to `public/aetherix.md` (cycle line, Memory bullet, Day 7 / Day 90 lines, caveat, promises line, Anima row and section, architecture line) and the Aetherix paragraphs of `public/llms-full.txt`, including the new "What remains private" paragraph.

## Notes

No em-dashes. No layout redesign, no new sections beyond the private-research box, section numbering unchanged.
