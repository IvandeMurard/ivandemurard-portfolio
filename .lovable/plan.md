Three focused fixes on the About page (`/atrium`).

## 1. Hero arrival view

Currently the page opens with a lot of empty space above the headline, the portrait floats to the right at 400 to 500px, and the H1 only resolves once you scroll. The first impression should be the name and the one-line positioning, not whitespace.

Changes in `src/pages/Atrium.tsx`:
- Reduce top padding: `pt-32 md:pt-48` becomes `pt-24 md:pt-32`.
- Tighten hero bottom margin: `mb-32 md:mb-48` becomes `mb-24 md:mb-32`.
- Rework the H1: drop the third line entirely.
  - From: `I'm Ivan, / a Product Builder, / by curiosity and craft.`
  - To: `I'm Ivan, / a Product Builder.`
- Drop the headline scale one notch so both lines fit above the fold on a 1313x843 viewport: `text-6xl md:text-8xl lg:text-9xl` becomes `text-5xl md:text-7xl lg:text-8xl`.
- Pull the portrait up so it sits beside the headline rather than below it: change `items-end` to `items-center`, and reduce portrait height from `h-[400px] lg:h-[500px]` to `h-[340px] lg:h-[440px]`.
- Keep the lede paragraph and label.

Net effect: on first paint the user sees the label `About`, the full two-line headline, the lede, and the portrait, all within the first viewport.

## 2. Remove EvalLabs

In `src/content/site.ts`, delete the `EvalLabs` entry from the `NOW_PROJECTS` array. The grid keeps Aetherix, Tacet, Kissa, Lore, Field Notes (5 cards), which still tiles cleanly on the 3-column grid (3 + 2).

## 3. Principles band background

In dusk mode the `What I build with` band currently uses `--tertiary-container` (HSL `45 11% 22%`), which reads slightly lighter than the surrounding warm taupe page surface, so the band looks like a pale beige slab instead of a serious dark band.

Fix in `src/index.css`, scoped to `[data-mood="dusk"] .principles-band`:
- Swap the background to `hsl(var(--tertiary))` (HSL `50 17% 9%`), which is genuinely darker than the page surface (`32 14% 11%`) and gives the band the same "deep room" weight that `--primary` gives in day mode.
- The text inside the band already uses `text-surface`, `text-surface-bright`, `text-surface-dim`, and `text-secondary-fixed`, all of which remain readable on the darker tertiary tone in dusk.

Day mode (`background-color: hsl(var(--primary))`) is unchanged.

## Files touched

- `src/pages/Atrium.tsx`
- `src/content/site.ts`
- `src/index.css`

No new components, no new tokens.