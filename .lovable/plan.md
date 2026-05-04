## Goal
On /contact, keep the existing 2x2 grid of 4 cards (Email, Schedule, LinkedIn, GitHub) but make each card visually distinct and more alive, while keeping mobile clean.

## Changes (src/pages/Contact.tsx)

### 1. Color accent per card
Each card gets a subtle gradient overlay and matching `ring-1` border tint, using existing semantic tokens, so they remain on-brand but instantly differentiable:
- Email: secondary gold tint (`from-secondary/15`)
- Schedule: warm primary gradient (`from-primary-fixed-dim/30`)
- LinkedIn: tertiary tint (`from-tertiary/15`)
- GitHub: neutral on-surface tint (`from-on-surface/10`)

Gradient sits behind content via an absolute layer, transitioning opacity 60% to 100% on hover.

### 2. Iconography treatment
Wrap each icon in a rounded square chip (`w-14 h-14`, surface-container background, soft border). Gives every card a clear visual anchor and a "launcher tile" feel.

### 3. Distinct CTAs
Replace the generic "Open" with channel-specific micro-copy:
- Email: "Write a message"
- Schedule: "Book a slot"
- LinkedIn: "Visit profile"
- GitHub: "Browse repos"

External links use `arrow_outward`, internal `arrow_forward`.

### 4. Hover polish
Add `hover:-translate-y-1` lift, stronger border on hover, and the gradient opacity transition. No new animations on mobile (hover states naturally don't fire on touch).

### 5. Mobile responsiveness
- Keep `grid-cols-1 md:grid-cols-2` so cards stack to a single column under 768px.
- Reduce card padding on mobile (`p-8 md:p-12`) so the chip + heading + CTA breathe without overflow.
- Use `text-3xl md:text-4xl` for the card title so it scales down on small screens.
- Pill/chip and CTA already wrap naturally; no absolute positioning that could clip.
- Verify at 375px and 390px viewports during QA.

## Out of scope
- No reordering or resizing of cards (grid stays 2x2 on desktop).
- No copy changes to hero or closing quote.
- No changes to `SOCIAL_LINKS`.

## QA
After implementation, check the preview at 1329px, 768px, and 375px:
- Cards remain 2x2 on desktop, single column on mobile.
- Each accent reads as distinct without breaking the palette.
- CTAs and chips never overflow.
- No em-dashes introduced (per project rule).
