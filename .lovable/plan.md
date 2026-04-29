## Hero light, dusk gradient, scroll polish

The current `page-light::after` overlay piles `primary-fixed` then `primary-fixed-dim` at full progress, ending in a saturated blue band that reads as a flat rectangle behind the footer. Goal: turn that band into ambient light, keep saturation capped at what the Thank-you card already shows, and let the page feel like late-afternoon light shifting toward dusk.

### 1. Direction, blue → cream/gold (dusk)

You're right, it reads better that way. Late afternoon starts cool and ends warm. So:

- **Top of page (progress 0):** cool, slightly desaturated blue wash (Picasso-blue dawn).
- **Bottom of page (progress 1):** warm cream + faint gold (the cream the surface already uses).

The Thank-you card's blue halo then becomes a callback near the end, not the dominant note. The hero's gold halo crowns the headline as today.

### 2. Remove the blue rectangle

The flat blue band comes from the `linear-gradient(... primary-fixed 55%, primary-fixed-dim 100%)` overlay reaching opacity 1 at the bottom. Two changes in `src/index.css`:

- **Lower the overlay ceiling.** Cap the overlay's `opacity` at the Thank-you card's saturation reference (~0.35), not 1. This is the "saturation never exceeds the Thank-you card" rule, encoded once.
- **Reshape the gradient.** Replace the bottom-heavy linear gradient with a soft top-anchored radial wash so the tint fades into surface, never piles into a band:

```text
radial-gradient(
  ellipse 90% 60% at 50% 0%,
  hsl(var(--primary-fixed) / 0.30) 0%,
  hsl(var(--primary-fixed-dim) / 0.18) 45%,
  transparent 80%
)
```

Then the static base layer (the warm cream + gold radial at top) becomes the **end state**, and the blue overlay becomes the **start state**. We swap which one is driven by `--page-light-progress`:

- Base layer: warm cream + faint gold radial at top, always on (this is "surface at dusk").
- Overlay layer: cool blue radial at top, opacity = `1 - var(--page-light-progress)`, capped at 0.35.

Result: scroll down, the blue afternoon light recedes, the cream + gold dusk takes over. Scroll up, it returns identically (state is a pure function of scroll, so symmetry is automatic).

### 3. Tint the surface, not the text

Confirmed:
- `--on-surface`, `--on-surface-variant`, `--primary`, `--secondary` stay constant. No text color changes anywhere.
- Only `.page-light` and `.page-light::after` change. Halos (gold, blue) are untouched.

### 4. Smooth scrolling, single scrollbar

Two small additions:

- **`html { scroll-behavior: smooth; }`** in `src/index.css`. Makes anchor jumps and programmatic scrolls glide instead of snap. Browser respects `prefers-reduced-motion` automatically.
- **PageLight throttle** is already 100 ms (10 fps), which is fine for an opacity tween but reads slightly steppy on long scrolls. Drop `MIN_INTERVAL` from 100 to 50 (20 fps). Still composited-only work, no layout, no paint.
- Single scrollbar is already correct since the previous `overflow-x: clip` fix on `html, body`. No change needed there.

### 5. What stays untouched

- Hero gold halo position, size, animation.
- Thank-you card, its blue halo, its gradient, its ring. It remains the saturation ceiling and the standalone front card.
- Milestones, Case Studies, Why I care, How I work. No layout or color changes.
- All text colors, font weights, sizes.
- The `clip` overflow rule.

### Technical summary

**`src/index.css`:**
- `html { scroll-behavior: smooth; }` added to the base layer.
- `.page-light` background-image swapped to the warm cream + faint gold radial as the **always-on** dusk base (re-using the existing `secondary-fixed` radial, slightly stronger).
- `.page-light::after` rewritten:
  - `background:` top-anchored radial in `primary-fixed` / `primary-fixed-dim`, max stop alpha 0.30.
  - `opacity: calc(0.35 * (1 - var(--page-light-progress, 0)));` so the cap is hard-coded at the Thank-you card's reference saturation, and the curve is identical up and down.

**`src/components/PageLight.tsx`:**
- `MIN_INTERVAL` 100 → 50.
- No logic change. Progress still 0 at top, 1 at bottom; the CSS does the inversion.

### Out of scope
No changes to halos, hero, Thank-you card, milestones, typography, or layout. No new dependencies.
