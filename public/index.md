# Ivan de Murard, AI Product Manager & Builder, Paris

AI Product Manager & Builder · Paris

## Five years getting products adopted. Now building systems operations can trust.

Co-founded Sonor: 0→1 urban noise SaaS, incubated at Matrice, MVP shipped. 500+ users on 100+ sites and 7 C-level executives aligned at DomusVi, €1.9M of receivables tracked and 40% recovered at Bouygues Telecom IoT. Since November 2025 I design, build and evaluate AI agents with RAG and multi-agent workflows, built as closed loops: every recommendation checked against what really happened. Trained in service design, I connect operations (front and back of house) with tech (front and back-end) and business. Results published, mixed ones included.

## 01 · Flagship: Aetherix

The F&B agent for boutique hotels, without another dashboard. One daily recommendation, one-tap manager feedback, audited against real covers so it learns from every shift.

[How it decides, and when it refuses](https://ivandemurard.com/aetherix#what-it-does-today)

Built, tested on historical data, and staged for production. Ready for a 30-day pilot.

Three days from a sandbox run (synthetic data, real services, seed 42, translated from the original run): https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/tree/f01251d77b512dd97716eb01e461499a28e5e301/demo/closed-loop

### Day 1 · Who's right?

- Evening: covers expected 101 (range 94–109, confidence 0.9). Staffing: 6 front of house · 3 kitchen. Hotel at 98% occupancy, strong pressure expected on the restaurant.
- Manager (WARN): I'd say 79 covers instead.
- Next morning (GO): Actual: 95 covers (forecast 101, within range).

### Day 10 · It refuses

- Evening: covers expected 85 (range 78–92, confidence 0.9). Staffing: 5 front of house · 2 kitchen.
- Manager (GO): OK
- Next morning (STOP): Yesterday's POS figure (850 covers) is implausible (implausible_feedback): discarded, it will not feed learning. Could you check the till export?
- reason: implausible_feedback

### Day 17 · It sees it coming

- Evening: covers expected 82 (range 75–90, confidence 0.9). Staffing: 5 front of house · 2 kitchen.
- Manager (GO): OK
- Next morning (WARN): Actual: 92 covers (forecast 82, gap +11%). Third consecutive under-estimate: a regime change seems under way (new contract? recurring group?). The weekly recalibration will absorb it; ranges widened until then.

## 02 · Selected projects

### Sonor (DARK · MVP Shipped)
0→1 B2G SaaS. Validated the technical core, stopped in 2022 after discovery concluded no contract would clear.


### Lore (GO · Evaluated)
Evaluation harness · 64 cases · pure-function graders · hard safety tier.
Captures the tacit knowledge a retiring technician never wrote down and returns it to a junior on the shop floor by voice, always behind the procedure.

### Compass (WARN · Partial)
APUR BDCom 2023 shopfront census · BODACC legal notices · INSEE Sirene · 85,418 units · every figure with its source, licence and date.
Every address has a story. Compass reads it before you sign.

### Anima (STOP · Compliance Gated)
Synthetic PoC. Architecture ready, deployment frozen until the data-protection impact assessment (DPIA) clears.
Hotels have amnesia. What they know about a guest lives in one person's head or a diversity of files and tools, forcing guests to repeat themselves. But AI agents profiling people without their consent can't be the answer. Anima is a guest memory that keeps only what guests said, fuses it with live hotel context and adapts the stay as reality changes.

## 03 · Field Notes

The decisions behind the products. Written to be reused. [All notes](https://ivandemurard.com/journal)

- [Keep the forecaster and the actor apart.](https://ivandemurard.com/journal/agent-boundaries-aetherix) One model that predicts and acts looks elegant on a slide. Why I split Prophet and Claude in two, and everything that single choice decided next.
- [Harnesses, graders and closed loops](https://ivandemurard.com/journal/harnesses-graders-closed-loops) Agents rarely fail loudly. They drift, quietly, until a customer notices. How to find out first: graders, harnesses, and the gaps I have not closed yet.
- [Whose truth is the ground truth?](https://ivandemurard.com/journal/whose-truth-is-the-ground-truth) Your agent learns from something: a forecast, a manager's yes, or what really happened the next morning. Pick the wrong one and you build a very confident yes-man.

## 04 · Contact

Prototypes are fast. Getting operations to trust them is the job.

Open to AI Product Manager and Product Builder roles. Thirty minutes is enough to know whether we should work together.

- Book a call: https://cal.com/ivandemurard/discussion-and-introduction
- Email: ivandemurard@gmail.com
