# Homepage & navigation refinements

## 1. Footer, no trailing space

In `src/components/layout/Footer.tsx`, the `<footer>` currently uses `py-16 mt-24`, which creates a tall empty band below the copyright line. Drop `mt-24` and tighten to `py-10`, so the copyright row sits cleanly at the page's bottom edge with just enough breathing room.

## 2. Thank-you note, dusk cream/gold instead of blue tint

Two sources of the blue tint at the bottom of the homepage:

- The Thank-you bookend in `src/pages/Index.tsx` uses `bg-gradient-to-br from-primary-fixed-dim/70 via-primary-fixed/60 to-surface-container-low` with `ring-1 ring-primary-fixed-dim/40` and a `blue-halo` background. `primary-fixed*` are the Picasso blues.
- The `PageLight` overlay in `src/index.css` is currently inverted vs. the intent: the blue overlay is fully visible at the top and fades to cream toward the bottom. Reading the surrounding comments ("warm cream + gold dusk below"), this is a regression we should also fix.

Changes:

- Replace the Thank-you card gradient with a dusk cream/gold palette: `bg-gradient-to-br from-secondary-fixed/60 via-secondary-fixed-dim/40 to-surface-container-low`, ring `ring-secondary-fixed-dim/40`, hover overlay `bg-secondary-fixed-dim/30`.
- Swap the section's `blue-halo / blue-halo-pulse` for `gold-halo / gold-halo-pulse`.
- In `src/index.css`, flip the `.page-light::after` opacity formula so the blue overlay shows at the top and fades out as the user scrolls down: `opacity: calc(0.35 * (1 - var(--page-light-progress, 0)))` is the intended formula and matches the comment, but the visible result is reversed because the base layer also carries gold at the top. Re-tune by moving the gold radial in `.page-light` to `at 50% 100%` (bottom) and keep the blue overlay anchored at the top. End state: top of page reads cool/blue, bottom reads warm cream + gold, matching the dusk metaphor and the Thank-you bookend.

## 3. Index copy and structure

In `src/pages/Index.tsx`:

- Rename the "Why I care" section heading to **My approach**. Keep its supporting line.
- Reorder the `CONVICTIONS` array so the cards render as: 1) Human interactions first, 2) Real business value, 3) Full-stack 0→1 craft.

## 4. Project labels

In `src/content/site.ts`, update the `label` field:

- Sonor: `SaaS • Urban Noise Insights • 2020 - 2022`
- Aetherix: `AI Agent • Boutique Hotel Operations • 2026`
- Tacet: `B2C • iOS • Wellness • 2026`

## 5. Navigation, Home link and active state

In `src/content/site.ts`, leave `PRIMARY_NAV` as-is (it does not contain Home).

In `src/components/layout/AtriumHeader.tsx`:

- The brand wordmark "Ivan de Murard" already links to `/`, so it stays as the always-visible home anchor on the left.
- Add a conditional **Home** entry to the centered desktop nav and the mobile overlay, rendered only when `location.pathname !== "/"`. It links to `/` with `end` so it only matches the homepage.
- Refine the active-link treatment so the current page is unmistakably but elegantly highlighted: keep the italic headline font, change to `text-secondary` with a subtle gold underline (`border-b border-secondary/60 pb-1`) and a faint `text-shadow` for warmth. Inactive links keep `text-on-surface-variant` with a hover transition to `text-primary`. Apply the same active treatment in the mobile overlay.
- Result: on `/`, no Home link appears in the nav (the wordmark covers it). On any other route, a Home link sits at the start of the centered nav and the active route is gold-underlined.

## Files to edit

- `src/components/layout/Footer.tsx`
- `src/components/layout/AtriumHeader.tsx`
- `src/components/PageLight.tsx` (no change expected, listed for reference)
- `src/index.css`
- `src/pages/Index.tsx`
- `src/content/site.ts`

No new dependencies, no route changes, no schema changes.
