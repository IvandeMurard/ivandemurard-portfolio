## Plan: tap haptics + keyboard focus polish

Quiet, hospitable feedback. No click sounds (would clash with ambience). Haptics where they confirm a deliberate choice. One consistent gold focus ring everywhere.

### 1. New hook: `src/hooks/useHaptic.ts`

```ts
type Pattern = "tap" | "toggle" | "select";
const PATTERNS: Record<Pattern, number | number[]> = {
  tap: 10,
  toggle: [6, 40, 6],
  select: 12,
};
```

Returns `(pattern) => void`. No-ops when:
- `navigator.vibrate` is undefined (iOS Safari, desktop)
- `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- `window.matchMedia('(hover: hover)').matches` (treat hover-capable devices as desktop, skip vibration)

### 2. Wire haptics into deliberate-action surfaces

- `MoodToggle.tsx`: `toggle` pattern in onClick
- `AmbienceControl.tsx`: `toggle` pattern in onClick
- `Contact.tsx` cards: `tap` pattern in onClick
- `AtriumHeader.tsx` mobile menu hamburger: `tap` pattern

Skipping: nav links, footer links, hover states. Too noisy.

### 3. Global focus-visible style in `src/index.css`

In `@layer base`, add:

```css
:where(a, button, [role="button"], [role="switch"], input, select, textarea, summary):focus-visible {
  outline: 2px solid hsl(var(--secondary));
  outline-offset: 2px;
  border-radius: 4px;
}
```

Uses `:where()` so specificity is 0, components can still override (Contact cards already have a richer ring, that wins). This catches all the ad-hoc cases (nav links, footer, journal cards, utility icons) without touching each file.

### 4. No sound

Documented decision: ambience is the sound surface, per-tap clicks would conflict.

### Files

- create `src/hooks/useHaptic.ts`
- edit `src/components/MoodToggle.tsx`
- edit `src/components/AmbienceControl.tsx`
- edit `src/components/layout/AtriumHeader.tsx`
- edit `src/pages/Contact.tsx`
- edit `src/index.css`

### QA

- Desktop: tab through header, confirm gold ring on every link/icon/toggle. No vibration attempted (hover:hover guard).
- Android Chrome: tap mood toggle, ambience toggle, contact card, hamburger. Feel a brief pulse. Other taps stay silent.
- iOS Safari: silent (no API), no errors.
- Reduced motion enabled: no vibration on any surface.
