## Objective
On the homepage hero, the two CTAs currently both link to `/journeys`. Update them so each has a distinct destination and a clear label.

## Changes

### 1. Homepage hero CTAs (`src/pages/Index.tsx`)
Update the two links in the hero CTA group:

```text
Primary (filled button):
  Label: "Case Studies"
  Destination: /journeys

Secondary (text link with arrow):
  Label: "About"
  Destination: /atrium
```

Keep the existing visual styles: primary remains a filled button, secondary remains an underlined text link.

### 2. Optional click tracking
Add `useTrackClick` calls to both CTAs for consistency with other tracked links on the page, using `kind: "navigate"`.

## Verification
- Run `bunx tsc --noEmit` to confirm no type errors.
- Check the homepage preview to confirm the two buttons now read "Case Studies" and "About" and point to distinct routes.