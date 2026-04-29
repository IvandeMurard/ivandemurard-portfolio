Make the Atrium content cards (Track record, Now, Method) slightly darker in light mode so they read as cards instead of melting into the warm cream page. Dusk mode stays untouched.

## Changes

### 1. `src/index.css`
Add a small day-mode-scoped rule under the existing `.principles-band` block:

```css
/*
  Atrium content cards (Track record, Now, Method) sit on the warm cream
  page surface. In day mode, surface-container-low reads almost identical
  to the page, so we bump them one step darker. Dusk reads fine as-is,
  so we scope the override to day mode only.
*/
:root:not([data-mood="dusk"]) .atrium-card {
  background-color: hsl(var(--surface-container));
}
```

This shifts those cards from `--surface-container-low` (`#f5f3ee`) to `--surface-container` (`#f0eee9`), which is one step deeper on the existing cream ramp, no new tokens.

### 2. `src/pages/Atrium.tsx`
Add `atrium-card` to the three card class lists (Track record, Now, Method). The hardcoded `bg-surface-container-low` stays as the dusk-mode default; the new CSS rule overrides it in day mode.

- Line 139 (Track record `<article>`): prepend `atrium-card`
- Line 182 (Now `<Wrapper>`): prepend `atrium-card`
- Line 250 (Method `<div>`): prepend `atrium-card`

No changes to the Principles band, the farewell card, the hero portrait card, or any other surface.