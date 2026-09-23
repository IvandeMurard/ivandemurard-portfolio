# Tacet: The Environmental Twin

A headless Environmental Twin for the hospitality sector. Tacet turns street, weather and crowd signals into yield rules and Chain of Thought payloads, exposed via an MCP server that any RMS, PMS or orchestration agent can consume.

Status: Built - maintenance mode since July 2026.

- URL: https://ivandemurard.com/tacet
- Role: Product Builder, Architect of an environmental intelligence layer
- Duration: 2026, ongoing (V3, MCP server and Dual Memory)
- Team: Solo (with AI collaboration)
- Context: Headless Environmental Twin for hospitality, exposed via MCP, complement to Aetherix
- Stack: Python 3.12, FastAPI, Anthropic MCP SDK, OSMnx and Shapely ray-tracing, SQLAlchemy dual-memory store, Mews and Apaleo connectors

## 1. The Problem

Revenue Management Systems and Property Management Systems run on historical booking data. They are blind to the physical and contextual future of the property's surroundings. A transport strike, an unannounced street excavation, a sudden heatwave: none of it is in the data. That blindness shows up as mispriced inventory, operational friction and avoidable refunds.

## 2. The Solution: An Environmental Twin

Tacet is a headless, predictive Environmental Twin. It acts as the sensory layer of the Hospitality Multi-Agent Architecture.

Rather than overwhelming staff with another dashboard of raw data, Tacet mathematically calculates the real-world impact of external events. It exposes this intelligence via an MCP (Model Context Protocol) server so that operational agents like Aetherix can adjust F&B and staffing, while Tacet pushes actionable yield rules directly to the RMS (Atomize, Duetto and similar) for human approval.

Three steps: Sense (proxy signals), Reason (ray-tracing physics + dual memory), Expose (MCP server with yield rules and Chain of Thought for the RMS, the PMS, or the orchestrator (Design)).

Example workflow:

> "Heatwave forecast plus rail strike on June 13. Tacet suggests minus 15% on street-facing suites for two nights, and a staffing buffer for breakfast service. Awaiting Revenue Manager approval."

## 3. Architectural Pillars

**A. Spatial Physics Engine (Acoustic Ray-Tracing).** Using shapely and osmnx, Tacet draws 3D lines of sight between a disruptive event (jackhammer, stadium crowd, traffic spike) and the property. It cross-references the path against urban building polygons. When a building blocks the source, Tacet applies a dynamic shielding penalty. False positives drop, alert fatigue disappears.

**B. Dual Memory System (Idiosyncratic + Hive Mind, Research: no network to aggregate yet).** A predictive engine must learn from its mistakes.
- Idiosyncratic memory: if a hotel manager repeatedly rejects an automated alert for "traffic noise", Tacet learns the building likely has triple-glazed windows and applies a persistent shielding bonus at that GPS coordinate.
- Hive Mind (Research: no network to aggregate yet): a statistical aggregation engine would analyse rejection rates across the global network to recalibrate baseline sensitivity for the entire ecosystem.

**C. Human-in-the-Loop Guardrail.** Tacet never executes autonomous, destructive actions like changing a price blindly. It formulates a precise Price Modifier Rule (for example, minus 15% on street-facing suites between June 12 and 14) and pushes it to the RMS for human approval. Accountability stays with the team.

**D. Conversational Explainability.** To guarantee transparency without a GUI, Tacet embeds a mathematical Chain of Thought in every JSON response. The orchestrator (Design) parses it and explains the calculation (base noise, distance attenuation, ray-tracing penalty, final impact) to the Revenue Manager in natural language.

## 4. Impact and ESG Alignment

Embedded in an agentic OS, properties shift from reactive to proactive yield and operational management.

- **Yield protection.** Pricing noisy inventory ahead of time prevents costly post-stay refunds and protects the average daily rate of the rest of the building.
- **Operational excellence.** When a heatwave overlaps with a transport strike, the orchestrator (Design) proposes F&B supply and staffing buffers before the day starts, for a manager to approve.
- **Sustainability.** Less energy waste through proactive HVAC optimisation, measurable improvement in guest well-being through proactive mitigation of urban noise pollution.

## 5. Synergy with Aetherix

Tacet exposes its rules and reasoning through MCP. [Aetherix](https://ivandemurard.com/aetherix) consumes them as one more tool in the multi-agent architecture. Until the orchestrator is built (Design), this exchange is direct: the one documented exception, non-personal, read-only, logged.

- **Aetherix (internal context):** anticipates operational needs, F&B demand and staffing based on occupancy and historical trends.
- **Tacet (external context):** reads street, weather and event signals, ray-traces their impact, publishes yield rules on MCP.

Together they let teams control costs, reduce waste and protect the experience guests came for.

## 6. Horizon

Widen the catalogue of signals (mobility, air quality, cultural events), invite more orchestration agents on the MCP layer, and let the dual memory get sharper at each property. Over time, Tacet becomes the environmental layer of an agentic OS for hospitality: each property reads its surroundings with its own context, and responds faster because of it. A Quiet Certification standard is a likely side-effect, not the goal.

[Design] Signals on the routes into the property (rail lines, stations, airports), keyed by place and time, never by person.

## Technical Stack

- **Agentic Protocol:** Anthropic MCP (Model Context Protocol) SDK
- **Language:** Python 3.12
- **Framework:** FastAPI (REST, OpenAPI)
- **Database:** SQLAlchemy / SQLite (dual-memory store)
- **Spatial Processing:** OSMnx, Shapely, GeoPandas
- **Integrations:** OAuth2, Mews Open API, Apaleo API, RMS webhooks

## Links

- Original B2C dashboard (visual reference): https://tacet.vercel.app
- Repository: https://github.com/IvandeMurard/tacet-app
- Case study source: https://github.com/IvandeMurard/tacet-app/blob/main/CASE_STUDY_V3.md
- Related: https://ivandemurard.com/aetherix
- Contact: ivandemurard@gmail.com
