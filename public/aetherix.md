# Aetherix

F&B Execution Node of the Hospitality Agentic Mesh. Anticipates staffing and F&B needs in real time, reduces food waste and operating costs, frees teams to focus on guest experience. MCP-native, callable by any other agent in the stack.

- URL: https://ivandemurard.com/aetherix
- Role: Product Builder and AI Agent Designer (side project)
- Duration: 2026, ongoing (validation phase)
- Team: Solo architect and builder
- Status: MCP Server v0 shipped. Staging live on Fly.io (Paris). Apaleo OAuth and MCP read access operational. Design partner pilot starting (Phase 3).
- Stack: Apaleo PMS, FastAPI, Prophet, pgvector, HiveMemory, LLMProvider (Claude Sonnet primary, Gemini and GPT fallback), Model Context Protocol (MCP), WhatsApp push.

## The Mesh

Aetherix does not orchestrate. It executes. It is one node of the Hospitality Agentic Mesh, a constellation of specialized AI agents communicating exclusively via MCP.

- Aetherix (Live): F&B Execution Node, forecast, staffing, memory, receipts.
- Tacet (Phase 3): Sensory Node, weather, noise, public events, structured signals.
- Orchestrator (Phase 3): Supervisory Agent, routes between nodes, applies hotel business rules.
- Anima (Phase 4): Guest Context Node, relational memory (emotional state, flight delays, CRM history).

The whole system plugs into PMS Agent Hubs (Apaleo today, Mews next) like LEGO, rather than replacing them.

## What it is

Aetherix is a contextual intelligence layer that sits next to a boutique hotel's PMS. It reads occupancy, calendar, weather and local event signals, forecasts staffing and F&B demand, then pushes a small set of recommended actions to the team via WhatsApp. API-first and human-in-the-loop: the agent recommends, the manager decides.

## Why it exists

Boutique hotel operations are not a scheduling problem, they are an attention problem. Managers spend their best hours reconciling spreadsheets, occupancy reports and supplier orders instead of being present with guests and teams. Aetherix exists to absorb the reconciliation work so hospitality can be felt, not engineered.

## How it works

1. Apaleo PMS provides the operational truth (occupancy, arrivals, segment mix) via OAuth.
2. A forecasting layer (Prophet plus contextual features) projects staffing and F&B needs.
3. pgvector recalls how similar days played out across the property's own history. HiveMemory adds anonymized patterns from peer hotels in the same segment.
4. LLMProvider routes reasoning to Claude Sonnet (primary), with Gemini and GPT on fallback, and explains the prediction in plain language.
5. The MCP Server v0 exposes Aetherix as a callable tool (three atomic tools, multi-tenant by design) for orchestration agents and the Apaleo Agent Hub.
6. The recommendation lands in the team's WhatsApp with a one-tap accept, adjust, or override.

## Aetherix and Tacet

Two nodes of the same Mesh. Aetherix reads PMS, occupancy, F&B, staffing. Tacet reads the world outside: weather, noise, public events. The Orchestrator combines both into a single decision. Example: if Tacet detects 65dB roadworks tomorrow morning, Aetherix adjusts staffing for the in-room breakfast surge it anticipates.

## Convictions

- API-first, no vendor lock-in. MCP is the only interface.
- Context beats raw model capability. The win is in fusing external signals with internal truth.
- Predictions must be explainable. Managers see the historical scenarios used, not just numbers.
- Humans remain in the loop on every recommendation that affects staff or guests.

## Links

- Repository: https://github.com/IvandeMurard/aetherix-hospitality-ai
- Contact: ivandemurard@gmail.com
- Schedule: https://cal.com/ivandemurard/30min
