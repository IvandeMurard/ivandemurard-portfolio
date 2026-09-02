# Aetherix

The F&B execution agent for boutique hotels. Tomorrow's covers, a staffing grid that fits, and less waste: one message a day, in WhatsApp, with the reasoning attached. Aetherix is the F&B agent of the Hospitality Agentic Mesh, a five-agent architecture: https://ivandemurard.com/architecture

Three promises, with honesty labels: Tomorrow's covers runs daily against real data; operator delivery begins with the pilot. It anticipates how many breakfasts, lunches and dinners to expect, with a confidence score and the drivers behind it. Staffing that fits (Pilot hypothesis) proposes a shift grid based on occupancy, capture-rate history and local context; the manager approves, adjusts or overrides. Less waste (Target outcome) spots over-ordering risk before purchase, with the historical signals that triggered the flag. Staffing and waste are hypotheses a pilot would test, not measured results.

Thesis. Understand, like a human: contextual reasoning grounded in each property's history. Measure, like a machine: every recommendation is stored next to its real outcome, so the system knows what it said and what happened. Learn, like a network: per-property memory today, federated priors next, to give independents the power of a hive.

Vision, five agents with honest status: Aetherix, the F&B agent (forecast, staffing, memory), Built. Tacet, the environmental-signal agent, Built. Anima, the Guest Cognition agent, Synthetic PoC. Peritia, the trade agent (house knowledge), Not started. Orchestrator, the supervisory agent, Stub.

Operational memory is not the offer, it is the mechanism that makes the forecast specific to one property rather than generic. Cycle: Memory (recall what worked here), Prediction (calibrated for tomorrow), Action (one tap on WhatsApp), Learning (every reply is recorded as feedback; the pilot tests whether it improves future recommendations).

Contrast with Lore: Lore, in aviation maintenance, shares this architecture and cannot close the same loop. Nothing there tells the system whether an observation was right, and the moment a technician escalates the counterfactual disappears. Aetherix has an outcome to compare against; that difference decides how much each product is allowed to learn on its own.

- URL: https://ivandemurard.com/aetherix
- Role: Product Builder & AI Agent Designer (solo)
- Duration: 2026, ongoing (validation phase)
- Team: Solo architect & builder
- Status: Phase 3 · Pilot design partner in recruitment. Go-live targeted end of September. Staging live on Fly.io (Paris). Apaleo OAuth and MCP read access operational. MCP Server v0 is live.
- Stack: FastAPI, Python 3.12, Prophet, pgvector (Mistral 1024d, HNSW), Claude Sonnet (Gemini/GPT fallback), Redis (Upstash), Supabase (PostgreSQL, RLS, EU), Fly.io (Paris). MCP-native.

## The loop that learns

Every day, the same loop deposits one more grain of calibrated experience into the property's operational memory.

- Memory. Recall what worked here, on similar days, in similar contexts. Local history first, plus generic cross-property context patterns while local history is thin. A true federated cohort prior (HiveMemory) is research, Phase 4+.
- Prediction. A calibrated forecast for tomorrow: covers, staffing, waste risk, with the drivers behind it.
- Action. One message on WhatsApp. Accept, modify, or reject in one tap. No new dashboard to learn.
- Learning. Every reply is a signal. The day-90 receipt is sharper than the day-7 one.

Day 7: cold-start. Confidence is honest. Recommendations lean on generic context patterns and the first week of local signals.
Day 90 (expected, not measured): drivers become property-specific, calibrated by enough Tuesdays, events and overrides to fit this exact place. This is the hypothesis the pilot tests.

Caveat: a true federated cohort prior (HiveMemory) is research, targeted for Phase 4 and beyond, and would remain anonymized aggregates only. No cross-tenant raw data, ever. Measured gains begin with the live pilot, not the synthetic baseline.

## Problem, why it exists

In hospitality, the people who know how the property really runs (which Tuesdays spike, how a local conference reshapes breakfast, how to staff a rainy Sunday) carry that knowledge in their heads. When a manager leaves, the property starts again from scratch.

Combined with the inherent complexity of F&B operations (multiple outlets, mixed guest segments, volatile demand, labor shortages), this creates chronic inefficiencies: persistent over or under-staffing, avoidable food waste, reactive decision-making instead of anticipation, slow onboarding and inconsistent execution across properties.

The underlying bottleneck is not data, it is synthesis: combining internal context (occupancy, capture rates, POS history) with external signals (weather, local events) into a recommendation calibrated to this property. Aetherix builds that synthesis automatically, learns from manager feedback, and delivers it where managers already are. Glue, not replacement.

## What it already does

- States its drivers the evening before, then reports its own miss the next morning, in plain language.
- Flagged a corrupted POS export rather than training on it.
- Named its own drift after three consecutive misses, and recovered from a 25% regime shift through weekly recalibration.
- Stores every recommendation next to what actually happened, with the manager's override recorded beside it.
- Blocks its own merges on evaluation exit codes; every guardrail trip carries a machine-readable reason.

Sandbox data, real mechanics, deterministic reruns.

## What it does

Three promises, one message a day: tomorrow's covers (running daily against real data, operator delivery begins with the pilot), staffing that fits (pilot hypothesis), less waste (target outcome). Every recommendation lands in WhatsApp with one tap to accept, modify, or reject.

## The Daily Receipt

```
Breakfast    84 covers   ·  confidence 88%        (illustrative)
             72 rooms booked + 12 typical Tue walk-ins
             Staff: 4 FOH  (you ran 3 last Tue → 1 understaffing flag)
Driver       local conference check-ins + clear weather
Last week    forecast 79 · actual 81 · MAPE 2.5%
Reply  ✅ accept   ✏️ modify   ❌ reject
```

One tap. That reply is the signal Aetherix learns from.

## The Mesh, bounded context by design

Aetherix is one of five specialized, MCP-native agents. Each agent owns a strict bounded context and communicates only through MCP. Aetherix executes F&B. It does not orchestrate.

| Agent | Role | Status |
|---|---|---|
| Aetherix | F&B execution: forecast, staffing, memory, receipts | Built and instrumented, pilot partner in recruitment |
| Tacet | Sensory: weather, noise, open data, risk | Built |
| Anima | Guest Cognition Layer | Synthetic PoC, hackathon prototype (Jun 2026); production DPIA-gated |
| Peritia | House knowledge: what the people who work in a property know | Named in the contract, not started |
| Orchestrator | Supervisory: MCP routing, business rules. Stub in Phase 3, dedicated repo in Phase 4 | Phase 3, stub |

Meta-repo (public): https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture

## Aetherix ↔ Tacet, MCP handshake

Aetherix owns internal context (occupancy, F&B, staffing). Tacet owns external context (noise, weather, events). An Orchestrator calls both. Together they form one predictive twin for the property.

## Architecture

Push-first pipeline. Apaleo (OAuth2 and MCP read) + Open-Meteo + PredictHQ → Prophet forecast and staffing → pgvector memory recall (OperationalMemory + HiveMemory cold-start, research) → Claude Sonnet reasoning (Gemini/GPT fallback) → WhatsApp or Email.

MCP Server v0 is live on Fly.io (Paris), three atomic tools, multi-tenant.

## Built to be trusted

- Evaluation as a contract (Qonto-inspired): versioned golden datasets. Any change to forecasting, providers, memory or prompts needs a green eval pipeline to merge, a hard CI gate.
- Observability and metering: every MCP tool call is one structured event, auditable, queryable, priceable.
- Multi-tenant security: hotel_id scoped at every layer (RLS, Python guards, MCP token binding), resolved server-side, never a tool input. Read-only PMS access. GDPR: Supabase EU, HiveMemory is anonymized aggregates only.

## Where we are, honestly

- Phase 3 · Pilot design partner in recruitment. Go-live targeted end of September. Real-world measurement begins with the pilot.
- Target labor cost variance: −3% to −8% over 90 days on a live property. Target, not measured yet.
- Security gates: 14/14 passing.

Calibration baseline (synthetic backtest, not a headline): MAPE 15.09% on J+1 covers, 22% gate PASS. Real-world measurement begins with the pilot.

## What remains private

The project includes proprietary research on cross-domain operational context and cold-start learning. Public materials focus on the engineering evidence: evaluation gates, traceability, safety guardrails, privacy boundaries, and outcome measurement.

## Roadmap

- Phase 0 Validation, done
- Phase 1 Observability, done
- Phase 2 Receipts, done
- Phase 3 Pilot, current
- Phase 4 Scale (Mews, POS, Federated HiveMemory, Context Graph, Anima), planned
- Phase 5 Vision (Revenue Orchestrator), planned

## Anima, sister node

Guest Cognition Layer, a Synthetic PoC built at the Anthropic hackathon (Jun 2026): a 4-layer temporal memory (working, episodic, semantic, segment) with confidence-weighted claims. Production is Phase 4, DPIA-gated.

## Role and model

Solo architect and builder. Product Builder and AI Agent Designer. 2026, ongoing (validation phase). Pricing: Results-as-a-Service, outcome-based, "we win when you win." Pilots and product conversations open.

## Links

- Mesh (public): https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture
- Contact: ivandemurard@gmail.com
- Schedule: https://cal.com/ivandemurard/discussion-and-introduction
