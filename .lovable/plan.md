## Goal
Fix accessibility issues that an axe/Lighthouse audit would surface on Home, Case Studies (Journeys), and About (Atrium). I cannot run Lighthouse from the sandbox, so I performed a static audit (semantic landmarks, ARIA, focus order, contrast against existing tokens) and will fix the concrete issues found.

## Issues found

1. **Duplicate `<main>` landmark** (axe: `landmark-no-duplicate-main`, `landmark-unique`).
   `SiteLayout` already wraps page content in `<main>`. Every page (`Index`, `Journeys`, `Atrium`, plus others) adds a second `<main>` inside, producing two main landmarks per page.

2. **No skip link** (axe: `bypass`, WCAG 2.4.1).
   Keyboard users have no way to bypass the fixed nav and utility icons (8+ tab stops) on every page.

3. **Main landmark not focusable target for skip link** (related to #2).

4. **Hero `<header>` inside future `<main>`** is fine semantically, no change needed.

5. **Material Symbols `Icon` already has `aria-hidden="true"`** and link icons in nav already have `aria-label`. No change.

6. **Contrast**: Sampled the design tokens used on the three pages. `text-on-surface-variant` on `bg-surface` and `text-primary` on `bg-surface` are above 4.5:1 in both themes (verified in earlier reviews). The "Inquire Within" CTA uses `bg-primary` + `text-on-primary` (the canonical pair). No real contrast violation to fix in this pass; the only borderline element previously flagged was the gold gradient farewell card, which already uses `text-on-surface` on a primary tint.

## Changes

### `src/components/layout/SiteLayout.tsx`
- Add a skip-to-content link as the first focusable element (`sr-only` until focused, then visible top-left, primary background).
- Add `id="main-content"` and `tabIndex={-1}` to the existing `<main>` so the skip link can focus it.

### `src/pages/Index.tsx`
- Convert the outer `<header>` (hero) to remain `<header>`, fine as-is.
- Note: `Index` does not add its own `<main>`, only `<header>` and `<Reveal as="section">`. No change needed.

### `src/pages/Journeys.tsx`
- Replace the inner `<main>` (line 47) opening tag with `<div>` and the closing `</main>` (line 105) with `</div>`.

### `src/pages/Atrium.tsx`
- Replace the inner `<main>` (line 51) opening tag with `<div>` and the closing `</main>` (line 338) with `</div>`.

### Other pages with the same nested-main bug (out of scope but listed)
`Contact.tsx`, `Journal.tsx`, `JournalEntry.tsx`, `Atherix.tsx`, `Tacet.tsx`, `Sonor.tsx`, `NotFound.tsx`. The user asked specifically for Home, Case Studies, About, so I will only fix those three. I'll mention the others in the summary so the user can decide.

## QA
- Tab from the page top once: the skip link should appear at the top-left with a clear gold focus outline. Activating it should jump focus to the page content.
- View source on /, /journeys, /about and confirm a single `<main id="main-content">` per page.
- No visual regressions: replacing `<main>` with `<div>` keeps identical class strings.
