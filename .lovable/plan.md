# Light mode contrast and text selection fix

Two defects to fix, both at the design-token level so every page benefits at once.

## 1. Text selection in dusk mode

Confirmed in `src/index.css`: `::selection` uses background `--secondary-fixed` (light yellow) with text colour `--on-secondary-container`. In dusk that token is a near-white cream (`39 90% 84%`), so selected text is white on yellow, effectively unreadable.

Fix: introduce dedicated `--selection-bg` / `--selection-fg` tokens defined per mode, and point `::selection` at them.

- Light: warm yellow background, very dark ink text.
- Dusk: same lamplight yellow background, dark brown/near-black text (reuse the dark `--on-secondary` value, `38 42% 14%`).

This guarantees dark-on-light selection in both moods instead of inheriting a mood-flipped token.

## 2. Light mode legibility

Rather than patch pages one by one, run an automated contrast sweep in light mode over the main routes (`/`, `/journeys`, `/atherix`, `/lore`, `/tacet`, `/sonor`, `/journal`, and the Harnesses field note), computing the real rendered ratio of every text node and border against its actual background. Fix everything below WCAG AA (4.5:1 body, 3:1 large text and UI borders), then re-run the sweep until clean.

Known suspects to check first, based on the current light palette:

- `--outline-variant` (`240 14% 80%`) is used for table borders, diagram cards, dividers and chip outlines. Against the near-white surfaces it sits around 1.4:1, well under the 3:1 needed for meaningful boundaries. Darken it so tables and schema cards read as structure, not as faint smudges.
- `--outline` (`233 6% 49%`) is used for arrows and axis marks in diagrams; verify it clears 3:1.
- Small label text at 9-10px in uppercase tracking (diagram captions, timeline markers like COMMIT / MERGE / RELEASE, badge chips) sits at the smallest end of readability. Where the ratio is close to the limit, raise size to 10-11px and darken the token rather than keeping the colour and the size both marginal.
- Fill contrast between adjacent surface steps (`surface-container-low` vs `surface-container-high`) in the arms diagram and pyramid figure: the active band should be clearly distinguishable from the empty track, not a 2% lightness difference.
- Gold-on-cream text (`--secondary` on light surfaces) is verified per usage; keep only the instances that clear AA.

Any change stays inside the token definitions and the small figure components; no copy or layout changes.

## Technical notes

- Files touched: `src/index.css` (token values, `::selection` rule), plus targeted tweaks in `src/components/journal/ThreeArmsDiagram.tsx`, the pyramid/table renderers in `src/pages/JournalEntry.tsx`, and the Aetherix/Lore diagram components if the sweep flags them.
- Verification: a Playwright script that walks the DOM in both moods, resolves computed colours against effective backgrounds, and reports every failing node. Report will list before/after ratios.
- Dark (dusk) mode is re-checked after the token edits so darkening light-mode tokens does not regress it.
