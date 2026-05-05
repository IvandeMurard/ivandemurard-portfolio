# Aetherix

Agentic AI framework for boutique hotel operations. Anticipates staffing and F&B needs in real time, reduces food waste and operating costs, frees teams to focus on guest experience.

- URL: https://www.ivandemurard.com/aetherix
- Role: Product Builder and AI Agent Designer (side project)
- Duration: 2026, ongoing (validation phase)
- Team: Solo architect and builder
- Status: End-to-end pipeline operational in sandbox. Apaleo OAuth and MCP read access live. Outbound MCP server in progress.
- Stack: Apaleo PMS, FastAPI, Prophet, RAG with Claude Sonnet, Model Context Protocol (MCP), WhatsApp push.

## What it is
Aetherix is a contextual intelligence layer that sits next to a boutique hotel's PMS. It reads occupancy, calendar, weather and local event signals, forecasts staffing and F&B demand, then pushes a small set of recommended actions to the team via WhatsApp. It is API-first and human-in-the-loop: the agent recommends, the manager decides.

## Why it exists
Boutique hotel operations are not a scheduling problem, they are an attention problem. Managers spend their best hours reconciling spreadsheets, occupancy reports and supplier orders instead of being present with guests and teams. Aetherix exists to absorb the reconciliation work so hospitality can be felt, not engineered.

## How it works
1. Apaleo PMS provides the operational truth, occupancy, arrivals, segment mix, via OAuth.
2. A forecasting layer (Prophet plus contextual features) projects staffing and F&B needs.
3. A semantic reasoning layer (RAG over historical scenarios with Claude Sonnet) explains the prediction in plain language and surfaces comparable past situations.
4. A contextual agent, exposed as an MCP-callable tool, composes the recommendation.
5. An outbound MCP server lets other agents and clients query Aetherix as a tool.
6. The recommendation lands in the team's WhatsApp with a one-tap accept, adjust, or override.

## Convictions
- API-first, no vendor lock-in.
- Context beats raw model capability. The win is in fusing external signals with internal truth.
- Predictions must be explainable. Managers see the historical scenarios used, not just numbers.
- Humans remain in the loop on every recommendation that affects staff or guests.

## Links
- Repository: https://github.com/IvandeMurard/aetherix-hospitality-ai
- Contact: ivandemurard@gmail.com
- Schedule: https://cal.com/ivandemurard/30min
