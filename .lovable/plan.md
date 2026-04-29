# Ambience: bind soundtrack to day/dusk, with separate mute

## Decision
- The mood toggle (day/dusk) controls **both** the light and the soundtrack.
  - Day → smooth Brazilian downtempo (Bala Desejo, Castello Branco, Caetano Veloso, Ignacio Maria Gomez register).
  - Dusk → uptempo UK new-jazz / soul (Ezra Collective, Kokoroko, Thee Sacred Souls register).
- A **separate small control** (tonearm-style icon, near the mood toggle) lets visitors mute/unmute without changing the light.
- Audio is **off by default**. First play requires an explicit user gesture (browser autoplay policy, and respectful default for a CV-like site).
- Mute state and last-known volume are persisted in `localStorage`.
- Crossfade (~800ms) when switching between day and dusk tracks.
- Respects `prefers-reduced-motion` only for visual animation of the tonearm; not for audio.

## Header label
- Removed "Ambience" text label next to the mood toggle to gain breathing room. The toggle stands alone.

## Music sourcing (next decision, not built yet)
Three viable paths, in order of recommendation for a professional site:
1. **Licensed library** (Musicbed, Artlist, Epidemic Sound) — pick 1 day track + 1 dusk track in the requested registers. Safe, clearable, sounds like the real thing.
2. **Bespoke ElevenLabs Music** generations tuned to those registers. Original, no licensing risk, slight quality variance.
3. Commission a short loop from a musician on Fiverr/SoundBetter in those registers. Original, fully owned.

## Components to build (next turn)
- `AmbienceProvider` (context): holds `muted`, `volume`, `currentTrack`, exposes `toggleMute`. Reads `mood` from `useMood`. Manages two `<audio>` elements with crossfade.
- `AmbienceControl` (tonearm): small analogue control next to `MoodToggle` in the header. Shows tonearm "lifted" when muted, "down on the record" when playing. Subtle rotating disc behind it when playing.
- File slots: `public/audio/day.mp3` and `public/audio/dusk.mp3` — empty until tracks are sourced. Component checks for file presence and gracefully hides the control if files are missing, so nothing ships half-built.

## Out of scope for this turn
- No audio code yet.
- No tonearm component yet.
- No track files yet.
