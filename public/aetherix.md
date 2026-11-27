# Aetherix

The F&B agent for boutique hotels.

It works inside the tools the hotel already runs, its PMS and WhatsApp: one recommendation a day, the manager's reply, the outcome recorded next to it. Built to improve with every day it runs.

- Status: Pre-pilot. Built and tested on the Apaleo sandbox and on public restaurant data. 0 real users. Being made pilot-ready; no hotel yet.
- Role: AI Product Manager and Product Builder, solo · 2026
- The architecture: https://ivandemurard.com/architecture
- GitHub: https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture
- Book a call: https://cal.com/ivandemurard/discussion-and-introduction

## TL;DR

- The problem: Hotel data sits in the PMS and POS, floor experience sits with the team, and tomorrow's covers are decided by bridging the two by hand.
- The bet: One recommendation a day in WhatsApp, checked against what happened the next morning.
- Today: The loop runs daily on Maison Lumen, a fictional hotel in the Apaleo sandbox. The product is being made ready for a first pilot; no hotel yet.
- Still open: The forecast is not yet proven on hotels. No pilot hotel has signed.

How to read the status marks:

- Built: Implemented behaviour that can be inspected in the product or repository.
- Validation: A bounded test, audit or measurement. It does not prove every outcome.
- Design: A proposed direction or a prototype.

## 01 · The problem

### Accurate records, floor instincts, and a daily blind spot

Reconciling hotel data and floor experience before the evening shift

Boutique hotels run on two distinct sources of truth.

On one side, the software: the PMS logs reservations, arrivals and guest histories, while the POS tallies table receipts and beverage sales.

On the other side, the floor: the head waiter knows that rainy afternoons pack the bar, the chef sees prep times stretch on large tables, and the manager tracks nearby events that never show up in hotel software.

Neither side talks to the other. At 4 PM, someone has to bridge that gap on the fly, guessing tomorrow's covers before the prep shift begins.

**The operational toll**

- **Food cost and margin leakage.** Fresh prep discarded after slow shifts, or mid-service 86s that force servers to apologize for missing specials. Margin is lost at both ends.

- **Guest and team friction.** Under-staffed teams take the brunt of sudden rushes: ticket times climb, service becomes transactional, and staff burn out. Over-staffed shifts leave extras idle and frustrated.

- **Missed covers and cognitive drag.** Doors closed early to walk-ins and room service capped out of caution. Meanwhile, the manager spends the last hour of their shift hunting through tabs instead of supporting the team during setup.

**Where this comes from.** Informal conversations with product managers who built staffing and scheduling software for restaurants and hotels. No F&B manager has been interviewed yet; that is part of the pilot.

## 02 · How it works (Built)

### One record a day

What was recommended, what the manager said, what happened. The message in the demo above is real sandbox output.

1. Evening: Tomorrow's covers and staffing, with the reasons.
2. Reply: The manager accepts, rejects, or gives the right figure.
3. Next morning: The real outcome is stored next to the recommendation.
4. Adjust: The agent recalibrates on the gap.

Free-text replies are not used yet. Whether the agent gets sharper over time is what a pilot would test.

## 03 · Product strategy (Design)

### Understand a property the way its manager does

And measure every recommendation against what happened. Five decisions follow from that.

| # | Decision | Why |
| --- | --- | --- |
| 1 | Distribution before design | A hotel floor has no time for a new tool. So the product plugs into the PMS and is built to be listed where hotels already pick their integrations. |
| 2 | F&B first | A covers forecast has a result the next morning. It can be checked. |
| 3 | WhatsApp as the only surface | It shows the recommendation, keeps a human line to the manager, and records the reply the agent learns from. |
| 4 | Three parties: who uses, who pays, who distributes | The F&B manager uses it. Hotel management pays. The PMS distributes. |
| 5 | Pricing on results, to start | With no track record, the builder carries the adoption risk. The later model is undecided. |

Who uses, who pays, who distributes.

- Distributes: The PMS. Apaleo shares read-only data and lists the integration.
- Uses: The F&B manager. Gets the daily message. Sends the reply.
- Pays: Hotel management. Signs the contract.

### Unproven

- No hotel or PMS has validated this route yet.
- The platform could build the same thing.
- Pricing on labor cost needs payroll data the PMS does not hold.

## 04 · What is proven, what is not (Validation)

### The loop is built. The forecast is not yet proven on hotels.

#### Already working

- States its drivers the evening before, then reports its own miss the next morning.
- Rejected an implausible POS figure (850 covers, injected as a test) instead of learning from it.
- When recent data diverges sharply from history, says so and asks the manager to double-check.
- After a simulated 25% jump in demand, weekly recalibration cut the forecast error from 15.9% to 12.3%.
- Stores every recommendation next to what happened, with the manager's override beside it.
- Daily recommendation, automatic path (Built). A demand anomaly becomes a stored recommendation and a WhatsApp message, no human step. Checked once on staging (19 Nov 2026), anomaly injected by hand on a fictional hotel; no live signals yet.

Sandbox data, real mechanics, deterministic reruns.

#### The forecast test

Public data, 30 restaurants. Against a naive same-weekday baseline (the mean of the last four same weekdays): mean error 49.71% vs 55.86%, ahead on average. For next-day forecasts, the horizon the product uses, 28.5% vs 27.9%, slightly behind.

The test used restaurant data, without hotel occupancy, the signal the product relies on. The protocol was not pre-registered. Maison Lumen uses occupancy from Apaleo; how accurate the forecast is on a real hotel is what a pilot will measure.

#### The numbers

Kaggle Recruit, 30 Japanese restaurants out of 829, 1,193 scored points, deterministic rerun. Prophet against a naive same-weekday baseline (the mean of the last four same weekdays): mean MAPE 49.71% vs 55.86%, passing the pre-set 5-point rule. MdAPE 27.0% vs 27.6%. At J+1, 28.5% vs 27.9%. A gradient-boosted model reaches 25.6% on the median. The protocol was not pre-registered for this run.

**MAPE.** Mean absolute percentage error. The average gap between a forecast and what actually happened, expressed as a percentage, which makes errors comparable across covers, revenue, or volumes.

#### Phases

- ● Phase 0–2: Validation, observability and the Daily Receipt are done.
- ◐ Phase 3 · now: Pilot readiness. No hotel yet.
- ○ Phase 4: Scale: Mews, POS, Anima.
- ○ Phase 5: Revenue Orchestrator. Hive Memory stays research.

## 05 · The Decision Ledger (Built in Aetherix, Design as a shared layer)

### The outcomes layer the others do not have

Every recommendation Aetherix sends becomes one row: the context, what it recommended, what the manager said, what happened. That ledger is built, with no real user yet. The bet is to make it a layer: every agent of the architecture writes its rows there, and agents built by others read it through MCP.

The ledger, one row per decision:

| Agent | Recommended | Human said | What happened | Gap |
| --- | --- | --- | --- | --- |
| Aetherix · built | 101 | 79 | 95 | 6% vs 17% |
| Tacet, Anima, Peritia | Same row, written by every agent of the architecture · designed | | | |
| Agents built by others | Read and written through MCP · designed | | | |

First row: built, shown on the sandbox run at the top of the page. The other rows are design.

#### Why it matters

Agents on marketplaces such as Apaleo's Agent Hub recommend. The ledger is the part that records what happened next, for Aetherix's own agents and for others'.

Built in Aetherix on 1 August 2026, no real user yet. The shared layer is design.

#### The shared layer: design, nothing built yet

- The ledger has no real user yet, and Aetherix no pilot hotel.
- Other agents would need consent, a shared format and access to outcomes.
- The platform could build the same layer.

## 06 · How it's built (Built)

### Specified, reviewed and tested before anything ships

- **Spec before code, with the BMAD method.** Requirements, architecture, epics, then one written story per change. Code comes last.
- **I direct the agents; I own the result.** AI agents build from those stories, inside 34 decisions I set. I review and decide what ships.
- **Nothing merges without passing its tests.** A fixed set of scenarios checks every change; a drop in quality blocks it.
- **A weekly self-audit.** An agent checks that what the project claims still matches what it does.

### Inside the agent

One pass a day, on Maison Lumen's first evening: the same figures as the demo at the top. Pick a step.

1. 01 Reads the hotel: Apaleo, read-only, plus weather and local events. Nothing is written back. Apaleo: "Tomorrow: hotel 98% full. New Year's Day." Aetherix: "Read. Weather is poor, and there are no local events." [Read-only]
2. 02 Forecasts the covers: A statistical forecast that comes with its range. Aetherix: "101 covers. 94 to 109 on 4 nights out of 5." [High confidence]
3. 03 Remembers this hotel: Its own past days. Shared patterns across hotels stay research. Aetherix: "A usual Thursday here: 87 covers." [This hotel only]
4. 04 Explains in plain words: The message carries its reasons, so the manager can disagree with one of them. Aetherix: "Why 101: usual level 87; hotel 98% full +9, New Year's Day +8, season +7, weather −6." [Reasons attached]
5. 05 Records what happened: The reply and the real outcome sit next to the recommendation. That record is the ledger. Manager: "I'd say 79 covers instead." Aetherix: "Actual: 95. Forecast 101: 6% off, inside the range. Your estimate: 17% off." [Outcome recorded]

Around every step: evaluation gates that block a change, one hotel's data never visible to another, data kept in the EU.

Maison Lumen, a fictional hotel in the Apaleo sandbox: synthetic data, real services, seed 42. The figures come from the run; the bubbles word them for display.

### Evaluation harness · CI gate

#### Evaluation as a contract

Qonto-inspired. Versioned golden datasets. Any change to forecasting, providers, memory or prompts needs a green eval pipeline to merge. A hard CI gate, not a habit.

Field Note: https://ivandemurard.com/journal/harnesses-graders-closed-loops

### Where it sits

Aetherix is one agent of the Hospitality Multi-Agent Architecture (https://ivandemurard.com/architecture). It executes F&B; it does not orchestrate. Every exchange goes through MCP.

- Orchestrator: Coordination and business rules (Synthetic PoC, in shadow).
- Aetherix (this page): F&B execution (Built · forecast in shadow mode).
- Tacet: Sensory: weather, noise, open data (Built · maintenance).
- Anima: Guest memory (Synthetic PoC · DPIA-gated).
- Peritia: House knowledge (Design · pattern tested in Lore).
- Decision Ledger: built in Aetherix; shared across agents: Design.

Tacet → Aetherix: direct, while the orchestrator is not the way through.

Third-party agents read it, through MCP · designed.

Every exchange goes over MCP; going through the orchestrator is the target (Design). A solid line is Built, long dashes are Synthetic PoC, dots are Design.

### For the technical reader: stack, evaluation contract, observability, multi-tenant security

#### Pipeline and stack

Apaleo (OAuth2 and MCP read) + Open-Meteo + PredictHQ → Prophet forecast and staffing → pgvector memory recall (Operational Memory + Cold-start prior, research) → Claude Sonnet reasoning → WhatsApp or Email.

Stack: FastAPI, Python 3.12, Prophet, pgvector (Mistral 1024d, HNSW), Claude Sonnet (Gemini/GPT fallback), Redis (Upstash), Supabase (PostgreSQL, RLS, EU), Fly.io (Paris).

#### Built to be trusted

- Observability & metering: Every MCP tool call is one structured event. Auditable, queryable, priceable. The product is operable, not opaque.
- Multi-tenant security: hotel_id scoped at every layer (RLS, Python guards, MCP token binding), resolved server-side, never a tool input. Read-only PMS access. GDPR: Supabase EU, Hive Memory is anonymized aggregates only.

#### More

The project includes private work on the Context Graph (Design) and the Cold-start prior (Research). Public materials focus on the engineering evidence: evaluation gates, traceability, safety guardrails, privacy boundaries, and outcome measurement.

Lore, in aviation maintenance, shares this architecture and cannot close the same loop. Nothing there tells the system whether an observation was right, and the moment a technician escalates the counterfactual disappears. Aetherix has an outcome to compare against; that difference decides how much each product is allowed to learn on its own.

Field Note: https://ivandemurard.com/journal/harnesses-graders-closed-loops

Aetherix is one of five agents that talk to each other only through MCP. The architecture note says which are built and which are design: https://ivandemurard.com/architecture. Anima, the guest memory node, has its own case study: https://ivandemurard.com/anima

## Next · where Aetherix sits

### Hospitality Multi-Agent Architecture

Five specialised agents, each owning one bounded context, talking only through MCP. The page says which is built and which is design.

Aetherix, Tacet, Anima, Peritia and the orchestrator. Read the architecture: https://ivandemurard.com/architecture

## 07 · Talk

### About a pilot, or a role

Open to a first pilot hotel running Apaleo, and to AI Product Manager and Product Builder roles.

- Book a call: https://cal.com/ivandemurard/discussion-and-introduction
- Architecture repo: https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture
