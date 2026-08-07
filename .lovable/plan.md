# Field Note "Harnesses, graders, closed loops": make it teachable

## The diagnosis

The note is correct and dense, and that is the problem. Measured on the current content:

- 9 sections, about 4,500 words, 16 minutes. Section 6 alone carries 9 consecutive prose paragraphs on the canary story, more than any other section by a wide margin.
- Aetherix and Lore are used as evidence from section 2 onward, but neither is ever defined. A reader who has not opened the case studies is asked to trust two names.
- Sections assume the ones before them. Section 6 leans on tiers introduced nowhere, section 9 leans on the pyramid from section 4.
- The page is one vertical column of prose, tables and two figures. The home page "Approach" section shows the opposite register: short label, icon, one idea per card.
- Adversarial review is absent. Nothing on red-teaming graders, prompt injection in retrieved content, or the fact that a grader written by the same person who wrote the prompt inherits its blind spots. It is the most obvious gap for the audience this note targets.
- Rose does not know this note exists: her context loads only the three case-study mirrors, so she cannot answer a single question about it.

## What changes

### 1. Two anchors before the argument

A short "The two systems referenced here" block right after the intro: two cards, Aetherix and Lore, three lines each (what it does, who uses it, what feedback reality gives it), each linking to its case study. Everything after can then name them freely.

### 2. Every section stands alone

Each `h2` gets a standard head:

```text
[icon]  ARM B / SEC. 2        2 min
In one line: runtime evaluation proves behaviour on real traffic,
which frozen scenarios never can.
Concrete: Aetherix emits every tool call as a typed event.
```

A small key card component, in the register of the home page Approach cards: monospace section sigil, icon, one-line claim, one concrete instance. A reader landing from a search result on section 7 gets the point without scrolling up.

### 3. Section 6 split and cut

Section 6 becomes two:

- **6. Acceptance criteria**: the two threshold tables, the driving-test analogy, the ERROR against FAIL distinction. Keeps its shape.
- **7. The canary, and why it was invalidated**: the reproducibility story, rewritten as a numbered timeline figure (36 → 48 → 48 → 52 → 53, then enforcement, then 61/62 disjoint) with two paragraphs of commentary instead of nine. The numbers move into the figure where they belong.

Overall prose target: roughly 30% shorter, no fact dropped.

### 4. New section: adversarial review

A real section, not a paragraph, placed after graders:

- Who grades the grader: a grader written by the prompt's author inherits its blind spots. The fix used in practice: adversarial cases authored against the system, not for it.
- Prompt injection through retrieved content, and why Rose treats case-study mirrors as data and never instructions (a live example already shipped on this site).
- Manufactured consensus and confident wrongness as tier-1 failures.
- What is not done yet, named as a gap.

### 5. Interactive figures

The pyramid and the three-arms diagram become hover and click. Selecting a layer or an arm opens a detail panel: what it measures, which product has it, an example grader, the signal it emits. Keyboard operable, arrow keys between items, table equivalents kept for screen readers.

### 6. Share and licence

A share row in the note footer: copy link, email, download `.md`, print or save as PDF (print stylesheet, so the printed page drops nav, dock and progress bar and keeps the figures). Below it, a CC BY 4.0 line plus matching `license` in the article JSON-LD.

### 7. Vocabulary strip carries deliverable type

Each chip gains a small type tag where it applies: Case set (artefact), Grader (code), Harness (pipeline), Protocol (document), Open loop (posture), Closed loop (mechanism). Same tooltip behaviour.

### 8. Rose learns the note

- The note is mirrored as a static `.md` (the same file the download button serves) and added to Rose's reference fetch, alongside a short Lore mirror so both anchors are covered.
- Rose's prompt gains an "explain" intent: when a visitor asks a vocabulary question she answers in two sentences and points to the exact section anchor, instead of pushing a booking.
- The page offers three ready prompts ("Grader or harness?", "Why can Lore not close the loop?", "What would you gate on first?") that open the dock pre-filled. That is the pedagogic payoff in both directions: the note gives Rose substance, Rose gives the note a way to answer the question the reader actually has.

## Technical notes

- New components under `src/components/journal/`: `SectionKey` (sigil, icon, one-liner, concrete), `SystemAnchors` (Aetherix and Lore cards), `CanaryTimeline`, `AdversarialGrid`, `ShareRow`, `AskRose`. Existing `ThreeArmsDiagram` and the pyramid renderer gain selection state.
- New block kinds in `src/content/journal.ts`: `key`, `anchors`, `timeline`, `askRose`; `vocab` items gain an optional `type`. Rendered in `src/pages/JournalEntry.tsx`.
- Content rewrite lives in `src/content/journal.ts` only. New glossary entries for adversarial review, prompt injection, red team.
- Print stylesheet in `src/index.css` under `@media print`.
- Mirror: `public/harnesses-graders-closed-loops.md` generated from the same content, served by the download button, by `llms-full.txt` and by Rose's fetch list in `supabase/functions/_shared/rose-context.ts`.
- SEO: add `license` and keep the existing `FAQPage` block; reading time recomputed after the cut.

## Order of work

1. Anchors, section keys, section 6 split and prose cut (the pedagogy).
2. Adversarial review section and glossary.
3. Interactive figures, canary timeline.
4. Share, licence, print, `.md` mirror.
5. Rose context, explain intent, ready prompts.
