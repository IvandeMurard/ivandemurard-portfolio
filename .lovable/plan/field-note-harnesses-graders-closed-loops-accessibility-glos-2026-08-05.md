# Field Note "Harnesses, graders, closed loops": accessibility, glossary, reading experience

## What the audit found

Measured on the live page, both moods, every text node inside `<main>` against its real background:

- **Text contrast: zero failures** in day and dusk. All body, label, table and contents text clears WCAG AA.
- **Table rules**: 4.21:1 (day) and 3.72:1 (dusk), both above the 3:1 non-text threshold.
- **Structure**: single `h1`, ordered `h2`/`h3`, table captions and column scopes present, contents panel is a real `nav` with keyboard support, progress bar is decorative and suppressed under reduced motion.

So point 1 needs no repair. Two real gaps remain.

- **No glossary tooltips exist on this page at all.** `Term` is wired into the case study pages (Aetherix, Lore, Tacet, Sonor) but Field Note blocks are plain strings, so the renderer has no way to mark a term. Words like harness, grader, golden dataset, abstention, MAPE, drift and closed loop are defined in prose but carry no hover definition, and several are not in the glossary at all.
- **The contents panel and the anchors work, but the page reads as one long text column.** Two of its ideas are structural (the three arms, the reliability pyramid) and only the pyramid is drawn.

## 1. Glossary tooltips in Field Notes (priority)

Give journal text an inline term syntax, so the note's own prose can point at glossary entries without changing a single word of the text.

- Markup inside any `p`, `list`, `quote`, `defs` or table cell: `[[grader]]` renders the word "grader" with a tooltip, `[[grader|harnesses]]` renders a different label for the same entry.
- A small renderer turns those tokens into the existing `Term` component, so the tooltip behaviour, hover delay, focus handling and touch tap are exactly the ones already shipped, unchanged.
- Mark the **first meaningful occurrence** of each term only, so the page does not turn into a field of dotted underlines. Roughly 12 marks across the note.

Glossary entries to add (the note uses them, the glossary does not have them): case set, harness (distinct from eval harness), protocol, open loop, closed loop, MAPE, drift, canary, counterfactual, CI gate, precision at k, ontology. Existing entries reused: grader, golden dataset, abstention, eval harness, tacit knowledge, SOP.

Also verify the tooltip animation itself: open and close timing, that it survives moving the cursor into the panel, and that Escape and blur close it, in both moods.

## 2. Accessibility follow-through

Nothing to fix on measured contrast. Two small hardening items found while reading the renderer:

- The definition list in section 1 renders terms as uppercase labels, which screen readers spell out letter by letter in some voices. Keep the visual treatment, set the accessible text to normal case.
- Terms marked with a tooltip must not break the heading anchors or the contents observer: confirm ids and active-section highlighting still behave after the change.

## 3. Reading experience (only after the above)

Two additions, both from tokens, no new colours:

- **The three arms as a diagram**: a compact three-band figure (offline / runtime / outcome) placed next to the existing table, showing when each arm fires along a release timeline. The table stays as the accessible text equivalent.
- **A vocabulary recap strip** pinned after section 1: six short chips (case set, grader, harness, protocol, open loop, closed loop), each opening the same tooltip. It gives a reader who lands mid-page a way back to the definitions without scrolling up.

Plus two cheap wins: mark the contents panel's active item with `aria-current="location"` rather than `"true"`, and add the entry's estimated read time to the contents header so the sticky column carries orientation on long scrolls.

## Technical notes

- New: an inline-markup parser used by `src/pages/JournalEntry.tsx`, plus a `ThreeArmsDiagram` and a vocabulary strip under `src/components/journal/`.
- Edited: `src/content/journal.ts` (tokens only, no wording changes), `src/content/glossary.ts` (new entries), `src/pages/JournalEntry.tsx`, `src/components/journal/JournalToc.tsx`.
- `src/components/Term.tsx` is reused as is.
- Mirrors: the markup tokens are stripped when the note is served to the corpus, so `public/llms.txt`, `public/llms-full.txt` and the MCP tool output stay clean prose.
