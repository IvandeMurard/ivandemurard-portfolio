# Anima

> Memory that means no guest has to ask twice.

Keeps what a guest said and what happened, so nobody asks twice, without watching.

Status: Synthetic PoC. Production gated behind a data-protection assessment.
URL: https://ivandemurard.com/anima

## 1. The questions it exists to answer

Four questions a general manager can ask out loud and nobody in the building can answer:

- What does this property know about a guest that nobody ever wrote down?
- What did we learn last stay that we will fail to use during this one?
- What does a guest have to repeat every single time, and what does that cost us?
- Which of the things we believe about them did they tell us, and which did we infer?

In practice: a guest asked for a quiet room on three consecutive stays, and had to ask again on the fourth.

The fourth one separates this from a customer database. A property that cannot tell what a guest said from what a system inferred has already lost the argument it will eventually have with the guest, or with a regulator.

## 2. Where it stands, and what the gate is for

Fig. 2.1, the road and the gate on it, three steps:

| Step | State | What it holds |
|---|---|---|
| Now | Synthetic PoC | Synthetic proof of concept: four memory layers, MCP server, evaluated on a synthetic cohort |
| Gate | Design | Data-protection assessment, before the first real guest datum, not before the build. No real guest until it clears |
| Phase 4 | Design | Production: real guests, real stays, only on the far side of the gate |

**An employee can be told they are being modelled. A guest cannot meaningfully consent to being modelled during a two-night stay.**

The older version of this was the concierge who never had to ask twice: a guest memory running on one person's recall, with a bus factor of one. So Anima is a guest memory, not a twin.

## 3. One stay, four memory layers

Fig. 3.1, one stay and what is held at each point:

| Phase | Held | Layer |
|---|---|---|
| Before arrival [Design] | Booking data; situational context (a delayed train, a local event, the weather); Tacet gives disruption by line and place, Anima links it to the booking, Tacet holds no personal data; no external data about the person, no profiling | Booking data only: nothing beyond the reservation, no profile |
| During the stay | Requests, interactions, operational events | Working memory, expires at check-out |
| After check-out | Episodic tail, weeks; semantic only if stated or repeatedly confirmed | Episodic, then semantic: weeks, then long with decay |

Marker on the stay [Design]: health data stays in the stay. An allergy is GDPR art. 9 data, used on explicit consent for a concrete service, never inferred. Keeping it for a future stay needs its own, separate consent.

Segment layer: anonymised patterns across the whole house, never an individual.

A first-time guest is not recognised, but can still be anticipated.

| Layer | Holds | Lifetime |
|---|---|---|
| Working | The current stay, in progress | Expires at check-out |
| Episodic | This stay and a short tail after it | Weeks |
| Semantic | Durable preferences, stated or repeatedly confirmed | Long, with decay |
| Segment | Anonymised patterns, what guests like this tend to need | Aggregate, never individual |

Working memory should use the decaf tonight, so the bar does not ask twice. Semantic memory should never conclude the guest drinks decaf.

## 4. Claims carry confidence, and confidence decays

Fig. 4.1, one preference ("prefers a high floor") held three ways:

Illustrative values, nothing here is measured.

| Regime | Source | Confidence | Age | Reading |
|---|---|---|---|---|
| Stated once | Said to a receptionist, one stay | 0.52 | 14 months | Held, and it has faded since nothing renewed it |
| Confirmed ×4 | Requested again on four stays | 0.91 | Last renewed 3 weeks ago | Corroboration is counted, not claimed |
| Inferred | Derived from booking behaviour | 0.34 | 2 months | Marked as inferred, and it never outvotes something said |

Weights fall over time unless something renews them. A system that reports a confidence it did not measure is worse than one that reports none. See /journal/harnesses-graders-closed-loops, section on confidence.

## 5. Remembering is not neutral

**Whether to remember is an act of care or an exercise of power.**

Source: Edmondo Grassi, *The Remains of the Stay: Memory, Identity, and the Afterlife of the Guest*, Hotel Yearbook 2026 Technology Edition.

## 6. Scope-gated, and it never decides

Fig. 6.1, the scope gate, one layer per call:

- Caller: the orchestrator declares one layer, for one purpose.
- Request that passes: semantic layer, room assignment. Scoped, logged, answerable.
- Anima answers: who this guest is right now. Nothing more.
- Request that does not pass: "everything about this guest". Blocked by protocol. There is no call that returns a whole person. It is a structural choice, not a policy one.
- After the answer: a human validates what the orchestrator proposes. Anima never decides.

A boundary that depends on people asking politely is not a boundary.

Anima answers one question, which is who this guest is right now. What to do about it belongs to the orchestrator, with a human validating, the same separation between perception and decision the F&B node (/aetherix) enforces.

## 7. Where it sits in the architecture

One of four domain nodes, five agents with the orchestrator.

What Anima knows reaches other nodes only through the orchestrator, one layer at a time. Guest experience itself is not a node, which is why `guest.*` lives in the shared contract rather than behind this one service.

The whole picture: /architecture.

---

© Ivan de Murard. All rights reserved.
