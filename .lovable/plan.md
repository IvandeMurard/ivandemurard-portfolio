## Diagnosis

The slow ambience crossfade lives in `src/index.css` (lines 152-166). It applies `transition: background-color, color, border-color 2400ms` to:
- `html, body`
- a hardcoded list of selectors: `nav, header, footer, main, section, article, aside, .glass-nav` and class-substring matches for `bg-surface*`, `text-on-surface*`, `border-outline*`, `bg-primary*`, `text-primary*`, `bg-secondary*`, `text-secondary*`.

The list is incomplete. Text using any of these utilities transitions instantly because they're not matched:
`text-foreground`, `text-on-primary`, `text-on-primary-container`, `text-on-secondary`, `text-on-tertiary-fixed-variant`, `text-outline`, `text-outline-variant`, `text-muted-foreground`, `text-secondary-fixed`, `text-primary-fixed-dim`, `text-surface`, `text-surface-bright`, `text-surface-dim`, `text-card-foreground`, `text-popover-foreground`, `text-accent-foreground`, `text-destructive`, `text-destructive-foreground`, `text-sidebar-foreground`, `text-sidebar-accent-foreground`.

Result: the background breathes over 2.4s, but most text snaps. Hence the broken effect the user noticed.

## Fix

Replace the hardcoded selector list with a universal base rule that applies the 2.4s easing to every element's color, background, and border tokens. Keep the existing easing curve so the tempo is unchanged.

```css
*, *::before, *::after {
  transition-property: background-color, color, border-color, fill, stroke;
  transition-duration: 2400ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
```

This covers:
- All text colors (the missing ones listed above), so text now fades at the same tempo as the surface.
- SVG `fill` and `stroke` (icons, the SectionDivider hairline, illustrations), so iconography matches.
- Borders, in case any are themed.

### Why this won't break existing motion

- Tailwind's `transition-colors`, `transition-all`, `transition-[bg]` utilities have higher specificity than `*` and override per-component (e.g. nav links keep their fast hover, the MoodToggle keeps its 700ms, buttons keep their 300ms hover). I'll grep to confirm: any element that already declares its own `transition` keeps it.
- `prefers-reduced-motion` already forces `transition-duration: 0.01ms !important` on line 639, so accessibility behavior is unchanged.
- No layout or paint thrash, color/bg/border interpolation is GPU-friendly.

### What gets removed

The redundant block at lines 158-166 (long selector list) goes away. The `html, body` rule at lines 152-156 stays as a fallback for inherited `color` on text without explicit utilities.

## Files affected

- `src/index.css` only. About 10 lines changed.

## Verification

1. Toggle dark/light. Background, text, and icons should now all fade in lockstep over ~2.4s.
2. Hover states on nav links, buttons, the MoodToggle still feel snappy (their own transitions win).
3. Spot-check Tacet's Horizon paragraph (the one we just rewrote) and the Synergy cards. Both currently snap; both should breathe after the fix.
