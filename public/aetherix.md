# Aetherix

Persistent Operational Cognition for Hospitality. Turning scattered local experience into durable organizational intelligence. Most hotels lose critical knowledge every time a manager leaves. Aetherix builds persistent operational memory that survives turnover and grows stronger over time, while executing F&B forecasting, staffing and waste reduction as the F&B node of the Hospitality Agentic Mesh.

Cycle: Memory (recall what worked here), Prediction (calibrated for tomorrow), Action (one tap on WhatsApp), Learning (every reply sharpens the next).

Understands like a human. Measures like a machine. Remembers like an institution.

- URL: https://ivandemurard.com/aetherix
- Role: Product Builder & AI Agent Designer (solo)
- Duration: 2026, ongoing (validation phase)
- Team: Solo architect & builder
- Status: Phase 3 · Pilot. Staging live on Fly.io (Paris). Apaleo OAuth and MCP read access operational. Design partner pilot starting.
- Stack: FastAPI, Python 3.12, Prophet, pgvector (Mistral 1024d, HNSW), Claude Sonnet (Gemini/GPT fallback), Redis (Upstash), Supabase (PostgreSQL, RLS, EU), Fly.io (Paris). MCP-native.

## Problem, why it exists

In hospitality, the people who know how the property really runs (which Tuesdays spike, how a local conference reshapes breakfast, how to staff a rainy Sunday) carry that knowledge in their heads. When a manager leaves, the property starts again from scratch.

Combined with the inherent complexity of F&B operations (multiple outlets, mixed guest segments, volatile demand, labor shortages), this creates chronic inefficiencies: persistent over or under-staffing, avoidable food waste, reactive decision-making instead of anticipation, slow onboarding and inconsistent execution across properties.

Traditional systems store data. Very few build living operational memory that learns from real outcomes and makes that knowledge available at the exact moment it is needed. This is the gap Aetherix was created to close.

The underlying bottleneck is not data, it is synthesis: combining internal context (occupancy, capture rates, POS history) with external signals (weather, local events) into a recommendation calibrated to this property. Aetherix builds that synthesis automatically, learns from manager feedback, and delivers it where managers already are. Glue, not replacement.

## How the memory compounds

Day 7: cold-start. Confidence is honest about what it does not yet know. Recommendations lean on anonymized patterns from peer properties (opt-in) and on the first week of local signals.

Day 90: the receipt is sharper. Drivers are property-specific. The system has seen enough Tuesdays, enough events, enough overrides to calibrate to this exact place.

Caveat: HiveMemory is anonymized aggregates only, used as cold-start across peer properties. No cross-tenant raw data, ever. Measured gains begin with the live pilot, not the synthetic baseline.

## The Mesh, bounded context by design

Aetherix is one node in a network of specialized, MCP-native agents. Each node owns a strict bounded context and communicates only through MCP, no shared code, no monolith to displace. Aetherix executes F&B. It does not orchestrate, it does not route. An Orchestrator decides when to call it.

| Node | Role | Status |
|---|---|---|
| Aetherix | F&B execution: forecast, staffing, memory, receipts | Live (staging) |
| Tacet | Sensory: weather, noise, open data, risk | Phase 3 |
| Orchestrator | Supervisory: MCP routing, business rules, stub P3, dedicated repo P4 | Phase 3 |
| Anima | Guest Cognition Layer | Shipped (Anthropic hackathon, Jun 2026) |

## What it does

Three promises, one message a day: tomorrow's covers, staffing that fits, less waste. Every recommendation lands in WhatsApp with one tap to accept, modify, or reject.

## What the manager sees, the Daily Receipt

```
Breakfast    84 covers   ·  confidence 88%        (illustrative)
             72 rooms booked + 12 typical Tue walk-ins
             Staff: 4 FOH  (you ran 3 last Tue → 1 understaffing flag)
Driver       local conference check-ins + clear weather
Last week    forecast 79 · actual 81 · MAPE 2.5%
Reply  ✅ accept   ✏️ modify   ❌ reject
```

One tap. That reply is the signal Aetherix learns from. The day-90 receipt is sharper than the day-7 one.

## How it works, architecture

Push-first pipeline. Apaleo (OAuth2 and MCP read) + Open-Meteo + PredictHQ → Prophet forecast and staffing → pgvector memory recall (OperationalMemory + HiveMemory cold-start) → Claude Sonnet reasoning → WhatsApp or Email.

## Built to be trusted

- Evaluation as a contract (Qonto-inspired): versioned golden datasets. Any change to forecasting, providers, memory or prompts needs a green eval pipeline to merge, a hard CI gate.
- Observability and metering: every MCP tool call is one structured event, auditable, queryable, priceable.
- Multi-tenant security: hotel_id scoped at every layer (RLS, Python guards, MCP token binding), resolved server-side, never a tool input. Read-only PMS access. GDPR: Supabase EU, HiveMemory is anonymized aggregates only.

## Performance

- Forecast accuracy: 15.09% MAPE on J+1 covers, synthetic backtest, 22% gate PASS. Real-world measurement begins with the Phase 3 design partner.
- Target outcomes (90 days, live property): labor cost variance −3% to −8%, food cost per cover tracked and declining, planning time from hours to one validated message.
- Security: 14/14 gates passing.

## Roadmap

- Phase 0 Validation, done
- Phase 1 Observability, done
- Phase 2 Receipts, done
- Phase 3 Pilot, current
- Phase 4 Scale (Mews, POS, Federated HiveMemory, Context Graph, Anima), planned
- Phase 5 Vision (Revenue Orchestrator), planned

## Recent milestone, Anima PoC

Guest Cognition Layer prototype shipped at the Anthropic hackathon (Jun 2026): a 4-layer temporal memory (working, episodic, semantic, segment) with confidence-weighted claims. Production is Phase 4, DPIA-gated.

## Role and model

Solo architect and builder. Product Builder and AI Agent Designer. 2026, ongoing (validation phase). Pricing: Results-as-a-Service, outcome-based, "we win when you win." Pilots and product conversations open.

## Links

- Repository: https://github.com/IvandeMurard/aetherix-hospitality-ai
- Contact: ivandemurard@gmail.com
- Schedule: https://cal.com/ivandemurard/30min
