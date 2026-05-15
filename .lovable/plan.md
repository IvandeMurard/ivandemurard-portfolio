## Add idle fade to BrandCursor

Extend `src/components/BrandCursor.tsx` with a "cursor rest" behavior: dim the dot when the pointer sits still, restore it on movement.

### Behavior

- After 1500ms of no `mousemove`, fade dot to 18% opacity over 400ms ease-out.
- On any `mousemove`, instantly restore to full opacity (no fade-in).
- Never dim while: hovering an interactive element, mouse pressed, or cursor outside the window.
- Scroll does not reset the idle timer (reading-without-moving stays dimmed).

### Implementation notes

- Add `idleRef` (boolean) and `idleTimer` (number) refs.
- In `onMove`, clear timer, set `idleRef.current = false`, restore opacity, then schedule a new timer that sets `idleRef.current = true` and lowers opacity if not hovering/pressed/suppressed.
- Centralize opacity logic in a small `setOpacity()` helper so suppress (forms/iframes) still wins over idle, and hover/press always force visible.
- Clean up the timer in the effect's return.
- No new dependencies, no API changes, no impact on `SiteLayout`.
