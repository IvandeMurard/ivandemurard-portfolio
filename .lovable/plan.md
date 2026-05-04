## Goal
Add visible keyboard focus styles and accessible labelling to the 4 contact cards on /contact.

## Changes (src/pages/Contact.tsx)

On each card `<a>`:
- Add `aria-label={`${c.label}: ${c.desc}${c.external ? " (opens in a new tab)" : ""}`}` so screen readers announce the channel, its purpose, and that external links open in a new tab.
- Append focus classes: `focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-background`. This produces a clear gold focus ring on keyboard navigation only, without disturbing mouse users (the existing decorative `ring-1` accent stays).

No changes to icons (already inside the link, decorative), no changes to copy.

## QA
- Tab through the cards in the preview at desktop width and confirm a clear gold ring appears on the focused card.
- Confirm clicking with mouse does not trigger the focus ring (focus-visible).
- Spot-check at 375px that the ring is not clipped (ring-offset-4 sits inside the section padding).
