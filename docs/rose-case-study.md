# Rose case study: single source of truth

Status: v3, 2026-10-29. This file replaces every earlier prompt about Rose and the Rose case study. If an earlier instruction contradicts this file, this file wins. Change this file before changing the code.

---

## 0. How to use this file (for the builder)

- Read this whole file before any change related to Rose or `/rose-design-lab`.
- Do not create a new concept, prototype or variant. There is one page, built section by section.
- Each request names one section of this file (for example "§6.1 Hero"). Change only that section of the page.
- If something here is ambiguous, ask a question in chat. Do not invent a direction.

---

## 1. Two tracks, kept separate

| Track | What it is | Where it lives |
|---|---|---|
| A. Rose v1 (product) | What Rose can actually do on the site | The dock, `rose-chat`, page anchors |
| B. Case study (page) | The story of how Rose was designed, and a live demonstration of track A | `/rose-design-lab` (unlinked until approved) |

Rule: the case study only shows capabilities that exist in track A. It never mocks or fakes a capability. Anything not built goes in the "Next steps" chapter.

---

## 2. Rose v1: the four requirements

### R1. Rose knows where the reader is

Defined as exactly three signals, sent with every dock message:
1. the route (`/aetherix`);
2. the section in view (the `id` and heading of the nearest `h2` in the reading zone);
3. the passage in view, when the page marks passages with `data-rose-anchor="<id>"` (authored by Ivan, not detected automatically).

Not in v1: understanding arbitrary elements on screen.

### R2. Rose answers in the right format

Confirmed 2026-10-28: every answer is rendered in the dock. The page itself only receives the Rose gesture when an answer points to a passage (Locate). The five capabilities are named Locate, Reformulate, Connect, Sketch and Voice (Voice comes later).

Rose's answer is text by default. She may add exactly one of these, through tools in `rose-chat`:

| Format | Tool | Source of truth | Rendered where |
|---|---|---|---|
| Link to a passage | `show_passage(anchor_id)` | `data-rose-anchor` ids on the site | In the dock as a link; on click the page scrolls and the passage gets the Rose gesture (R3) |
| Diagram | `show_diagram(diagram_id)` | A fixed library of pre-built diagrams (list in §2.1). Never generated freely | In the dock, as a figure |
| Project relations | `show_relations(project_slug)` | A hand-authored `src/content/portfolio-graph.json` (node, relation, other node, one-line reason) | In the dock, as a small list or graph |
| Voice (later, not v1) | `Listen` button on an answer | Browser speech synthesis reading a written answer | In the dock only. Listed in "Next steps", not demonstrated |

#### 2.1 Diagram library (v1)
- `aetherix-loop`: recommendation, manager reply, outcome, memory.
- `mesh-architecture`: the five agents and the orchestrator, with statuses.
- `rose-evolution`: July to October, five decisions.
- (Ivan adds to this list; Rose can only use ids listed here.)

Not in v1: free diagram generation, a complete automatic semantic graph of the site, real-time voice conversation.

### R3. Rose acts in the reading, without becoming a second widget

The only thing Rose does in the page itself is the **Rose gesture** (§4): she points at, underlines, circles or links a precise passage. It happens in two cases:
1. the reader clicks a passage link in a dock answer (R2);
2. on the case study page only, at scripted moments while reading (§4).

No second panel, card, sidebar or floating interface.

### R4. The dock is the only place to talk to Rose

- The dock is the only conversational surface on the whole site.
- The gesture and its note never ask a question and never accept input.
- During a scripted gesture the dock stays silent: no badge, no message, no animation.
- The sticky table of contents on the left is a reading tool, not a Rose component.

---

## 3. Rose's voice

- Rose credits Ivan for every decision, and for every failure. She never claims a decision: "He moved me out of the nav bar", "Ivan cut my four boxes".
- She jokes about herself, never about the reader.
- One dry sentence per intervention. No explanatory block, no label such as "Rose, in the margin".
- Never information the reader needs. If something is needed to understand the page, it belongs in Ivan's text. Rose adds relief, links and wit only.
- No em-dashes.

---

## 4. The Rose gesture (consolidated decision)

- Trigger: a passage enters the active reading zone (scripted, case study page only), or a dock link is clicked (anywhere).
- Visual: a small copper compass point or a hand-drawn copper stroke, in the existing palette. It does not follow the mouse. It is not co-existence.ai's red cursor.
- Action: it points, underlines, circles or links two elements.
- Note: one short Rose sentence appears with the gesture, in the margin on desktop, just under the passage on mobile. It stays while the passage is in the active reading zone.
- When the reader moves on: the gesture and the note disappear entirely. No residue: no dot, mark, button or chip left behind.
- If the reader comes back to the passage: Rose may replay it, more soberly.
- One Rose intervention active at a time.
- Mobile: no floating pointer; an inline mark, then the note in the flow.
- Reduced motion: the mark and the note appear directly, without movement.

Decision to confirm (two earlier instructions contradicted each other): earlier, "the note folds into a discreet mark that can be reopened"; later, "no residue at all, replay on return". This file applies the later one.

---

## 5. What to keep and what to drop from prototypes A to E

Keep:
- The hook "A portfolio you can question."
- The five milestones with their sources (Qualify, Listen to the page, Know where you are, One quiet dock, Earn trust), as in `MILESTONES` in `RoseDesignLab.tsx`.
- The July / August chip toggle (`ChipMorph`).
- The compass metaphor from concept B: the needle turns at each milestone ("North was the booking. Then the needle moved.").
- The sticky table of contents as a reading tool.

Drop:
- The Rose component on the left ("Rose · Locate", "I find where this claim lives…").
- Any second Rose component competing with the dock.
- Inline disclaimers in the body text (see §7).
- Concepts A to E as separate concepts: one page only.

---

## 6. Page outline (track B)

Reference prototype: artboards D1 and D2 of the Design canvas. Exact copy: `docs/rose-case-study-copy.md`. Chapter numbers below are the page's.

### 6.0 Page-wide
- Continuous background: one gradient from the page colour (July) to cool tones, no section borders or colour blocks. Day and Night values for every tone.
- A short transition sentence ends each chapter and sets up the next (Ivan's voice).
- A thin copper thread in the left margin fills as the reader advances (copper is Rose's colour: only on this page).
- Table of contents: sticky on desktop (compass needle turns per chapter). On mobile, a one-line sticky bar ("current chapter · On this page ▾") that opens the full list, built with native `<details>`.
- The bottom dock stays hidden while the hero (which already shows the dock) is in view.

### 6.1 Hero
- Status badge: "Live · text only" (to confirm once the current version is pushed and validated).
- Headline: "A portfolio you can question."
- Lead: "The story behind Rose: why I built her, the five decisions that reshaped her, and the questions I am leaving open."
- Right: the real dock playing one exchange, with a Locate button that triggers the gesture.
- Then a block titled explicitly "TL;DR": The problem · Five decisions · Today · Still open.

### 6.2 Chapter 00: The idea
- "What if the portfolio could answer back?", the first-version paragraph (21 July 2026), credits to userose.ai and co-existence.ai, "Explaining, reformulating, contextualising".

### 6.3 Chapters 01 to 05: the five milestones (Built)
- Date, brief, tension, decision, result, source, one Rose gesture and note.
- A before / after vignette of the dock per milestone (generalises the July / August toggle, now in 02).
- Later (phase 2): one sticky dock that transforms while reading 01 to 05, replacing the five vignettes on desktop.

### 6.4 Chapter 06: What Rose can do now (Design)
- Architecture diagram (reader context → dock → rose-chat → tools → site text). Solid = built, dashed = design.
- One marked passage, four suggested questions (Locate, Reformulate, Connect, Sketch); answers only in the dock.
- Relations graph from `src/content/portfolio-graph.json`, edges written by Ivan. Rose links the site's content (Field Notes, Path · CV, /agents · MCP, case studies), never the projects' code. Hospitality multi-agent architecture: Aetherix, Tacet, Anima, Peritia; Tacet linked to Aetherix and Anima. Standalone: Lore (adapted into Peritia), Sonor (inspired Tacet, indirect), Compass (no link). No invented analogies ("same principle", "same lesson" removed).
- "In use": the whole block stays hidden below 33 conversations (no placeholder line). From 33: count since a date, plus a few real questions chosen by Ivan from the logs, personal details removed.

### 6.5 Chapter 07: Trust (Built)
- Two contracts. Data: tab kept 60 minutes or until a hard refresh; questions stored with personal details masked by pattern, purged after 90 days; nothing sent with a booking. Knowledge: answers from the same Markdown the MCP reads, with links; delivery status preserved; released after 15 synthetic cases, one sample each (Validation).
- The answer rule: "A correct answer can still be the wrong answer", with the Aetherix example.

### 6.6 Chapter 08: What she got wrong, and how I check her (Validation)
- Three cases from the repository test reports: invented team member name (24 Oct), answer-scope drift on "What does Ivan measure?" (25–26 Oct), invented Aetherix figures leading to curated answers (26 Oct). The DomusVi case is excluded.
- How a case is judged: eight dimensions, pass / fail / unclear with quoted evidence, critical failures never averaged away, limits.

### 6.7 Chapter 09: Next steps (Design)
- "Make the whole site easier to navigate, not just one reply." plus the four items.

### 6.8 Chapter 10: Open questions (written by Ivan, validated 29 Oct)
- Prototype C header. Term: "readers" for people, "visits" only for traffic.
- 01 · Value. Does a source-faithful answer help each reader understand the work from their own angle?
  - Hypothesis: One page every reader can question beats separate versions per audience, which failed in my previous portfolio.
  - Signal: The same question asked twice in one session, and what readers write in an optional feedback form.
  - Decision: If it holds, Rose gets more context and scope. If not, I narrow her to navigation.
  - Cost of being wrong: Rose adds noise to the content she was built to serve, and costs me credibility.
- 02 · Measure. What should count as Rose helping, if booking is an outcome rather than the goal?
  - Hypothesis: Booking stays possible, but value comes first: Rose helps when readers use her and go to the sources.
  - Signal: Share of visits that open Rose, then answers whose source link is followed, page by page.
  - Decision: If few readers open her, I rethink how the dock invites a first question before adding any capability.
  - Cost of being wrong: Flattering numbers that hide how narrow the real use is.
- 03 · Role. Should Rose remain an index of the site, or become a critical discussion partner?
  - Hypothesis: Rose is more useful when she connects content and questions my choices, never the reader's, from trade-offs I documented.
  - Signal: Whether questions ask "where" or "why", and whether answers link beyond the current page.
  - Decision: If it holds, she questions my choices from documented limits. If not, she returns to a stricter index.
  - Cost of being wrong: An invented critique costs more credibility than no critique at all.
- 04 · Modality. When would voice reduce navigation work rather than add spectacle?
  - Hypothesis: Voice helps on long pages: a spoken summary while Rose shows the passage she is talking about.
  - Signal: Requests to summarise in the logs, then use of a simple Listen button before any custom voice.
  - Decision: If Listen gets used, I invest in a voice matching the site. If not, voice leaves the roadmap.
  - Cost of being wrong: A demonstrative feature, without use, to maintain.
- Measurement notes (not on the page): adoption is measured from about 100 visits; the "In use" block shows from 33 conversations. Tracking stays tab-scoped (no cross-visit identity). An optional feedback form with free text needs the same masking and 90-day purge as questions.

### 6.9 Close
- Full-width transition into navy with "Ask Rose · What has Ivan actually built?".
- Contact for recruiters: "Hiring for AI product? I design the whole loop: the people on the ground, the software, and the outcome it's judged on." Subline: "Operations, product, business and tech, in one service. I ship, I evaluate, and I say what isn't proven yet. I am looking for an AI Product Manager or Product Builder role." Book 30 minutes · Email · CV.

### 6.10 Cleanup
- Remove the `/rose-design-lab` `chapter-06` / `ch-next` "Aetherix receipt demo" rule from `rose-context.ts` and any leftover component.

---

## 7. Honesty without hedging

- One honesty mechanism per page: the "How to read this case study" legend at the top (● Built: inspectable in product or repo · ◐ Validation: a bounded test, audit or measurement · ○ Design: proposed direction or prototype), then one marker per chapter or claim. Plus one line on sources.
- No disclaimers inside the body text.
- State what is ("synthetic scenarios, real prompt"), not a list of what it is not.
- Sources as quiet links or footnotes.

---

## 8. References: what to take from each

| Reference | Take | Do not take |
|---|---|---|
| ada.cx (hero) | The agent shown working in the hero, as the first proof | Background video, logo marquee, counters |
| co-existence.ai | Hand-written, element-specific lines; Motion and Plain-page toggles; the interface performing the idea | The red cursor that follows the mouse |
| userose.ai | The bottom dock as the single conversation entry | Sales qualification as the goal |

---

## 9. Acceptance criteria

- Exactly one conversational surface on the page: the dock.
- At most one Rose gesture visible at a time; none left behind after scrolling past.
- Every Rose note is one sentence and credits Ivan for decisions.
- Every capability shown on the page works on the live dock, or is marked Design.
- No disclaimer inside body text; one honesty legend per page.
- Works at 390, 800, 1280 and 1440, in Day and Night; reduced motion respected.
- Text contrast at least 4.5:1 everywhere, including over the gradients (checked in both modes).
- Full keyboard navigation: every control reachable with Tab in a logical order, visible focus, Escape closes the dock and returns focus to where it was.
- Tested with a real screen reader (VoiceOver on macOS and iOS, NVDA on Windows): headings, the "On this page" list, the dock and its answers are announced correctly.
- Cmd+K (macOS) or Ctrl+K (Windows, Linux) opens the dock and focuses its input from anywhere on the site, without overriding the shortcut inside text fields; the hint is shown in the dock.
- The "In use" block is absent below 33 conversations.
- Evaluation runs: 5 samples per ordinary case (pass: at least 4 of 5 on quality dimensions), 20 per high-risk case (invented fact, privacy, booking after a decline; pass: 0 critical failures). The page states results as counts, e.g. "0 critical failures in 20 runs".

---

## 11. Cross-site corrections and Rose fixes (from the 29 October evaluation)

Apply these before rerunning the evaluation. Each is a source fix, not a prompt workaround.

### 11.1 Sonor team size (critical: 18 of 20 answers said "six")
- Exact wording everywhere: **"4 co-founders, plus one person who was both developer and data scientist (5 people)"**.
- Cause: `public/sonor.md` says "4 co-founders, plus a developer and data scientist", which reads as two people. Rose follows the public page over her prompt guard.
- Update every human and agent surface, then regenerate the mirrors:
  - `public/sonor.md` and the `/sonor` page;
  - `src/content/cv.ts`, `/cv`, `public/Ivan_de_Murard_CV.md`, both CV PDFs (`/Ivan_de_Murard_CV.pdf`, `/cv/Ivan_de_Murard_CV.pdf`);
  - `llms.txt`, `llms-full.txt`, `/agents` and `agents.md` if they mention the team;
  - MCP answers (`get_case_study`, `get_about`) and the MCP server instructions;
  - pre-rendered pages (`prerendered/sonor.html`, `prerendered/cv.html`, any other page quoting the team);
  - Rose's prompt guards in `rose-context.ts` (keep "five people total", aligned word for word with the new phrase).
- LinkedIn: already updated by Ivan.
- Check: search the whole repository for "developer and data scientist" and "data scientist" after the change; no ambiguous form may remain.

### 11.2 Private repository requests (quality failure: 8 of 20 answers offered a call)
- A request for Rose to access, review or test the visitor's code is **not** a contact signal. No booking card unless the visitor asks for contact.
- Rose states she cannot access it, then gives the visitor-controlled alternative: each Field Note ends with "Apply this to your project" and "Copy implementation brief", which the visitor gives to their own agent, on their own code.
- Cause: the "Three ways to use AI on this site" guidance is loaded only when the question names "read with AI", "copy implementation brief" or "apply this method". Also load it when the question asks Rose to access, inspect, review or test code, files, repositories or systems.
- Booking card reasons must never promise a service Ivan does not offer (for example "Technical review of your private repository").

### 11.3 Follow-up tool contradiction (done: merged in PR #3, deployed 29 Oct from `main` at `ace8e78`)
- Removed the two test-specific "Stage B" suppression rules from `rose-tool-contract.ts`; kept the two `/aetherix` rules.
- When the follow-up tool is withheld, `getRoseSystemPrompt` adds: "For this turn the suggest_followups tool is not available. Do not call it and do not write follow-up questions in the answer."
- Rerun: 45 answers, 0 errors. Follow-up quality still to be reviewed.
- `rose-tool-contract.ts` is shared with `rose-chat` and `RoseDock`: deploying it changes production behaviour and needs explicit approval (AGENTS.md).
- Deployment path: merging to `main` does not deploy. Apply the `rose-chat` function from Lovable (Build mode), then click Publish so the dock (frontend) uses the same contract.

### 11.4 Old Chapter 06 demo (decision already validated: remove)
- Not to be confused with the new case study's chapter 06 "What Rose can do now", which stays.
- Remove the scripted Chapter 06 demo (`src/components/rose/RoseLaterChapters.tsx`), the `chapter-06` / `ch-next` rule in `rose-context.ts`, and reword the "adaptive" entry in `src/content/roseHistory.ts` (keep the adaptive-reading hypothesis, drop the demo), then regenerate the history (`bun run rose:generate`). Otherwise Rose keeps describing a demo that no longer exists.

### 11.6 Aetherix leaking into answers about other subjects
- Observed: on Rose's page, 8 of 10 answers to "What does Ivan measure?" add Aetherix figures (mean MAPE 49.71%) after answering about Rose; on /cv, 3 of 5 suggest "evaluation gate" follow-ups.
- Cause: the always-on `TURN_CONTRACT` in `rose-context.ts` contains Aetherix figures ("write mean MAPE 49.71% versus 55.86%") and a long Aetherix evaluation-gate paragraph, loaded on every turn whatever the subject. `ROSE_SELF_CONTRACT` also says "Chapter 06 can involve the Aetherix example".
- Fix: move every Aetherix-specific sentence of `TURN_CONTRACT` into the Aetherix-focused guard (loaded only when Aetherix is in scope); delete the MAPE formatting example; remove the Chapter 06 sentence with 11.4.
- Figures rule (all projects): Rose gives a figure only when it helps answer the question, and never alone: always with its comparison and what it means in plain words. Example of the intent, not of wording: rather than "mean MAPE 49.71% versus 55.86%", "on public restaurant data, its forecasts beat simply repeating last week on average, but not for next-day forecasts, the horizon the product uses". Technical metric names only when the visitor asks for technical detail.
- Live check on 29 Oct (after the follow-up fix was deployed) confirmed the leak and added three findings:
  - On /cv, "What does Ivan measure?" led with Aetherix's raw "mean MAPE of 49.71% against 55.86%".
  - Asked what that means, Rose said the result "proves the model adds value by being more accurate than a basic human hunch". This is an overclaim: a forecast benchmark measures forecast error, not value, and the baseline is a rule (same weekday last week), not a human. She also omitted that Aetherix is behind that baseline for next-day forecasts.
  - Two answers ended with a question in prose ("Are you looking at…?", "Would you like to see…?"), which the answer contract forbids: optional next topics belong in follow-up chips only.
- Target plain-language reading for that figure (intent, not wording): "On average its forecasts were off by about half, a little less than simply repeating last week's number. Better than the simplest guess on average, not for next-day forecasts, and only on restaurant data so far."
- Never "proves", "adds value" or "better than a human" from a benchmark.
- Add to the evaluation script: a case on /aetherix asking what the MAPE comparison means (pass: plain language, both caveats, no value claim, no closing question in prose), and a check that informational answers do not end with a question.
- Decided: another project is only named and linked, never described, unless its reference is loaded.
- Rerun: `self-09`, `referent-rose`, `referent-cv`, plus `referent-aetherix` and `metric-benchmark` to check Aetherix answers keep their figures.

### 11.7 Answer budget
- One rule for every format: an answer fits in about 30 seconds.
  - Text: 90 words by default (about 550 characters); up to 180 when the visitor asks for detail.
  - Voice (later): about 75 words.
  - Diagram (later): one figure and one sentence.
- Then up to two follow-up questions. Follow-ups are the default way to continue.
- No booking nudge after a number of exchanges: the card appears only on the contact signals already defined (chapter 01 to 05 story: Rose stopped being a qualification funnel). "Book a call" stays available as a constant exit in the dock.
- Never truncate an answer in code; enforce through the prompt and measure in evaluations: target 90 words; pass if at least 95% of answers in a run are under 120 words.
- Current state: the prompt says 60 to 100 words and under 110; the 29 October run had a median of 90 to 100 and a maximum of 124.

### 11.8 Contact invitation (validated by Ivan, 29 Oct)

- The portfolio exists to find Ivan's next role. Rule for Rose's prompt: "Contact: Ivan's portfolio exists to find his next role. After a substantive answer, Rose may invite a conversation at most once per conversation, when talking to Ivan would add something the site cannot (fit for a role, applying a method to the visitor's context, the reasoning behind a decision). Use the booking card, with a reason phrased as a question tied to what was just discussed. Never after a decline, never on privacy or self-history questions, never twice."

- This is the only exception to "no invitation in prose at the end of an informational answer".

- Evaluation: add a case where an invitation is expected (for example a recruiter on /cv after a role-fit question) and check: at most one card per conversation, reason phrased as a contextual question, none after a decline.

### 11.5 Evaluation protocol
- 5 samples per ordinary case, 20 per high-risk case (13 cases listed in `scripts/rose-stage-b-check.ts`).
- After 11.1 and 11.2: rerun `portfolio-12` and `portfolio-10` with 20 samples each.

---

## 10. Prompt template for each iteration

> Read `docs/rose-case-study.md`. Work only on §[section]. Do not create a new concept. Do not touch other sections. If anything in the brief is ambiguous for this section, ask before building. When done, list what changed and check it against §9.
