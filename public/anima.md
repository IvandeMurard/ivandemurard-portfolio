# Anima

> The guest node. A hotel's memory of a relationship, built with forgetting in it.

A regular is someone who does not have to explain themselves twice. Anima is an attempt to make that possible without building surveillance.

Status: synthetic proof of concept. Production gated behind a data-protection assessment.
URL: https://ivandemurard.com/anima

## 1. The questions it exists to answer

Four questions a general manager can ask out loud and nobody in the building can answer:

- What does this property know about a guest that nobody ever wrote down?
- What did we learn last stay that we will fail to use during this one?
- What does a guest have to repeat every single time, and what does that cost us?
- Which of the things we believe about them did they tell us, and which did we infer?

In practice: a guest asked for a quiet room on three consecutive stays, and had to ask again on the fourth.

The fourth question separates this from a customer database. A property that cannot tell what a guest said from what a system inferred has already lost the argument it will eventually have to win, with the guest or with a regulator.

## 2. The lineage: from modelling buildings to modelling relationships

Digital twins started with assets. A building, a chiller, an engine: model the thing, simulate it, act before it fails. Hospitality adopted that version and largely stopped there, with predictive maintenance, refurbishment run in software before the work starts, and energy optimisation.

The interesting extension is toward people. Research on human-centered digital twins in hospitality (https://pmc.ncbi.nlm.nih.gov/articles/PMC13078991/) models the *employee*, their behaviour, performance and context, and its central design rule is worth borrowing exactly: such a system exists to support human judgement, not to replace it. Read it for what it is, a study of adoption intent across 141 hotel employees, not a deployed system.

Anima applies that same shift on the other side of the desk, to the guest relationship. The vocabulary is tempting, since calling it a guest cognition twin makes the positioning write itself, but the two are not symmetrical, and the asymmetry is the whole design problem.

An employee can be told they are being modelled. They can be consulted, they can refuse, and their representation is part of their working conditions. **A guest cannot meaningfully consent to being modelled during a two-night stay.** They came to sleep somewhere. Whatever is built about them has to be defensible without their participation, which is a far harder constraint than the employee case and one the research does not have to solve.

There is an older version of this. The concierge who knew that Mr Fontaine takes the corner table and never asks twice was a human-centered twin running on one person's memory, and it had a bus factor of one. It left when they left. That is the same loss Lore (/lore) addresses for technical expertise, one industry over. Anima is the attempt to make being a regular a property of the house rather than of one employee's recall, without the house turning into an apparatus that watches.

In practice: the concierge retires, and every regular becomes a stranger again on the same Monday.

## 3. What it is: four memory layers with different lifetimes

| Layer | Holds | Lifetime |
|---|---|---|
| Working | The current stay, in progress | Expires at check-out |
| Episodic | This stay and a short tail after it | Weeks |
| Semantic | Durable preferences, stated or repeatedly confirmed | Long, with decay |
| Segment | Anonymised patterns, what guests like this tend to need | Aggregate, never individual |

Temporal separation is the whole design. Most guest-AI failures come from treating everything as permanent: a one-off request during a difficult stay becomes a permanent label, and nobody can say why the system believes it.

In practice: a guest orders a decaf at 11pm because they have an early flight. Working memory should use it tonight. Semantic memory should never conclude they drink decaf.

## 4. Claims carry confidence, and confidence decays

Nothing in Anima is stored as a fact. Everything is a claim with a weight, a source and an age. "Prefers a high floor" told to a receptionist once is not the same object as the same preference confirmed across four stays, and neither is the same as one inferred from behaviour.

Weights fall over time unless something renews them. A preference from 2019 that nobody has confirmed since should not outvote something said last week.

The honesty rule from the rest of this work applies: a system that reports a confidence it did not measure is worse than one that reports none. See /journal/harnesses-graders-closed-loops, section on confidence.

## 5. Remembering is not neutral

Edmondo Grassi, writing in the Hotel Yearbook, puts it directly: the stay no longer ends at check-out, it merely changes form. The guest leaves the building and their record migrates into infrastructure that remembers with perfect precision.

This was always a craft of memory. The concierge who anticipates, the maître d'hôtel who recalls a wine. But human memory came with forgetting and forgiveness built in. What replaces it knows neither. The asymmetry is new: the system remembers the guest better than the guest remembers themselves.

His question is the right one, and it is not rhetorical: **whether to remember is an act of care or an exercise of power.**

The answer cannot be a values statement. It has to be in the data model, or it is decoration. Decay on every claim, layers that expire by design, inference marked as inference, and a scope gate that makes "give me everything about this guest" an impossible request rather than a discouraged one.

Source: Edmondo Grassi, *The Remains of the Stay: Memory, Identity, and the Afterlife of the Guest*, Hotel Yearbook 2026 Technology Edition.

## 6. Scope-gated, and it never decides

Any consumer must declare which layer it is querying. There is no call that returns everything known about a person, which is a structural choice rather than a policy one: a boundary that depends on people asking politely is not a boundary.

Anima answers one question only, which is who this guest is right now. What to do about it belongs to the orchestrator, with a human validating. Same separation between perception and decision the F&B node enforces, for the same reason: a component that both perceives and acts arbitrates privately, and the arbitration stops being reviewable.

In practice: the orchestrator asks for semantic-layer preferences relevant to a room assignment. It does not, and cannot, ask for the guest's full history.

## 7. Where it stands, honestly

Synthetic proof of concept. Four-layer memory implemented, working MCP server, evaluated on a synthetic cohort. **It has never run on a real guest and it will not until a formal data-protection assessment is complete.**

That gate is not compliance theatre or a schedule risk. Inferred state about a person is sensitive personal data, and a guest cognition system a hotel cannot lawfully deploy is worth nothing however good the architecture is. Built first, cleared later is the wrong order here, and it is the order that produces systems nobody can switch on.

Shipped as a prototype at an Anthropic hackathon in June 2026. Production is phase 4.

## 8. Where it sits in the mesh

Anima is one node among four. It owns the guest relationship and nothing else: no pricing, no orchestration, no action. Guest experience itself is not a node, it is a signal that crosses every part of the mesh, which is why `guest.*` lives in the shared contract rather than behind this one service.

The whole picture: /architecture. The node that consumes what Anima knows: /aetherix.

---

© Ivan de Murard. All rights reserved.
