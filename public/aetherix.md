# Aetherix

Persistent Operational Cognition for Hospitality. Turning scattered local experience into durable organizational intelligence. Most hotels lose critical knowledge every time a manager leaves. Aetherix builds persistent operational memory that survives turnover and grows stronger over time, while executing F&B forecasting, staffing and waste reduction as the F&B node of the Hospitality Agentic Mesh.

Cycle: Memory (recall what worked here), Prediction (calibrated for tomorrow), Action (one tap on WhatsApp), Learning (every reply is recorded as feedback; the pilot tests whether it improves future recommendations).

Understands like a human. Measures like a machine. Remembers like an institution.

- URL: https://ivandemurard.com/aetherix
- Role: Product Builder & AI Agent Designer (solo)
- Duration: 2026, ongoing (validation phase)
- Team: Solo architect & builder
- Status: Phase 3 · Pilot. Staging live on Fly.io (Paris). Apaleo OAuth and MCP read access operational. MCP Server v0 is live. Design partner pilot starting.
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

## What it does

Three promises, one message a day: tomorrow's covers (shipped, in pilot), staffing that fits (pilot hypothesis), less waste (target outcome). Two of the three are not measured results yet. Every recommendation lands in WhatsApp with one tap to accept, modify, or reject.

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

Aetherix is one node in a network of specialized, MCP-native agents. Each node owns a strict bounded context and communicates only through MCP. Aetherix executes F&B. It does not orchestrate.

| Node | Role | Status |
|---|---|---|
| Aetherix | F&B execution: forecast, staffing, memory, receipts | Live (staging) |
| Tacet | Sensory: weather, noise, open data, risk | Phase 3 |
| Orchestrator | Supervisory: MCP routing, business rules. Stub in Phase 3, dedicated repo in Phase 4 | Phase 3, stub |
| Anima | Guest Cognition Layer | Synthetic PoC, hackathon prototype (Jun 2026); production DPIA-gated |

Meta-repo (public): https://github.com/IvandeMurard/hospitality-agentic-mesh

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

- Phase 3 · Pilot. Design partner starting. Real-world measurement begins now.
- Target labor cost variance: −3% to −8% over 90 days on a live property. Target, not measured yet.
- Security gates: 14/14 passing.

Calibration baseline (synthetic backtest, not a headline): MAPE 15.09% on J+1 covers, 22% gate PASS. Real-world MAPE begins with the pilot.

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

Guest Cognition Layer, a synthetic proof of concept built at the Anthropic hackathon (Jun 2026): a 4-layer temporal memory (working, episodic, semantic, segment) with confidence-weighted claims. Production is Phase 4, DPIA-gated.

## Role and model

Solo architect and builder. Product Builder and AI Agent Designer. 2026, ongoing (validation phase). Pricing: Results-as-a-Service, outcome-based, "we win when you win." Pilots and product conversations open.

## Links

- Mesh (public): https://github.com/IvandeMurard/hospitality-agentic-mesh
- Contact: ivandemurard@gmail.com
- Schedule: https://cal.com/ivandemurard/discussion-and-introduction
