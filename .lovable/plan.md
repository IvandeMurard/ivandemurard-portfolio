# Field note legibility, plus Rose as a qualifying agent

Two independent workstreams. The field note stops asserting things about Aetherix and Lore that the reader cannot project onto their own system. Rose stops explaining and starts qualifying.

## Part 1: The field note

### 1.1 One coverage matrix, replacing the scattered claims

Today the arm claims are spread across a key card ("Aetherix runs arms A and B and half of C. Lore runs arm A only."), a prose paragraph, a "what each product actually has" table, and a "deployed" block. Nothing tells the reader what a gap *costs*.

Replace all of it in section 2 with one figure: arms A / B / C down the side, Aetherix and Lore across, each cell carrying a state (covered, partial, absent), a two-or-three word instance, and, for every gap, one clause naming the consequence. Example of the intended register:

```text
              Aetherix                    Lore
A  offline    covered   CI gate, blocking  covered   9 graders, 3 tiers
B  runtime    partial   guardrails speced  absent    a bad answer in a
                        not yet live                 hangar is seen by
                                                     nobody
C  outcome    partial   forecast error     absent    escalate, and the
                        computes itself,             counterfactual is
                        truth declared               gone
```

Word count goes down, not up. The prose paragraph "Aetherix runs one and a half loops, not two..." is compressed into the arm C cell plus one retained sentence on declared truth. The "deployed" block at the end of section 2 is removed as redundant with the matrix.

### 1.2 Lore's "None" is wrong, and the SOPs say why

The learning-loops table currently reads "None" for Lore under automatic comparison and ground truth. That contradicts the anchor block above it, which says reality returns the SOP and the signed work record. Corrected reading, carried into the matrix:

- Lore has a **reference**, not a **loop**. The SOP is a static ground truth available at authoring time, which is exactly what makes arm A strong (a grader can check an answer against the procedure).
- What is missing is the **outcome** signal: whether the technician's job went well, and the signed work record, are not fed back. And when a junior escalates, the counterfactual disappears.

So the cell becomes "SOP as reference, no outcome return" instead of "None". This is the honest version and it is also more didactic: it shows a reader that having a procedure corpus is not the same as having a loop.

### 1.3 Section 3 stops repeating itself

Three near-identical statements of the same idea inside one screen: the key card one-liner, the Qonto pull quote, the "in practice" line. Fix:

- Key card `oneLine` becomes the *consequence*, not the definition: "Five named dimensions separate a demo from a system you can leave running."
- Key card `concrete` keeps the Lore score (one met, two partial, two absent) and drops the "both absences belong to arm B" clause, which the matrix in 1.1 now shows.
- The Qonto quote keeps the definition and stays as the only place it is stated. It moves above the key card, since it is the premise.

### 1.4 Canary defined where it is first used

"canary" appears in the section 3 table before section 7 defines it. A glossary entry already exists. Add the term to the section 3 prose so the hover definition is available at first contact, and add one parenthetical in the table cell ("the repeated identical run") so the definition survives without a hover, for print and for mobile.

## Part 2: Rose

### What is actually in place today

Verified in code: the dock computes the current path only to choose which chips to show. `sendMessage` sends the chip sentence as plain text, and the edge function reads nothing but `messages`. So of the three layers in your table, **layer 1 (page en cours) does not exist**, and **layer 2 (chip as intent) exists only as a sentence indistinguishable from something the visitor typed**. Layer 3 (the visitor's reply) works, because the model has the transcript.

The system prompt also carries "after 3 assistant turns, call propose_booking", which is precisely the reflex to remove.

### 2.1 Layer 1: send the page

The dock passes the current path and page title with each request. The edge function turns it into one line of the system prompt: "The visitor is currently reading <title> at <path>." Rose anchors the first sentence there and does not re-explain content the visitor is already looking at.

### 2.2 Layer 2: the chip travels as an intent

Chips keep their visible sentence in the transcript (your choice), and the request additionally carries the chip's intent id. The prompt states the rule plainly: a suggested question is an **opening hypothesis**, not a request for an explanation. Never restate the chip. Never treat it as a demand for the article to be summarised.

### 2.3 The answer shape

Encoded as a rule, with the branch condition you asked for:

1. Acknowledge in the context of the page, in a clause, not a sentence.
2. If the honest answer genuinely depends on something unknown (risk level, autonomy, deployment stage), give a **conditional** recommendation: "if it can act, start here; if it is lower-risk, start there." If the question is definitional, answer straight.
3. Ask exactly one question, the one that most changes the recommendation. Never two.
4. Once the visitor answers, connect to one case study or capability.

Length stays short, but the current hard cap of 1 to 3 sentences is too tight for a conditional answer. Raise to roughly 5 short sentences maximum for a conditional turn, 3 otherwise. Your worked example for "what should I gate on first?" goes in the prompt verbatim as the model answer for a branch-dependent turn.

### 2.4 Booking, strictly gated

Remove the turn-count trigger. `propose_booking` fires only when one of these appears in what the visitor wrote:

- a concrete project or system they are building
- a deadline, a team, a deployment, or a budget
- an operational risk or a bottleneck
- a request for how to do it in their own context

Plus an explicit ask to speak to Ivan. In every other case Rose ends on a question, and no card is rendered. The card's framing line uses your wording as the pattern: name the shift from generic to design decision, then offer the review.

### 2.5 Your proposed rule

"Never assume the visitor wants the article explained. Treat a suggested question as an opening hypothesis. Answer briefly, then ask the single question that most changes the recommendation. Use the current page as context, and propose a call only after a concrete project or constraint emerges."

Keeping it as written. It is the whole change in four sentences, and it becomes the first paragraph of Rose's behavioural section.

## Technical notes

- `src/content/journalHarnesses.ts`: section 2 and 3 blocks; a new `matrix` block kind.
- New `src/components/journal/CoverageMatrix.tsx`: three arms by two products, responsive to stacked cards on mobile, state as text plus a token-coloured dot, never colour alone.
- `src/components/journal/JournalEntry` renderer: register the new block kind.
- `src/content/rosePrompts.ts`: chip type already carries `intent`; extend it so every chip has one.
- `src/components/rose/RoseDock.tsx`: send `{ page: { path, title }, intent }` in the request body alongside messages.
- `supabase/functions/rose-chat/index.ts`: read and validate that body, pass it to the prompt builder.
- `supabase/functions/_shared/rose-context.ts`: rewrite the behavioural section (voice, answer shape, booking gate); the case-study mirror fetching is untouched.
- `public/harnesses-graders-closed-loops.md` and the LLM corpus files are regenerated to match the new section 2 and 3 text.

## Out of scope

No change to the note's title or slug, to the evaluation and security guardrails in Rose's prompt, or to the dock's visual design.
