# Hospitality Multi-Agent Architecture

Architecture note. Five specialised agents, each owning one bounded context, talking only through MCP.
Two are Built, one is a Synthetic PoC, two are Design. This page says which is which, using one shared status vocabulary: https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/blob/main/llms.txt

Canonical page: https://ivandemurard.com/architecture
Public meta-repository: https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture

## Where this sits

- **Aetherix** (Built, 0 real users, forecast in shadow mode, pilot partner in recruitment). The F&B node: tomorrow's covers, a staffing grid, waste risk. https://ivandemurard.com/aetherix
- **Tacet** (Built, maintenance mode since July 2026). The environmental node: turns street, weather and event signals into structured risk. Consumed by other agents through MCP, not by humans. https://ivandemurard.com/tacet
- **Anima** (Synthetic PoC, production gated behind a data-protection assessment). The guest memory node: it keeps what a guest said and what happened, so nobody has to ask twice. https://ivandemurard.com/anima
- **Peritia** (Design). The trade agent: a house's know-how, held by the house rather than by whoever is on shift. Named in the contract, no code. No page of its own.
- **Orchestrator** (Design, a proto-stub exists). The supervisory agent: a stateless router with no memory of its own. It routes between the others and holds the decision.

## 1. Why several agents and not one

The tempting shape is one large model that predicts, decides and acts. It collapses in practice,
because forecasting and acting have different failure modes, different feedback loops and different
audit requirements. A wrong forecast is absorbed by a buffer. A wrong action reaches a guest, a
shift roster, or an aircraft. Each capability became a node with a strict boundary, and the
boundaries are enforced by the protocol rather than by discipline.

## 2. One scene, four signals

Illustration, not a capability: nothing in this system performs check-in today.

Check-in looks like a process, and optimising it as one gives you the metric a process offers: time
to key. A fast, cold arrival is an excellent process and a bad welcome. Four signals meet in one
arrival, and each belongs to a different agent:

- Tacet: what is happening outside, since a transit strike lands every arrival in the same twenty minutes.
- Aetherix: how full the house is tonight, and what that does to the service that follows.
- Anima: whether this guest has stayed before and what they asked for last time. For a first stay: nothing to recall, and it says so.
- Peritia: who is on the desk, how loaded they are, how far into the shift.

This is why guest experience is not an agent of its own. An agent that owned it would have to own
all four domains, and an agent that owns everything is not a bounded context.

Time to key can be predicted. Whether someone felt welcomed cannot. That gap is a property of the
problem, not of the data, and it holds harder at check-out, which carries the payment and weighs
most in memory.

## 3. The five agents

| Agent | Status | Owns | Does not own |
| --- | --- | --- | --- |
| Aetherix | Built, 0 real users, forecast in shadow mode, pilot partner in recruitment | F&B execution: covers forecast, staffing grid, waste risk, per-property memory | Orchestration, pricing, guest-facing anything |
| Tacet | Built, maintenance mode since July 2026 | External signal: weather, street, events, ray-traced acoustic impact, yield rules | Deciding anything. It publishes rules for approval |
| Anima | Synthetic PoC, production DPIA-gated | Guest memory: what a guest said and what happened, four layers, each claim with source, confidence and age | Acting on it, or returning a whole person: every query declares one layer |
| Peritia | Design | House knowledge: what the people who work in a property know and never wrote down | Everything. It is a named slot in the contract, and no code |
| Orchestrator | Design, stateless router, no memory | Supervisory routing and business rules across agents | Domain logic and memory. It routes, it does not compute and it stores nothing |

Fig. 3.1, on the web page, wires the four domain agents to the orchestrator at the centre: a solid spoke for what is built, a dashed spoke for what is designed and not written. The orchestrator holds no memory of its own; state stays with the agent that owns it, and no agent talks to another. Selecting a mark shows what that agent owns and what it does not own, with the same wording as the table above.

Aetherix executes. It does not orchestrate.


## 4. Five rules that hold it together

1. **One bounded context per node.** A node that owns two domains arbitrates between them privately,
   and the arbitration stops being reviewable.
2. **MCP is the only doorway.** Nodes do not import each other. Every exchange is a tool call, so
   every exchange is loggable, auditable and priceable, and a node can be replaced without its
   neighbours knowing. Until the orchestrator is built (Design), Tacet's output reaches Aetherix
   directly: the one documented exception, non-personal, read-only, logged. Target: every exchange
   goes through the orchestrator.
3. **Tenancy is resolved server-side, never passed as an argument.** The property identifier is
   established by the server at every layer. What a model cannot name, it cannot cross.
4. **Memory is local first, federated second, and never raw.** Each property learns from its own
   history; cross-property learning moves only as anonymised aggregates. Local memory is as
   described. Federation: Research, no substrate yet.
5. **A fifth agent is an addition, not a redesign.** The contract that governs exchanges between
   agents was designed to admit staff knowledge: what the people who work in a property know, which
   nothing captures today. That agent is named Peritia, the trade agent: a house's know-how, held by
   the house rather than by whoever is on shift. Not started, and no code.

## 5. What each node is allowed to learn

| Node | Feedback available | Consequence |
| --- | --- | --- |
| Aetherix | Manager replies, plus forecast compared against the actual figure | Can measure itself and gate on the result |
| Tacet | Rejections of its alerts, per coordinate | Learns local shielding without ground truth on the outcome |
| Anima | Guest signals, sparse and regulated | Learns slowly by design, and must forget on request |
| Orchestrator | None of its own | Judged only by whether the nodes it routed to were right |

A node with an outcome loop can be allowed to adjust itself. A node without one has to be gated
before it ships, because nothing downstream will catch it. See the field note
https://ivandemurard.com/journal/harnesses-graders-closed-loops

## 6. Where the sector's twins stop

Digital twins are mature elsewhere: market scenarios in banking, data centres at Google, warehouses
at Amazon, decades of aerospace and automotive use. In hospitality they model the building:
predictive maintenance, refurbishment simulation, energy optimisation. Searching for one that
simulates the impact of an operational decision before it is taken, a staffing change, an F&B order,
a service adjustment, returns nothing. The sector models its assets and not its arbitrations. This
architecture is not marketed as a twin and does not simulate scenarios today. Anima included: a
guest memory, not a twin.

## 7. Verification and pointers

The statuses above are the claim. Here is where to check them.

Public meta-repository: https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture

The field note "Evaluating LLM agents: how would you know it had stopped working?" explains how a
system earns the right to ship. This page explains what the systems are.
https://ivandemurard.com/journal/harnesses-graders-closed-loops

Contact: ivandemurard@gmail.com, https://cal.com/ivandemurard/discussion-and-introduction

## Query this architecture from your agent

The five agents talk over MCP. So does this site: a public, read-only MCP server exposes the case studies, the field notes and the bio as tools.

claude mcp add ivandemurard --transport http https://lzzlepzecynpztipkdcu.supabase.co/functions/v1/mcp
