# Aetherix

The F&B agent for boutique hotels.

One message a day in WhatsApp. The manager replies. The outcome is recorded next to it.

- Type: AI agent · Boutique hotel operations · 2026
- Role: Product Builder and AI Agent Designer, solo
- Status: Built. Running on sandbox and public data. No hotel connected yet.
- The architecture: https://ivandemurard.com/architecture
- GitHub: https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture
- Book a call: https://cal.com/ivandemurard/discussion-and-introduction

## Sec. 01 · In one minute

| | |
| --- | --- |
| For | F&B managers in independent boutique hotels |
| Does | Sends tomorrow's covers and staffing the evening before, then records what happened |
| Where | WhatsApp. No dashboard, no training |
| Plugs into | The PMS, through Apaleo's open API |
| Next | A first pilot hotel running Apaleo |

## Sec. 02 · The problem

**What a hotel knows about its own service lives in a manager's head, and leaves with them.**

The result, day to day:

- Persistent over or under-staffing
- Avoidable food waste
- Reactive decision-making instead of anticipation
- Slow onboarding and inconsistent execution across properties

The bottleneck is not data, it is synthesis: combining occupancy and sales history with weather and local events into one recommendation for this property.

## Sec. 03 · Product strategy

**Understand a property the way its manager does, and measure every recommendation against what happened.**

Five decisions follow from that.

| # | Decision | Why |
| --- | --- | --- |
| 1 | Distribution before design | A hotel floor has no time for a new tool. So the product plugs into the PMS and is built to be listed where hotels already pick their integrations |
| 2 | F&B first | A covers forecast has a result the next morning. It can be checked |
| 3 | WhatsApp as the only surface | It shows the recommendation, keeps a human line to the manager, and records the reply the agent learns from |
| 4 | Three parties, not one customer | The F&B manager uses it. Hotel management pays. The PMS distributes |
| 5 | Pricing on results, to start | With no track record, the builder carries the adoption risk. The later model is undecided |

Who uses, who pays, who distributes: PMS (Apaleo) → Aetherix, data, read-only · listing; Aetherix → F&B manager, daily message; F&B manager → Aetherix, reply; Hotel management → Aetherix, contract.

### Unproven

- No hotel or PMS has validated this route yet.
- The platform could build the same thing.
- Pricing on labor cost needs payroll data the PMS does not hold.

## Sec. 04 · How it works

**Every day adds one record: what was recommended, what the manager said, what happened.**

### The daily loop

1. Evening: Aetherix sends tomorrow's covers and staffing, with the reasons.
2. Reply: The manager accepts, rejects, or gives the right figure.
3. Next morning: The real outcome is stored next to the recommendation.
4. Adjust: The agent recalibrates on the gap.

Free-text replies are not used yet. Whether the agent gets sharper over time is what a pilot would test.

### What the manager receives

```text
Breakfast    84 covers
             72 rooms booked + 12 typical Tue walk-ins
             Staff: 4 front of house (you ran 3 last Tue)
Driver       local conference check-ins + clear weather
```

Mock-up of the message format. The figures are invented for illustration.

## Sec. 05 · What it does today

**One output runs daily. Two are hypotheses a pilot would test.**

### Already working

- States its drivers the evening before, then reports its own miss the next morning, in plain language.
- Rejected an implausible POS figure (900 covers, injected as a test) instead of learning from it.
- When recent data diverges sharply from history, says so in the message and asks the manager to double-check, instead of sending a confident number.
- After a simulated 25% jump in demand, weekly recalibration cut the forecast error from 15.9% to 12.3%.
- Stores every recommendation next to what actually happened, with the manager's override recorded beside it.
- Blocks its own merges on evaluation exit codes; every guardrail trip carries a machine-readable reason.

Sandbox data, real mechanics, deterministic reruns.

### Three outputs

| Output | State |
| --- | --- |
| Tomorrow's covers, with confidence and reasons | Running daily on sandbox data |
| Staffing that fits, approved or overridden by the manager | Pilot hypothesis |
| Less waste, by flagging over-ordering before purchase | Target outcome |

## Sec. 06 · Where it stands

**The loop is built and testable. The forecast is not yet proven on hotels.**

| | |
| --- | --- |
| Hotels connected | None. No pilot partner signed, no go-live date |
| Forecast test | Public data, 30 restaurants. Beats a simple "same weekday last week" guess on average. Matches it on a typical day. Slightly behind it for next-day forecasts, the horizon the product uses |
| Limit of that test | Restaurants, not hotels. No occupancy data, the signal the product relies on |
| What is solid today | The loop: recommendation, reply, outcome, and the checks that guard them |

### The numbers

Kaggle Recruit, 30 Japanese restaurants out of 829, 1,193 scored points, deterministic rerun. Prophet against a naive same-weekday baseline: mean MAPE 49.71% vs 55.86%, passing the pre-set 5-point rule. MdAPE 27.0% vs 27.6%. At J+1, 28.5% vs 27.9%. A gradient-boosted model reaches 25.6% on the median. The protocol was not pre-registered for this run.

### Roadmap

- Phase 0: Validation, done
- Phase 1: Observability, done
- Phase 2: Receipts, done
- Phase 3: Pilot, current. Recruiting pilot partner.
- Phase 4: Scale, planned. Mews · POS · Federated HiveMemory · Context Graph · Anima
- Phase 5: Vision, planned. Revenue Orchestrator

### Product vision

Today each hotel learns from its own history. The longer-term idea is that independent hotels learn from each other through HiveMemory, a layer of shared anonymised patterns, and get the reach of a group without joining one.

Status: Research, not built.

## Sec. 07 · How it's built

**Not vibe-coded. Specified, reviewed and tested before anything ships.**

- **Spec before code, with the BMAD method.** Every feature follows the path of a real product team: product requirements, architecture, epics, then one written story per change. Each step is run by a dedicated AI role: analyst, product manager, architect, scrum master, developer, QA. Code comes last.
- **I direct the agents; I own the result.** AI agents build from those stories, inside the decisions I set for them (34 so far). I review what they deliver and decide what ships.
- **Nothing merges without passing its tests.** A fixed set of real-world scenarios checks every change. If quality drops, the change is blocked automatically.
- **A weekly self-audit.** Every Monday, an agent checks that what the project claims still matches what it does, and proposes corrections for me to approve.
- **Honest about what is unfinished.** Every component is labelled Built, Synthetic PoC, Design or Research. No demo dressed up as a product.

## Sec. 08 · Under the hood

**For the technical reader: how it is built, and how it is kept honest.**

### Architecture

Aetherix is one of five agents. Each owns one job and talks to the others only through MCP. Aetherix executes F&B. It does not orchestrate.

| Agent | Role | Status |
| --- | --- | --- |
| Aetherix | F&B execution: forecast, staffing, memory, receipts | Built. Running on sandbox and public data. No hotel connected yet. |
| Tacet | Sensory: weather, noise, open data, risk | Built, maintenance mode since July 2026 |
| Anima | Guest memory node | Synthetic PoC, production DPIA-gated |
| Peritia | House knowledge | Design |
| Orchestrator | Supervisory routing and business rules | Design, proto-stub |

Anima, the guest memory node, has its own case study: https://ivandemurard.com/anima

### Pipeline and stack

Apaleo (OAuth2 and MCP read) + Open-Meteo + PredictHQ → Prophet forecast and staffing → pgvector memory recall (OperationalMemory + HiveMemory cold-start, research) → Claude Sonnet reasoning → WhatsApp or Email.

Stack: FastAPI, Python 3.12, Prophet, pgvector (Mistral 1024d, HNSW), Claude Sonnet (Gemini/GPT fallback), Redis (Upstash), Supabase (PostgreSQL, RLS, EU), Fly.io (Paris).

### Built to be trusted

- Evaluation as a contract: Qonto-inspired. Versioned golden datasets. Any change to forecasting, providers, memory or prompts needs a green eval pipeline to merge. A hard CI gate, not a habit.
- Observability & metering: Every MCP tool call is one structured event. Auditable, queryable, priceable. The product is operable, not opaque.
- Multi-tenant security: hotel_id scoped at every layer (RLS, Python guards, MCP token binding), resolved server-side, never a tool input. Read-only PMS access. GDPR: Supabase EU, HiveMemory is anonymized aggregates only.

### More

The project includes proprietary research on cross-domain operational context and cold-start learning. Public materials focus on the engineering evidence: evaluation gates, traceability, safety guardrails, privacy boundaries, and outcome measurement.

Lore, in aviation maintenance, shares this architecture and cannot close the same loop. Nothing there tells the system whether an observation was right, and the moment a technician escalates the counterfactual disappears. Aetherix has an outcome to compare against; that difference decides how much each product is allowed to learn on its own.

Field Note: https://ivandemurard.com/journal/harnesses-graders-closed-loops

## Sec. 09 · Talk about a pilot

Solo builder. Open to a first pilot hotel running Apaleo, and to product conversations.

- Book a call: https://cal.com/ivandemurard/discussion-and-introduction
- Architecture repo: https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture
- Read Tacet: https://ivandemurard.com/tacet