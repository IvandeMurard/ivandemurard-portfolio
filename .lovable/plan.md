## Goal

The gold halo on the Home hero currently extends above the headline and intersects the fixed navbar. Because the navbar has a translucent surface fill (`bg-surface/70 glass-nav`) and a hairline bottom border, the halo gets clipped abruptly, breaking the soft circular feel.

## Approach

Keep the halo visually intact, but reposition and reshape it so its falloff stays clear of the navbar, and soften the navbar boundary on the hero so any residual overlap reads as light, not a cut.

## Changes

**1. `src/pages/Index.tsx` (hero halo wrapper, around line 105)**
   - Lower the halo center: change `-translate-y-[58%]` to roughly `-translate-y-[42%]` so the bright core sits behind the headline instead of above it.
   - Slightly reduce vertical reach: change `h-[440px] max-h-[70vw]` to `h-[400px] max-h-[62vw]` to keep the shape circular while pulling the top edge down.
   - No change to width or animation.

**2. `src/index.css` (`.gold-halo`, lines 315 to 326)**
   - Soften the outer falloff so the halo dissolves earlier and never presents a visible edge: extend the transparent stop from `72%` to `62%`, and lower the mid stop from `45%` to `40%`.
   - Optionally bump blur from `36px` to `44px` for a more diffuse perimeter.

**3. `src/components/layout/AtriumHeader.tsx` (nav element, line 30)**
   - Remove the hard hairline under the bar on the hero: replace `border-b border-outline-variant/20` with a softer gradient fade, e.g. add an `after:` pseudo with `bg-gradient-to-b from-outline-variant/15 to-transparent h-px`, so the navbar bottom dissolves instead of cutting.
   - This is a global navbar tweak; it benefits every page where a halo or warm wash sits near the top.

## Out of scope

- No changes to the `Welcome, It's great to see you!` text, CTAs, or scroll cue.
- No changes to other halos (Atrium, Tacet, Aetherix diagrams, Portrait).
- No layout or spacing changes elsewhere on the page.

## Verification

- Reload `/` and confirm the halo reads as a continuous soft circle, with no visible line where the navbar ends.
- Check both day and dusk moods.
- Check at 1308px (current viewport) and a narrower mobile width.
