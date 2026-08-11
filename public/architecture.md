# The Hospitality Agentic Mesh

Architecture note. Specialised agents, each owning one bounded context, talking only through MCP.
One is built, one is a prototype, one is a design, one is a stub. This page says which is which.

Canonical page: https://ivandemurard.com/architecture
Public meta-repository: https://github.com/IvandeMurard/hospitality-agentic-mesh

## Where this sits

- **Aetherix** (built and instrumented, pilot partner in recruitment). The F&B node: tomorrow's covers, a staffing grid, waste risk. https://ivandemurard.com/aetherix
- **Tacet** (prototype, public repository). The environmental node: turns street, weather and event signals into structured risk. Consumed by other agents through MCP, not by humans. https://ivandemurard.com/tacet
- **Anima** (synthetic proof of concept, production gated behind a data-protection assessment). The guest node: a four-layer temporal memory of a guest relationship. No page of its own.
- **Orchestrator** (design, a stub exists). The supervisory node: routes between the others and holds the decision.
- **Lore** (outside the mesh). The same architecture in aviation maintenance, where a licensed technician signs the release. https://ivandemurard.com/lore

## 1. Why a mesh and not one agent

The tempting shape is one large model that predicts, decides and acts. It collapses in practice,
because forecasting and acting have different failure modes, different feedback loops and different
audit requirements. A wrong forecast is absorbed by a buffer. A wrong action reaches a guest, a
shift roster, or an aircraft. Each capability became a node with a strict boundary, and the
boundaries are enforced by the protocol rather than by discipline.

## 2. One scene, four signals

Illustration, not a capability: nothing in this system performs check-in today.

Four signals meet in one arrival. How full the house is tonight. What is happening outside, since a
transit strike means every arrival lands in the same twenty minutes. Whether this guest has stayed
before and what they had to ask for last time. And who is on the desk, how loaded they are, how far
into the shift.

Model it as a process and you optimise the metric a process offers: time to key. A fast, cold
arrival is an excellent process and a bad welcome.

This is why guest experience is not a fifth node. It is a layer that crosses the others, because the
same twenty minutes are simultaneously an occupancy fact, an external-context fact, a memory fact
and a staffing fact. A node that owned "guest experience" would have to own all four, and a node
that owns everything is not a bounded context.

Time to key can be predicted. Whether someone felt welcomed cannot. The gap between what is
measurable and what matters is a property of the problem. The same holds harder at check-out, which
carries the payment and weighs more in memory, and is the moment most often optimised for speed
alone.

## 3. The nodes

| Node | Status | Owns | Does not own |
| --- | --- | --- | --- |
| Aetherix | Built and instrumented, pilot partner in recruitment | F&B execution: covers forecast, staffing grid, waste risk, per-property memory | Orchestration, pricing, guest-facing anything |
| Tacet | Prototype | External signal: weather, street, events, ray-traced acoustic impact, yield rules | Deciding anything. It publishes rules for approval |
| Anima | Design, prototype shipped | Guest cognition: temporal memory, confidence-weighted claims | Acting on what it knows. Production is DPIA-gated |
| Orchestrator | Stub | Supervisory routing and business rules across nodes | Domain logic. It routes, it does not compute |

Aetherix executes. It does not orchestrate.

## 4. Five rules that hold it together

1. **One bounded context per node.** A node that owns two domains arbitrates between them privately,
   and the arbitration stops being reviewable.
2. **MCP is the only doorway.** Nodes do not import each other. Every exchange is a tool call, so
   every exchange is loggable, auditable and priceable, and a node can be replaced without its
   neighbours knowing.
3. **Tenancy is resolved server-side, never passed as an argument.** The property identifier is
   established by the server at every layer. What a model cannot name, it cannot cross.
4. **Memory is local first, federated second, and never raw.** Each property learns from its own
   history; cross-property learning moves only as anonymised aggregates.
5. **A fifth node is an addition, not a redesign.** The contract that governs exchanges between
   nodes was designed to admit staff knowledge: what the people who work in a property know, which
   no node captures today. The pattern comes from my other project, Lore. The fifth node is Peritia,
   the trade node: a house's know-how, held by the house rather than by whoever is on shift. Not
   started. The contract admits it, and Lore is the working proof of the pattern in another industry.

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
mesh is not marketed as a twin and does not simulate scenarios today.

## 7. The same architecture outside hospitality

Lore is this architecture in aviation maintenance, under a stricter regime. It captures oral
expertise, retrieves it behind the governing procedure, and hands the decision to a licensed
technician who signs the release. What it does not have is the loop: nothing tells it whether a
captured observation was right, and the moment a technician escalates, the counterfactual
disappears. That absence is why its evaluation harness weighs close to a third of its codebase.

Lore stays outside the mesh. A staff-knowledge node inside the mesh is a reasonable thing to build
later, and the contract has room for it. It would be a different node.

The mesh is not a hospitality pattern. It is what you build when a decision has to stay attributable
to a component and to a person.

## 8. Where it stands

- Aetherix: built and instrumented, on staging, pilot partner in recruitment.
- Tacet: working prototype, own case study, public repository.
- Anima: prototype shipped at a hackathon on synthetic data, production gated behind a
  data-protection assessment, no page of its own yet.
- Orchestrator: a stub. It does not yet deserve a page.
- Lore: outside the mesh, as evidence the pattern holds elsewhere.

Contact: ivandemurard@gmail.com, https://cal.com/ivandemurard/discussion-and-introduction
