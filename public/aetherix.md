# Aetherix

The F&B agent for boutique hotels.

It works inside the tools the hotel already runs, its PMS and WhatsApp: one recommendation a day, the manager's reply, the outcome recorded next to it. Built to improve with every day it runs.

- Status: Pre-pilot. Built and tested on the Apaleo sandbox and on public restaurant data. 0 real users. Being made pilot-ready; no hotel yet.
- Role: AI Product Manager and Product Builder, solo · 2026
- The architecture: https://ivandemurard.com/architecture
- GitHub: https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture
- Book a call: https://cal.com/ivandemurard/discussion-and-introduction

## TL;DR

- The problem: What a hotel knows about its own service lives in a manager's head, and leaves with them.
- The bet: One recommendation a day in WhatsApp, checked against what happened the next morning.
- Today: The loop runs daily on Maison Lumen, a fictional hotel in the Apaleo sandbox. The product is being made ready for a first pilot; no hotel yet.
- Still open: The forecast is not yet proven on hotels. No pilot hotel has signed.

How to read the status marks:

- Built: Implemented behaviour that can be inspected in the product or repository.
- Validation: A bounded test, audit or measurement. It does not prove every outcome.
- Design: A proposed direction or a prototype.

## 01 · The problem

### The knowledge leaves with the manager

Tomorrow's covers and staffing depend on what one person remembers: last year's conference week, the regulars, the weather. The result is over or under-staffing, avoidable waste and decisions made on the day.

The data exists. What is missing is the synthesis: occupancy, sales history, weather and local events turned into one recommendation for this property.

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

- Distributes: The PMS. Shares read-only data through Apaleo, and lists the integration.
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

Sandbox data, real mechanics, deterministic reruns.

#### The forecast test

Public data, 30 restaurants. Against a naive same-weekday baseline (the mean of the last four same weekdays): mean error 49.71% vs 55.86%, ahead on average. For next-day forecasts, the horizon the product uses, 28.5% vs 27.9%, slightly behind.

The test used restaurant data, without hotel occupancy, the signal the product relies on. The protocol was not pre-registered. Maison Lumen uses occupancy from Apaleo; how accurate the forecast is on a real hotel is what a pilot will measure.

#### The numbers

Kaggle Recruit, 30 Japanese restaurants out of 829, 1,193 scored points, deterministic rerun. Prophet against a naive same-weekday baseline (the mean of the last four same weekdays): mean MAPE 49.71% vs 55.86%, passing the pre-set 5-point rule. MdAPE 27.0% vs 27.6%. At J+1, 28.5% vs 27.9%. A gradient-boosted model reaches 25.6% on the median. The protocol was not pre-registered for this run.

**MAPE.** Mean absolute percentage error. The average gap between a forecast and what actually happened, expressed as a percentage, which makes errors comparable across covers, revenue, or volumes.

#### Phases

- ● Phase 0–2: Validation, observability and the Daily Receipt are done.
- ◐ Phase 3 · now: Pilot. Recruiting a pilot partner.
- ○ Phase 4: Scale: Mews, POS, Anima.
- ○ Phase 5: Revenue Orchestrator. Hive Memory stays research.

## 05 · The Decision Ledger (Built in Aetherix, Design as a shared layer)

### The outcomes layer the others do not have

This chapter is being rebuilt and is not yet written.

## 06 · How it's built (Built)

### Specified, reviewed and tested before anything ships

This chapter is being rebuilt and is not yet written. The technical content below stays public.

### For the technical reader: stack, evaluation contract, observability, multi-tenant security

#### Pipeline and stack

Apaleo (OAuth2 and MCP read) + Open-Meteo + PredictHQ → Prophet forecast and staffing → pgvector memory recall (Operational Memory + Cold-start prior, research) → Claude Sonnet reasoning → WhatsApp or Email.

Stack: FastAPI, Python 3.12, Prophet, pgvector (Mistral 1024d, HNSW), Claude Sonnet (Gemini/GPT fallback), Redis (Upstash), Supabase (PostgreSQL, RLS, EU), Fly.io (Paris).

#### Built to be trusted

- Evaluation as a contract: Qonto-inspired. Versioned golden datasets. Any change to forecasting, providers, memory or prompts needs a green eval pipeline to merge. A hard CI gate, not a habit.
- Observability & metering: Every MCP tool call is one structured event. Auditable, queryable, priceable. The product is operable, not opaque.
- Multi-tenant security: hotel_id scoped at every layer (RLS, Python guards, MCP token binding), resolved server-side, never a tool input. Read-only PMS access. GDPR: Supabase EU, Hive Memory is anonymized aggregates only.

#### More

The project includes proprietary research on cross-domain operational context and cold-start learning. Public materials focus on the engineering evidence: evaluation gates, traceability, safety guardrails, privacy boundaries, and outcome measurement.

Lore, in aviation maintenance, shares this architecture and cannot close the same loop. Nothing there tells the system whether an observation was right, and the moment a technician escalates the counterfactual disappears. Aetherix has an outcome to compare against; that difference decides how much each product is allowed to learn on its own.

Field Note: https://ivandemurard.com/journal/harnesses-graders-closed-loops

Aetherix is one of five agents that talk to each other only through MCP. The architecture note says which are built and which are design: https://ivandemurard.com/architecture. Anima, the guest memory node, has its own case study: https://ivandemurard.com/anima

## 07 · Talk

### About a pilot, or a role

Open to a first pilot hotel running Apaleo, and to AI Product Manager and Product Builder roles.

- Book a call: https://cal.com/ivandemurard/discussion-and-introduction
- Architecture repo: https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture
