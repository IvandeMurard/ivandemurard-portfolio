## What's wrong with the current toggle

Looking at both screenshots side by side, three things are working against affordance:

1. **The knob looks like a status indicator, not a control.** A single warm dot reads as "an LED is on" rather than "slide me." There's no visible track contrast.
2. **The sun and moon glyphs are too faint and too small** (12px, 30 to 90% opacity). At a glance they disappear, so users lose the day/night metaphor.
3. **No label, no tooltip, no first-time hint.** Even users who recognise it as a switch don't immediately know *what* it switches.

Your "blue dot in day mode" instinct is good but misplaced. Toggles read most clearly when the knob shows the **current** state, not the destination. Inverting it breaks the convention used by iOS, macOS, and every hospitality lighting panel I can find. Better to keep the knob honest and let the **track** carry the destination cue.

## The fix, four small moves

### 1. Make the track tell the story

Right now the track is the same neutral surface in both modes. Change that:

- **Day**: track shows a warm cream-to-honey gradient on the right half (where the moon waits), faintly glowing. Visual message: "evening lives over there."
- **Dusk**: track shows a soft cool indigo gradient on the left half (where the sun waits). Visual message: "morning lives over there."

The knob itself stays as the warm brass element in both modes. It represents *the light that is currently on in the room*, which is always warm because the lamp is always lit, only the surroundings change. This matches the In Common With reference perfectly.

### 2. Brighter, larger glyphs, always visible

- Bump glyph size from 12px to 14px.
- Change the contrast ratios: the *active* glyph (sun in day, moon in dusk) sits at full opacity in `--secondary`. The *inactive* glyph stays visible at ~55% (was 30%) so both metaphor anchors are always legible.
- Slightly increase stroke weight from 1.5 to 1.75 for crispness at small size.

### 3. A quiet "Ambience" micro-label

Add a small italic label `Ambience` to the *left* of the toggle in the desktop header, in the same `font-headline italic text-xs text-on-surface-variant` style as the nav. This is the single biggest scannability win, it tells the user what the control is in under a glance, and it fits the editorial tone.

On mobile, skip the label (space is tight) but keep the existing `aria-label`.

### 4. A first-visit tooltip, then never again

On first page load (no `localStorage["mood-tooltip-seen"]`), after a 1.2s delay, show a small tooltip below the toggle: *"Switch from afternoon to evening light"*. Fades in over 600ms, dismisses on any interaction or after 4s, sets the flag so it never appears again. Uses the existing `cubic-bezier(0.22, 1, 0.36, 1)` curve.

This is the hospitality move: the room shows you the switch once, gracefully, then trusts you.

### 5. Slightly larger touch target

Bump the desktop track from `h-7 w-14` to `h-8 w-16`, knob from `h-6 w-6` to `h-7 w-7`. Mobile stays as-is. Better fingertip target, more obvious as a control.

## What you'll see

- **Day mode**: small italic *Ambience* label, then a track that fades from neutral on the left into a soft amber glow on the right (where the moon glyph sits, now clearly visible), warm brass knob on the left.
- **Dusk mode**: same label, track fades from cool indigo on the left (where the sun glyph sits) into neutral on the right, warm brass knob on the right.
- **First visit**: a brief tooltip appears once, then the system trusts you.
- **At any zoom**: the sun and moon are now both legible, so the metaphor is instant.

## Files to edit

- `src/components/MoodToggle.tsx`, restructure track gradients per mood, enlarge glyphs and knob, raise inactive opacity, optional `label` prop for desktop *Ambience* text, integrate first-visit tooltip with localStorage flag.
- `src/components/layout/AtriumHeader.tsx`, render `<MoodToggle label="Ambience" />` on desktop, plain `<MoodToggle size="sm" />` on mobile.

No new dependencies. No changes to `MoodProvider`, `index.css`, or any other file.

## On the inverted-color knob idea

I'd skip it. Two reasons:
1. It breaks the "the knob is the current state" convention, which is the one piece of toggle grammar everyone already knows.
2. The cool/warm story is better told by the *track*, because the track is the room and the knob is the lamp. That mental model maps cleanly onto your hospitality framing and onto what the page itself does when toggled.

The track-gradient + brighter-glyphs + label combination gets you the same "you can tell what this does at a glance" outcome without the cognitive friction.
