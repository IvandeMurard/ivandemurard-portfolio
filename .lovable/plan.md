## Goal

Two fixes:
1. Make scroll buttery smooth, no blocking when crossing sections.
2. Strengthen the gold halo of the hero, tighten it behind "Welcome, It's great to see you!" and the subtitle, with a slow, discreet breathing.

## Diagnosis of the scroll jank

Three compounding causes, all paint-heavy:

- `.page-light` is a fixed full-viewport layer with three large gradients (radial + linear + radial) whose stops are driven by `--page-light-progress`. Every scroll frame rewrites that variable on `:root`, which forces a full repaint of a viewport-sized gradient. On long pages this is the main culprit.
- The hero stacks three large blurred elements: two 600-800px `blur-[100/120px]` rounded divs plus the 720px `gold-halo` with `filter: blur(50px)`. Three blur layers composited together are expensive on mid-range GPUs.
- `html { scroll-behavior: smooth }` amplifies the perceived stutter when the browser is already busy painting.

## Fixes

### 1. PageLight, cheaper and frame-throttled (`src/index.css`, `src/components/PageLight.tsx`)

- Replace the three-gradient `.page-light` with a single linear gradient cream → soft Picasso-blue, plus one small fixed gold radial at the very top (no progress dependency). Same visual intent, far less paint.
- Drive the transition with `opacity` on a second blue layer instead of interpolating gradient stops via `calc()`. Opacity changes on a fixed layer are GPU-composited, no repaint.
- Promote the layer with `transform: translateZ(0)` and `will-change: opacity` so it lives on its own compositor layer.
- Throttle `PageLight` updates to ~10 fps (every ~100ms via rAF gate); the eye will not see the difference for a slow color wash, and the main thread stays free during scroll.

### 2. Hero halos, simplify and concentrate (`src/pages/Index.tsx`, `src/index.css`)

- Remove the two extra blurred ambient circles in the hero (the 800px primary-fixed-dim and 600px secondary-fixed-dim divs). They duplicate the gold-halo and add two heavy blur layers.
- Keep one halo, the `.gold-halo`, and make it stronger and tighter:
  - Reduce size from 720px to 560px so it sits behind the headline + subtitle, not the whole hero.
  - Increase center opacity (gold core 0.95, mid 0.55, edge 0).
  - Reduce blur from 50px to 36px (sharper, more present, also cheaper).
  - Add a subtle inner gold core (a smaller second radial via `background-image` layering) for depth.
- Slow the breathing: change `gold-halo-breathe` from 5s to 9s and reduce the scale delta (1 → 1.03) and opacity delta (0.85 → 1) for a calmer, high-end pulse.
- Add `will-change: opacity, transform` and `transform: translateZ(0)` to the halo so the breathing animates on the compositor.

### 3. Smooth scroll (`src/index.css`)

- Drop `html { scroll-behavior: smooth }`. Native momentum scrolling already feels right; the `smooth` mode mostly applies to anchor jumps and hides jank when other layers repaint. Removing it lets the browser scroll at native frame rate.
- Add `body { -webkit-font-smoothing: antialiased; }` is already there, no change needed.

### 4. Tiny correctness bits

- Keep the blue halo bookend behind "Thank you" as is, but add `will-change: opacity, transform` to align it with the gold halo.

## Files to edit

- `src/index.css`: simplify `.page-light` (single gradient + opacity-driven blue overlay), strengthen `.gold-halo` (tighter, brighter, less blur), slow breathing keyframes, drop `scroll-behavior: smooth`, add compositor hints.
- `src/components/PageLight.tsx`: throttle updates, switch from CSS variable on stops to opacity on a child layer.
- `src/pages/Index.tsx`: remove the two redundant ambient blur circles in the hero, resize halo wrapper from 720px to ~560px.

## Out of scope

- No structural changes to sections, copy, or milestones.
- No new dependencies (Framer Motion not added; native CSS + IntersectionObserver stay).

## Expected result

- Scrolling stays at 60fps across all sections, no perceived blocking when entering the milestones, case studies, or thank-you sections.
- The hero shows a single, denser gold halo concentrated behind the headline and subtitle, breathing slowly (9s) and almost imperceptibly.
- The cream-to-blue light progression is preserved, just lighter on the GPU.
