## Problem

The turntable SVG is fiddly at small sizes, sits awkwardly next to the day/dusk toggle, and the active state (tonearm + spinning ellipse) doesn't read cleanly. Silentsongs solves the same problem with a tiny, restrained glass button: a single icon that swaps between "muted" and "playing" states, no decorative hardware.

## Direction

Replace the turntable illustration with a small, square-ish glass pill that matches the day/dusk toggle's footprint and visual weight. Inside: just an icon, with a soft pulse when audio is playing.

```text
[ day/dusk pill ]  [ ◐ sound pill ]   email  cal  in  gh
```

Reference cues taken from silentsongs.com:
- Glass/blurred surface, very low contrast border
- Single line-weight icon, no fills
- Icon morphs between two states (they cross-fade moon/sun; we'll cross-fade muted/unmuted)
- Subtle motion only when active (a slow opacity pulse, not spinning)

## Visual spec

- Shape: rounded-md pill, same height as the day/dusk switch (~h-7), width ~w-9 so it sits as a quiet sibling, not a competing graphic.
- Surface: `bg-surface-container/60` with `backdrop-blur-sm`, `border-outline-variant/40`. On hover: border lifts to `secondary/50`, slight `scale-[1.04]`.
- Icon: lucide `Volume2` when playing, `VolumeX` when muted. Stroke `currentColor`, color `text-on-surface-variant`, `text-secondary` when active. Size 14px.
- State transition: cross-fade + tiny scale between the two icons (200ms), so the swap feels intentional like silentsongs' moon/sun morph.
- Active affordance: a 2px dot to the right of the icon, `bg-secondary`, animating with the existing `ambience-pulse` keyframe. Hidden when muted. This is the only "it's on" cue, replacing the spinning record.
- Focus ring and aria-checked behaviour kept from the current component.

## Why this works better

- Same silhouette as the day/dusk toggle, so the header reads as two small controls rather than "switch + miniature appliance".
- No tiny moving parts to misread at 44px wide.
- Active state is unambiguous: icon changes, accent dot pulses.
- Honors the project's restraint (no em-dashes, hospitality felt not named, minimal ornamentation).

## Technical changes

- `src/components/AmbienceControl.tsx`: remove the SVG turntable. Render a `<button role="switch">` containing a relative wrapper with two stacked lucide icons (`Volume2`, `VolumeX`) cross-fading via opacity, plus an absolute-positioned pulse dot shown only when `!muted`. Keep the existing `useAmbience` hook, `available` gate, and `toggleMute` handler. Keep the `size` prop with `sm`/`md` mapping to slightly different paddings so the header desktop and mobile slots both look right.
- `src/index.css`: keep `ambience-pulse`. Remove `ambience-spin` if nothing else references it (will verify before deleting).
- `src/components/layout/AtriumHeader.tsx`: no structural change; the new control drops into the same two slots.

No changes to the audio engine, crossfade, or file paths.
