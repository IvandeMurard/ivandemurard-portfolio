## What's actually happening

Looking at your screenshot against the code, three different things are conflated:

1. **The "blue page tinting" you saw before** was the `.page-light::after` blue overlay at the top of the page. We flipped its formula so it now fades on scroll, but the **base layer underneath is mostly cream with a faint gold radial at the bottom**. So the page reads as "cream throughout" rather than "blue afternoon → gold dusk". The journey is too subtle to feel.

2. **The Thank-you card was repainted gold** in the last pass. That's wrong, you want the card to stay cool/blue and *contrast* with the warm dusk background. The big gold blob in your screenshot is actually the **gold halo on that section**, 720px tall, escaping below the section because the section has no `overflow-hidden`. That blob is also what you're reading as "footer space not deleted", the footer itself is correctly tightened to `py-10`, but the halo bleeds past it into the cream area beneath.

3. **PageLight updates are throttled to ~10fps** (50ms minInterval), which makes the wash feel steppy rather than tied to scroll. For a "light changing naturally" feel it should update every frame.

## Fix, four edits

### 1. `src/index.css`, real blue → gold light wash

Restructure `.page-light` so both lights live in the same fixed layer and crossfade with `--page-light-progress`:

- **Base layer**, the static surface color stays.
- **Blue afternoon layer** (`::before`), large radial anchored at the top, opacity `calc(0.55 * (1 - var(--page-light-progress)))`. Uses `--primary-fixed` Picasso blue. Stronger than the current 0.35 cap so it actually reads as afternoon light.
- **Gold dusk layer** (`::after`), large radial anchored at the bottom, opacity `calc(0.55 * var(--page-light-progress))`. Uses `--secondary-fixed`. Stronger and warmer than today's faint 0.28 base.

At scroll 0 the page reads cool blue, at scroll 1 it reads warm gold dusk, and every position in between is a smooth crossfade. Both layers stay full-viewport, fixed, GPU-composited.

### 2. `src/components/PageLight.tsx`, smooth updates

Drop the 50ms throttle. Use a single `requestAnimationFrame` with a "pending" guard, so progress updates every paint frame while scrolling. This is still cheap, we only set one CSS variable per frame, no layout, no paint, only compositor.

### 3. `src/pages/Index.tsx`, Thank-you card stays cool

Revert the Thank-you card to its **blue palette** so it sits beautifully on the gold dusk background:
- Gradient: `from-primary-fixed-dim/70 via-primary-fixed/60 to-surface-container-low`
- Ring: `ring-primary-fixed-dim/40`
- Hover overlay: `bg-primary-fixed-dim/30`

**Remove the halo entirely** from this section, no `gold-halo`, no `blue-halo`. The page background already provides the warm dusk light, the card should be a clean cool object on it. This also kills the gold blob bleeding under the footer in your screenshot.

### 4. Verify the footer space

Footer is already `py-10` with no `mt-24`, so the markup is correct. The trailing space in your screenshot is the halo bleed, not real space. Once the halo is removed in step 3, the footer will sit flush against the Thank-you section with just its own `py-10` breathing room.

## Files to edit

- `src/index.css`, restructure `.page-light` with `::before` (blue, top, fades out) and `::after` (gold, bottom, fades in), both keyed to `--page-light-progress`.
- `src/components/PageLight.tsx`, remove the 50ms throttle, update every animation frame.
- `src/pages/Index.tsx`, restore blue palette on the Thank-you card, remove the halo div from that section.

No changes to `Footer.tsx` (already correct), no schema, no new dependencies.

## What you'll see after

Scrolling down the homepage: the light slides from a soft Picasso-blue afternoon at the hero, through a balanced midday crossfade around the case studies, into a warm cream + gold dusk by the time you reach the Thank-you card, which now stands as a cool blue bookend on that golden light. Reverse smoothly on scroll up. No halo blob, footer tight.
