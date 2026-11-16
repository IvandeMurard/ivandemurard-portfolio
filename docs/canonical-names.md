# Canonical names and statuses: the local reference

The site follows the meta-repo's `llms.txt`, which is canonical. This file is a **copy** of its three sections (status vocabulary, current component status, names), so a change here can be checked against it without leaving the repository. When the two disagree, `llms.txt` wins and this file is corrected.

**Copied on 16 November 2026 from `llms.txt` on the meta-repo branch `docs/canonical-names` (commit 5ee384d), which was not yet pushed or merged.** The copy below is a draft of the canonical file until that branch is merged; re-copy it from `main` then.

```text
## Status vocabulary

Canonical across this repo, the execution-node repos and https://ivandemurard.com. Every component status uses exactly one of these five labels. "Built" means the code runs, not that anyone uses it yet.

- Built — deployed and exercised end-to-end on the target environment.
- Shadow-mode — runs on real data, but no decision is delivered to a human on that basis.
- Synthetic PoC — validated on fabricated data only; never met the real world.
- Design — specified (ADR, schema, contract), not implemented.
- Research — open exploration, no delivery commitment.

## Current component status

- Aetherix (F&B node): Built — private repo, 0 real users, staging on Fly.io.
- Decision Ledger (one row per recommendation: context → recommendation → manager response → measured outcome): Built — inside the F&B node. Never "self-improving": the record is Built, the learning is not demonstrated.
- Aetherix forecast: Shadow-mode — benchmarked on real public data, no manager decision delivered on it yet.
- Tacet (environment node): Built — public repo, paused / maintenance mode since July 2026.
- Anima (guest node): Synthetic PoC — DPIA-gated, never run on a real guest.
- Peritia (house-knowledge node): Design — contracts specified, not implemented.
- Bespoke Orchestrator: Design — proto-stub only.
- Meta-Learner & Hive priors: Research — no substrate yet.
- Model portability (nodes ask for a capability tier, not a model; any model that passes the eval gate is admissible): Design — Claude is the primary model, and no second provider has been run through the eval gate yet.

## Canonical names and surfaces

One name per thing, on every surface. A surface that says something different is corrected to match this file, never the other way round. Repeating a claim on several surfaces is still one claim.

Names

- Project: Hospitality Multi-agent Architecture (repository: Hospitality-Multi-agent-Architecture). "Hospitality Agentic Mesh" is the former repository name, not a current name.
- Nodes: Aetherix (F&B node), Anima (guest node), Peritia (house-knowledge node), Tacet (environment node), Orchestrator. Use the node name, then its role in parentheses on first mention, exactly as in the list above.
- Decision Ledger: one row per recommendation (context → recommendation → manager response → measured outcome). Built, inside the F&B node, 0 real users. Former names: outcome-tracked operational history, decision log, decision records. Never "self-improving".
- Learning loop: what changes from Decision Ledger rows, always approved by a named person. Built, never run on real data. Former names: closed loop, feedback loop.
- Operational Memory: per-hotel memory, isolated by hotel. Built. Former names: Private Memory, layer 1.
- Hive Memory: anonymised patterns across hotels. Research. Former names: HiveMemory, Federated HiveMemory, layer 2.
- Cold-start prior: Bayesian prior from a cohort of similar hotels, for a hotel with no history. Research. Former name: cold-start meta-learner (ADR-0005, May 2026).
- Meta-Learner: tunes the orchestrator's decision thresholds from outcomes. Research.
- Daily Receipt: the daily message to the manager. Built. Former name: receipts.
- Context Graph: multi-source context graph (ADR-0008). Design.
```

## What the site says that differs from the table (16 Nov 2026)

Nothing below was changed. The portfolio's project statuses (`src/content/statuses.ts`) are a second vocabulary (Pilot-ready, Maintenance, Compliance Gated...) that the MCP server and Rose quote as written. Aligning them word for word means replacing that vocabulary, which is a decision for Ivan.

| Where | Site says | llms.txt says |
|---|---|---|
| `statuses.ts` aetherix | "Pilot-ready". "Built and evaluated on historical data. Staged on Fly.io, connected to the Apaleo sandbox. Ready for a 30-day pilot." | "Built: private repo, 0 real users, staging on Fly.io." |
| `statuses.ts` tacet | "Maintenance". "...Built; in maintenance mode since July 2026." | "Built: public repo, paused / maintenance mode since July 2026." |
| `statuses.ts` anima | "Compliance Gated". "Synthetic PoC. Architecture ready, deployment frozen until the data-protection impact assessment (DPIA) clears." | "Synthetic PoC: DPIA-gated, never run on a real guest." |
| `statuses.ts` sonor, rose, lore, compass | Own labels (MVP shipped, Live text only, Evaluated, Partial) | Not in the table: these are portfolio projects, not nodes of the architecture. |
| Mesh diagram (Aetherix page), Tacet | "Built · maintenance mode since July 2026" | "Built: public repo, paused / maintenance mode since July 2026." |
| Mesh diagram, Peritia | "Design" | "Design: contracts specified, not implemented." |
| Mesh diagram, Orchestrator | "Design · proto-stub" | "Design: proto-stub only." |
| Mesh diagram, Anima | "Synthetic PoC, hackathon prototype; production DPIA-gated" | "Synthetic PoC: DPIA-gated, never run on a real guest." |
| Aetherix forecast | No "Shadow-mode" label on any page; the forecast console says "Illustrative figures from shadow-mode runs, not a signed pilot" | "Shadow-mode: benchmarked on real public data, no manager decision delivered on it yet." That console line uses the word for sandbox figures; the definition (real data) does not fit them. |
| Decision Ledger | Had no status on the site | "Built: inside the F&B node." Added on the Aetherix page: "Built inside Aetherix, 0 real users." |
| Model portability | Not on the site | "Design". |
| Tacet page, "Hive Mind, Research" | "Hive Mind" | Hive Memory (not in the former-names list; not changed). |
| Meta-Learner and Hive priors | "Federation: Research, no substrate yet." (Architecture page) | "Meta-Learner & Hive priors: Research: no substrate yet." Same label. |

## Names changed on 16 Nov 2026

| File | Before | After |
|---|---|---|
| `AetherixArchitectureDiagram.tsx` | HiveMemory | Hive Memory |
| `AetherixPhaseTimeline.tsx` | Phase 2 "Receipts"; "Federated HiveMemory" | "Daily Receipt"; "Hive Memory" |
| `AetherixMeshDiagram.tsx` | "memory, receipts" | "Operational Memory, Daily Receipt" |
| `AetherixHomepageLoop.tsx` | aria-label "Three days of the closed loop" | "Three days in the sandbox hotel" |
| `Atherix.tsx` | HiveMemory (x3); "OperationalMemory + HiveMemory cold-start" | Hive Memory (x3); "Operational Memory + Cold-start prior" |
| `Atherix.tsx`, `public/aetherix.md` | "Every day adds one record" | "Every day adds one row to the Decision Ledger: ... Built inside Aetherix, 0 real users." |
| `public/aetherix.md` | The same names as the page | The same canonical names |
| `serviceBlueprint.ts` | "a short receipt"; "Daily receipt" | "the Daily Receipt"; "Daily Receipt" |
| `rose-context.ts` | "Decision records"; "HiveMemory"; "a closed loop" | "The Decision Ledger"; "Hive Memory"; "the Learning loop" |

Left as written: the Field Note "What is an LLM evaluation harness? Graders, protocols and closed loops for AI agents" and its glossary term "closed loop" (a general engineering concept, and a published title), the "demo/closed-loop" paths, "feedback loop" in the Field Notes and on the Architecture page (general sense), "Layer 1/2" in the evaluation layers of the harness note, and "decision record" in Rose's design-lab page (it names that page's own history).
