## Why the current wash feels invisible

The crossfade is wired correctly, but it's competing with itself: the cream `--surface` underneath is so warm that the gold `::after` layer adds almost no perceptual change at the bottom, and the blue `::before` only registers near the very top of the hero. The result reads as "white/blue throughout", not as a journey.

You also like the hero balance as-is. So instead of pushing the scroll wash harder (which would break the hero), let's reframe the whole idea:

> **The page has two states: Day and Dusk. Scroll nudges the ambience subtly. A manual analog toggle commits to the full evening mood.**

This matches your hospitality reference (In Common With) where lights don't blast on, they warm.

## The model

Three layers of light, in increasing intensity:

1. **Theme state** (Day | Dusk), set by the toggle, persisted in `localStorage`. Drives the base palette via a `data-mood` attribute on `<html>`.
2. **Scroll ambience**, the existing `--page-light-progress`, but scoped to a much narrower, more felt range. In Day mode it warms the page slightly toward late afternoon as you descend. In Dusk mode it deepens further into evening.
3. **Accent halos** on hero and Thank-you stay where they are.

### Day mode (current default, refined)

- Surface stays cream.
- Hero keeps its current Picasso-blue ambience (you like it).
- As you scroll, a warm amber/honey wash fades in at the bottom, reaching ~40% by the Thank-you card. Soft, not gold-blob.

### Dusk mode (the new toggle target)

- Surface shifts to a deeper warm tone: think candlelit room, not dark mode. Background goes from cream `42 41% 97%` to a warm taupe `35 18% 14%`.
- Text inverts to warm cream `38 30% 92%`.
- Picasso-blue accents stay (they read beautifully on warm dark, like a Hopper night scene), but desaturate slightly.
- Gold accents intensify, halos glow warmer, like sconces coming on.
- Scroll ambience in Dusk: top is cooler indigo evening, bottom is full amber lamplight.

### The transition between modes

This is where it earns its keep:

- Toggle Day → Dusk: a **2.4s ease** crossfade on every color token. The page literally dims like a hotel lobby at sunset. No jarring flip.
- All token transitions use the same `cubic-bezier(0.22, 1, 0.36, 1)` curve we use for reveals, so it feels like one continuous breath.
- Halos brighten on a small delay (300ms) so lamps "come on" after the room darkens, the In Common With moment.

## The analog toggle

Placed in the header, right side, before the utility icons. Replaces nothing, sits as a quiet ritual element.

Visual:
- A slim brass-toned **knob** (about 44 x 24px) inside a recessed track.
- Track has subtle inset shadow, like a brushed metal channel.
- Knob is a small cream-to-gold circle with a faint highlight, casts a soft drop shadow on the track.
- On the left of the track: a tiny sun glyph (lucide `Sun`). On the right: a tiny moon-with-warmth glyph (lucide `Moon`). Both fade in/out by 30% based on state, never fully hidden.
- Knob slides with a slight overshoot (`cubic-bezier(0.34, 1.56, 0.64, 1)`), 600ms, so it feels weighted, not snappy. Like a real switch with a spring.
- On hover: knob lifts 1px, shadow deepens.
- On click: a tiny "click" haptic-feel via a 80ms inner-shadow flash on the track. No sound.
- Respects `prefers-reduced-motion`: instant swap, no overshoot.

Accessibility:
- `role="switch"`, `aria-checked`, `aria-label="Toggle ambience"`.
- Keyboard: Space/Enter toggles. Visible focus ring in `--secondary`.

Persistence:
- First visit: respects `prefers-color-scheme`. If user has dark, default to Dusk. Otherwise Day.
- Once user toggles, `localStorage["mood"]` wins forever.

## Implementation plan

### 1. New theme tokens, `src/index.css`

Keep `:root` (Day) as today. Add a `[data-mood="dusk"]` block that overrides:

- `--surface` and surface-container scale to warm dark taupes (not pure black, kept warm).
- `--on-surface` to warm cream.
- `--primary-fixed` slightly desaturated, still the Picasso blue family.
- `--secondary-fixed` pushed warmer and brighter, this is the lamplight.
- `--outline-variant` to a low-contrast warm gray.

Add a global transition on `html` for `background-color, color`, 2400ms with the slow-out curve. Add the same transition on `.page-light::before/::after` opacities.

### 2. Theme provider, `src/components/MoodProvider.tsx` (new)

Tiny React context:
- Reads `localStorage["mood"]`, falls back to `prefers-color-scheme`.
- Sets `document.documentElement.dataset.mood = "day" | "dusk"`.
- Exposes `{ mood, setMood, toggle }`.
- Wraps in `App.tsx` around the router.

### 3. The toggle, `src/components/MoodToggle.tsx` (new)

Pure CSS + Tailwind, no extra deps. Custom-built (not Radix Switch) because we need the analog character: brass knob, recessed track, sun/moon glyphs, overshoot motion. Respects reduced-motion.

Mounted in `AtriumHeader` between the center nav and the utility icons.

### 4. Refine `.page-light`, `src/index.css`

Two adjustments:
- **Strengthen the gold layer** in Day mode so the journey actually reads. Bump `::after` peak opacity from 0.55 to 0.7, and warm its color toward honey (`38 80% 75%`) instead of pure secondary-fixed. Keep blue as-is.
- **Different gradients per mood**: under `[data-mood="dusk"]` the `::before` becomes deep indigo evening, `::after` becomes amber lamplight. Same `--page-light-progress` variable drives both.

### 5. Reduced-motion

Already handled globally for animations. Add an explicit override so the 2.4s mood crossfade collapses to 0ms when `prefers-reduced-motion: reduce`.

## What you'll feel

- **Day, scrolling down**: hero stays cool and balanced (unchanged). By mid-page the cream warms, by the Thank-you card the room glows late-afternoon honey. Subtle, never theatrical.
- **Tap the toggle**: knob slides with weight, the room dims over ~2.5s. Walls go warm taupe, lamps (halos) come on a beat later. Picasso-blue accents now sit on warm dark like night-window light.
- **Dusk, scrolling**: top is indigo evening, bottom is full lamplight amber.
- **Tap again**: morning returns just as slowly.

## Files to create

- `src/components/MoodProvider.tsx`
- `src/components/MoodToggle.tsx`

## Files to edit

- `src/index.css`, add `[data-mood="dusk"]` token overrides, slow `html` color transition, mood-aware `.page-light` gradients, stronger Day gold layer.
- `src/App.tsx`, wrap routes in `MoodProvider`.
- `src/components/layout/AtriumHeader.tsx`, mount `MoodToggle` between center nav and utility icons (and in mobile overlay).

No new dependencies, no schema, no routing changes.

## Open question

One small choice for you, do you want the toggle visible on every page including case studies, or only on the homepage? My recommendation: every page, it's part of the site's identity, like a hotel that adjusts its lights regardless of which room you're in.
