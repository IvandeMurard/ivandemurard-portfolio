# Soften farewell card edges (dusk) and improve accessibility

## Problem
In dusk mode, the "Thank you for your visit" card sits as a hard rectangle on the warm taupe page. The blue gradient stops abruptly at the rounded corners, and the body paragraph (`text-on-surface-variant`, a muted warm tone) sits on a mid-blue gradient where contrast is borderline.

Day mode looks fine, so changes are dusk-scoped only. Inner layout untouched.

## 1. Feather the edges (dusk only)

Add a `.farewell-card` class on the card div in `src/pages/Index.tsx`, then in `src/index.css` under `[data-mood="dusk"]`:

- Apply a radial `mask-image` so the card fades from fully opaque at center to fully transparent at the corners and outer edges (feather starts ~75%, fully transparent at 100%). This melts the gradient into the surface instead of clipping it.
- Replace the existing hard `ring-1 ring-primary-fixed-dim/40` with a masked inset hairline via a `::before` pseudo-element, so the border itself fades at the corners and does not reintroduce a hard edge.
- Widen and soften the shadow so the card reads as a glow on the taupe field, not a clipped panel.
- Slightly larger radius for a softer silhouette.

Day mode is untouched: the class only applies extra styles inside `[data-mood="dusk"]`.

## 2. Accessibility on the card

- Body copy: change `text-on-surface-variant` to `text-on-surface` so the paragraph sits at the higher-contrast cream tone in dusk and on solid dark in day. Brings WCAG ratio comfortably above AA on the gradient.
- Link underlines: keep underlines visible at rest (already present), and replace the `hover:opacity-70` with a clearer hover state that keeps text contrast: stronger underline (`border-primary` instead of `border-primary/50`) plus a small color brighten via `hover:text-primary` (no opacity drop).
- Add `focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary rounded-sm` on each link so keyboard users get a clear focus ring.
- Add `aria-label` on the four links (`"Email Ivan"`, `"Book a call with Ivan"`, `"Ivan on LinkedIn"`, `"Ivan on GitHub"`) since the visible labels are short and out of context for screen readers.

## Files touched
- `src/index.css` — add `.farewell-card` dusk styles (mask, ring pseudo, shadow).
- `src/pages/Index.tsx` — add `farewell-card` class, swap paragraph color token, refine link classes and add `aria-label` + `focus-visible` styles.

## Out of scope
- No copy changes.
- No layout, padding, or typographic scale changes.
- No changes to day mode.
