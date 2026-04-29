# Hero refinements: dusk contrast and intro copy

## 1. Dusk mode: restore the two-tone hero

**Problem.** In day mode, "Welcome," is deep navy and "It's great to see you!" is a softer muted blue, giving a clear value contrast. In dusk, both lines sit in the same pale-blue family at near-identical lightness (82% vs 88%), so the pairing flattens.

**Direction chosen: Deep ink blue.** Mirror the day pairing literally, just inverted in value:

- Line 1 ("Welcome,") stays the bright pale blue (current `text-primary` in dusk).
- Line 2 ("It's great to see you!") becomes a deeper, more saturated ink blue, set against the dark surface so it reads as a quieter sibling, not a duplicate.

**Implementation.** In `src/index.css`, under `[data-mood="dusk"]`, redefine `--on-primary-container` to a deeper blue (around `hsl(217 55% 55%)`) instead of the current `217 71% 88%`. This token is only used on the hero second line and a couple of decorative spots, so the scoped change is safe. No JSX change needed since `Index.tsx` already uses `text-on-primary-container` on line 2.

If the decorative uses elsewhere (gradients, borders) end up too dark, fall back to a hero-only override: add a `.hero-line-2` class in `index.css` with a dusk-specific color, and apply it to the `<span>` in `src/pages/Index.tsx`. Decision made at edit time after a visual check.

## 2. Hero intro paragraph

Replace the current paragraph in `src/pages/Index.tsx` with version A:

> Product builder with 5 years across start-ups, scale-ups and large groups, and 2 years co-founding a SaaS. I design and build from operational experience, ship with AI, and keep the human at the center of interactions.

Notes:

- No em-dashes (per project rule).
- "Hospitality" stays implied, not named.
- AI present as a tool, not the identity.
- The "Thank you for your visit" closing block keeps its existing copy.

## Files touched

- `src/index.css` — adjust dusk `--on-primary-container` (and add a scoped hero class only if needed).
- `src/pages/Index.tsx` — swap the hero paragraph text.

## Out of scope

- No changes to day mode colors.
- No changes to milestones, case studies, or other sections.