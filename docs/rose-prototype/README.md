# Rose case study: reference prototype

Visual reference for `/rose-design-lab`, exported from the Design canvas (artboards D1 and D2). v2 export: 3 Nov 2026, after copy deck v2 and docs/style.md.

Order of authority when they disagree:
1. `docs/rose-case-study-copy-v2.md` (exact words; wins over `docs/rose-case-study.md` for wording, and replaces the v1 deck)
2. `docs/rose-case-study.md` (structure, rules, facts, acceptance criteria §9)
3. this folder (layout, spacing, hierarchy, colour intent)

The prototype is a reference, not code to copy. Build with the site's semantic tokens and existing components (`src/components/rose/RoseCaseStudy.tsx`). Never copy hex values from the prototype.

## Contents

- `screens-v2/`: full-page captures of the v2 prototype, `<board>.<mood>-<width>.jpg` (D1 = hero to chapter 06, D2 = chapter 07 to contact). The fixed dock and the hero demo are captured mid-animation. These replace `screens/` for anything that changed in v2.
- `screens/`: v1, one image per section of the brief, named `<brief section>-<chapter>.<mood>-<width>.jpg`.
  - `day-1440`, `night-1440`: desktop. `day-390`: mobile.
  - Example: `6.3-ch01-qualify.night-1440.jpg` is §6.3, chapter 01, Night, 1440 px.
  - Vignettes are shown in their default state (the second toggle option). The other state is described in the copy deck.
  - The fixed bottom dock may overlap the bottom of a capture. It is not part of the section.
- `rendered/`: static HTML of each artboard after rendering (D1 = hero to chapter 06, D2 = chapter 07 to contact), Day and Night. Read it for structure, order and exact nesting. Scripts are removed.
- `source/Rose.dc.html`: the canvas source (template syntax, `part` / `mood` / `usage` props). Only useful to read the logic of interactive parts (vignette toggles, hero replay, TOC). It does not run outside the canvas.

## Known differences with the live page (to keep in mind)

- The prototype has no site header or Design Lab bar.
- The "In use" block of chapter 06 is hidden (below 33 conversations), as on the live page.

## v2 behaviours the static captures cannot show

Re-exported on 4 Nov 2026, after the demos shipped. The words in docs/rose-case-study-copy-v2.md win over this folder.

- Hero demo: three exchanges in a loop (reformulation, sourced answer, follow-up questions), all built behaviours, with a Pause / Play button in code.
- Chapter 06 demo: the same dock, four exchanges marked Design (Locate, Connect, Sketch, then a profile question that shows the source link and the discreet booking line), with the caption "These formats are in design. Live Rose answers in text only."
- Source links (design): each claim ends with a link (§ + section name for this site, ↗ only for links that leave it). A click scrolls to the passage and highlights it for a moment. In the prototype only the Locate link goes to the right passage.
- Booking line (design): on a profile question, no booking card; one line under the answer, set apart by a thin copper rule and the compass.
- Rose's notes: the copper tip arrives on the passage, one note at a time, and leaves when the reader moves on. Marks, one meaning each: underline = the decision; strike = the first brief; circle = a figure and its comparison (chapter 08 cost); highlight = the passage Rose cited. Mobile, reduced motion and screen readers get the note inline, with no motion.
