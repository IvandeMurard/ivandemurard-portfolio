## Goal

Add premium route transitions across the site using the View Transitions API: a quiet 8px-lift crossfade everywhere, plus a shared-element morph from each Journeys card to its case study hero.

No new dependencies. CSS-first, honors `prefers-reduced-motion`, graceful instant-cut fallback for Firefox.

---

## 1. Navigation wrapper

Create `src/hooks/useViewTransition.ts`:

- Exports `useViewTransitionNavigate()` returning a function `(to: string) => void`.
- Internally uses `useNavigate` from `react-router-dom`.
- If `document.startViewTransition` exists and user does not prefer reduced motion, wraps the navigation in it. Otherwise, navigates directly.
- Also exports a `<TransitionLink>` component, a drop-in replacement for `react-router-dom`'s `Link` that calls the hook on click (preserving cmd/ctrl-click, middle-click, target=_blank semantics).

This is the only behavioral change: `Link` becomes `TransitionLink` in the few places that benefit (nav, case rows, Journeys cards, Journal cards). Internal anchor links (`#section`) stay as plain `<a>`.

---

## 2. Global crossfade + lift (direction 2)

Add to `src/index.css` under `@layer base`:

```text
@view-transition { navigation: auto; }

::view-transition-old(root) {
  animation: vt-fade-out 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
::view-transition-new(root) {
  animation: vt-fade-in-up 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes vt-fade-out { to { opacity: 0; } }
@keyframes vt-fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none; }
}
```

Outgoing fades for 220ms, incoming fades + lifts 8px over 320ms, slight overlap. Same easing curve as the rest of the site.

---

## 3. Persistent chrome (no header/footer blink)

Tag the elements that should not animate during a route change with stable `view-transition-name` values so the browser treats them as continuous:

- `SiteLayout` header: `style={{ viewTransitionName: 'site-header' }}`
- `SiteLayout` footer: `style={{ viewTransitionName: 'site-footer' }}`
- `PageLight` background layer: `style={{ viewTransitionName: 'page-light' }}`

Add matching CSS so these named elements get no animation:

```text
::view-transition-group(site-header),
::view-transition-group(site-footer),
::view-transition-group(page-light) { animation: none; }
::view-transition-old(site-header),
::view-transition-new(site-header),
::view-transition-old(site-footer),
::view-transition-new(site-footer),
::view-transition-old(page-light),
::view-transition-new(page-light) { animation: none; opacity: 1; }
```

Result: only the main content swaps, the chrome stays still.

---

## 4. Shared element: Journeys card → case hero (direction 3)

For the three case studies (Aetherix, Sonor, Tacet):

- In `Journeys.tsx`, the `<CaseHoverPreview>` image for each row gets `style={{ viewTransitionName: \`case-hero-${slug}\` }}`.
- In each case page (`Atherix.tsx`, `Sonor.tsx`, `Tacet.tsx`), find the hero image element and give it the same `view-transition-name` (e.g. `case-hero-aetherix`).
- The browser interpolates position, size, and border-radius automatically. No JS.

Add a small CSS rule for smoother morph timing:

```text
::view-transition-group(case-hero-aetherix),
::view-transition-group(case-hero-sonor),
::view-transition-group(case-hero-tacet) {
  animation-duration: 520ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Reverse navigation (case → Journeys via back button or breadcrumb) morphs back automatically because the names match in both directions.

---

## 5. Files touched

- **New:** `src/hooks/useViewTransition.ts` (hook + `TransitionLink` component).
- **Edited:** `src/index.css` (view transition rules, ~40 lines).
- **Edited:** `src/components/layout/SiteLayout.tsx` (add `viewTransitionName` on header/footer, swap internal nav `Link`s for `TransitionLink`).
- **Edited:** `src/components/PageLight.tsx` (add `viewTransitionName: 'page-light'`).
- **Edited:** `src/pages/Journeys.tsx` (swap `Link` for `TransitionLink`, add `viewTransitionName` on case images).
- **Edited:** `src/pages/Atherix.tsx`, `src/pages/Sonor.tsx`, `src/pages/Tacet.tsx` (add matching `viewTransitionName` on hero image).
- **Edited (light):** `Journal.tsx`, `Atrium.tsx`, `Contact.tsx`, `Index.tsx`, `Footer.tsx` where internal `Link`s exist, swap to `TransitionLink` so transitions fire from anywhere.

No changes to `App.tsx` routes, no library installs, no behavioral change for users on Firefox or with reduced motion.

---

## 6. Verification

After implementation:
1. Navigate `/` → `/journeys` → confirm 8px crossfade, header/footer don't blink.
2. Click a case card on `/journeys` → confirm hero image morphs into place on the case page.
3. Browser back from case → Journeys → confirm reverse morph.
4. Toggle `prefers-reduced-motion` in devtools → confirm instant cut, no broken state.
5. Check Firefox (or simulate by stubbing `startViewTransition`) → confirm instant cut fallback works.
