# Rose case study: reference prototype

Visual reference for `/rose-design-lab`, exported from the Design canvas (artboards D1 and D2) on 29 Oct 2026.

Order of authority when they disagree:
1. `docs/rose-case-study.md` (structure, rules, acceptance criteria §9)
2. `docs/rose-case-study-copy.md` (exact words)
3. this folder (layout, spacing, hierarchy, colour intent)

The prototype is a reference, not code to copy. Build with the site's semantic tokens and existing components (`src/components/rose/RoseCaseStudy.tsx`). Never copy hex values from the prototype.

## Contents

- `screens/`: one image per section of the brief, named `<brief section>-<chapter>.<mood>-<width>.jpg`.
  - `day-1440`, `night-1440`: desktop. `day-390`: mobile.
  - Example: `6.3-ch01-qualify.night-1440.jpg` is §6.3, chapter 01, Night, 1440 px.
  - Vignettes are shown in their default state (the second toggle option). The other state is described in the copy deck.
  - The fixed bottom dock may overlap the bottom of a capture. It is not part of the section.
- `rendered/`: static HTML of each artboard after rendering (D1 = hero to chapter 06, D2 = chapter 07 to contact), Day and Night. Read it for structure, order and exact nesting. Scripts are removed.
- `source/Rose.dc.html`: the canvas source (template syntax, `part` / `mood` / `usage` props). Only useful to read the logic of interactive parts (vignette toggles, hero replay, TOC). It does not run outside the canvas.

## Known differences with the live page (to keep in mind)

- The prototype has no site header or Design Lab bar.
- The "In use" block of chapter 06 is hidden (below 33 conversations), as on the live page.
