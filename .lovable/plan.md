# Page-by-page motion plan

Approved order: **Journeys, then Atherix/Sonor/Tacet, then Contact, then Atrium polish.**

All four phases share the same easing (`cubic-bezier(0.22, 1, 0.36, 1)`), the same motion distances (8/12/4 px), and the same `prefers-reduced-motion` shutoff already in `index.css`. No new dependencies, no Framer Motion, no JS animation libraries. Everything is built on the existing `data-reveal` / `data-reveal-child` primitive plus a few small CSS utilities.

---

## Phase 0, shared primitives (one small CSS pass in `src/index.css`)

Add these once, reuse on every page:

- `.case-row` with two children `.case-row-image` (12px Y + opacity, 900ms) and `.case-row-text` (8px Y + opacity, 900ms, 120ms behind). Driven by `data-revealed`.
- `.headline-ink` italic headline ink-in: opacity 0 to 1 + clip-path inset reveal left to right, 1100ms.
- `.divider-fall` 1px gold vertical/horizontal line that grows from 0 to full length on reveal, 700ms.
- `.kenburns` very slow scale 1.00 to 1.04 over 14s, paused if reduced-motion.
- `.lift-card` hover utility, translateY(-2px) + shadow deepen, 400ms.
- `.icon-shift` group-hover icon nudge, 3px X, 300ms.
- `.halo-drift` very slow X/Y drift on `.hilma-circle`, 60s loop, ±6px.

All ambient loops respect the existing reduced-motion media query. No new keyframes outside that block.

---

## Phase 1, Journeys (`src/pages/Journeys.tsx`)

Highest payoff, lowest risk. Goal: each case study row arrives like a page turn.

1. Wrap the hero header in `<Reveal>`. Apply `.headline-ink` to the "Case studies" italic h1 so the word reveals left to right behind a soft mask. The `pl-12` second line gets a 200ms delay child reveal.
2. Convert the `Row` component:
   - The whole row becomes a `<Reveal>` container (threshold 0.2).
   - Image wrapper gets `data-reveal-child` + `.case-row-image` (12px lift).
   - Text column gets `data-reveal-child` + `.case-row-text` (8px lift, 120ms behind via `--reveal-delay`).
   - The CTA link gets a third `data-reveal-child` at 220ms with `.icon-shift` on the arrow.
3. Image hover: keep the existing `CaseHoverPreview`. Add a quiet 0.5px letter-spacing shift on the row's `<h2>` when the parent row is hovered (300ms). No scale, no lift, no rotation.
4. Hilma circles: add `.halo-drift` so the corner ornaments breathe slowly. Pure ambient loop, GPU-only.
5. Bottom CTA section: wrap in `<Reveal>`, the divider becomes `.divider-fall` (line grows down), then headline ink-in, then button at 300ms delay.

Risk: tiny. Only adds attributes and one wrapper component per row.

---

## Phase 2, Case study pages (`Atherix.tsx`, `Sonor.tsx`, `Tacet.tsx`)

Same primitives, same rules, applied identically to all three so they feel like one body of work.

1. Hero image: add `.kenburns` to the hero cover image (1.00 to 1.04 over 14s). Single-pass, then settles. Honors reduced-motion.
2. Hero headline: `.headline-ink` on the italic h1, plus 80ms staggered `data-reveal-child` on the eyebrow label, h1, and intro paragraph.
3. Section dividers: replace the static thin gold lines (where they exist) with `.divider-fall`. Each section's divider falls in as you reach it.
4. Body sections: wrap each major section in `<Reveal>`. Stagger the children at 80ms.
5. Stats / numbers (where present, e.g. Sonor's metrics): use the existing `CountUp` component if not already wired, with a 1.2s ease-out window starting on reveal. If already wired, keep as-is.
6. "Next case" / footer CTA: same pattern as Journeys CTA, divider-fall + headline ink + button.

Outcome: all three case studies share the exact same arrival rhythm. The reader's eye learns the pattern on the first page and trusts it on the next two.

---

## Phase 3, Contact (`src/pages/Contact.tsx`)

Goal: warm, attentive feel. The page should feel like a host walking toward the door.

1. Page heading: `<Reveal>` + `.headline-ink` on the italic h1, eyebrow at 0ms, h1 at 100ms, supporting paragraph at 220ms.
2. Contact cards (Email, Schedule, LinkedIn, GitHub): wrap the card grid in `<Reveal>`, each card is a `data-reveal-child` with 80ms stagger.
3. Card hover: add `.lift-card` (2px up + shadow) and `.icon-shift` on the card's icon. Existing `useTrackClick` calls are untouched.
4. If the page has a halo or hilma ornament, add `.halo-drift`.

---

## Phase 4, Atrium polish (`src/pages/Atrium.tsx`)

Already uses `<Reveal>` heavily. Just polish, no restructuring.

1. Portrait halo: tune `.gold-halo-pulse` opacity range from 0.85→1.00 to a softer 0.55→0.85 (calmer breath). Done by adjusting the existing `gold-halo-breathe` keyframe values, no new keyframe.
2. Hero h1: apply `.headline-ink` to the italic line. The "a Product Builder." second line stays as-is, just gets a 200ms `data-reveal-child` delay.
3. Track record cards: keep the existing reveal stagger. Add `.lift-card` so each card answers a hover with a 2px lift.
4. Now projects: same `.lift-card` + `.icon-shift` on the trailing arrow.
5. Principles dark band: wrap in `<Reveal>`, fade the `turner-gradient-warm` overlay from 0 to 15% over 1.2s on reveal (override the static `opacity-15` with a CSS variable driven by `data-revealed`).
6. Method cards: already revealed and staggered. Add `.lift-card` only.
7. "Let's talk" farewell card: divider above (a new `.divider-fall` line, 60px tall, centered above the card) + soft 4px lift on the buttons via `.icon-shift` on their arrow icons.

---

## Technical details

**Files touched**

- `src/index.css`, add the shared utility classes and keyframes (Phase 0).
- `src/pages/Journeys.tsx`, refactor `Row` to use `<Reveal>` + `data-reveal-child`, ink-in headline, halo drift.
- `src/pages/Atherix.tsx`, `src/pages/Sonor.tsx`, `src/pages/Tacet.tsx`, hero ken burns, ink-in, section reveals, dividers.
- `src/pages/Contact.tsx`, headline ink, card stagger, lift + icon-shift.
- `src/pages/Atrium.tsx`, headline ink, lift on cards, divider above farewell, principles overlay fade.
- No changes to `Reveal.tsx` or `useReveal.ts`. They already do what we need.
- No new dependencies.

**Constraints honored**

- One easing curve everywhere: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Motion distances: 8 px headlines, 12 px images, 4 px body. Hover lifts 2 px.
- No scale > 1.05, no rotation, no spring/bounce, no duration < 300 ms or > 1500 ms outside ambient loops.
- All ambient loops disabled by the existing `prefers-reduced-motion` block.
- No new third-party libraries.

**Out of scope**

- Home (`Index.tsx`) is intentionally untouched, per your earlier instruction.
- Journal pages, NotFound, headers, footers: not in this batch.

---

## Delivery

I will ship one phase per message so you can review the feel before moving on. Starting with Phase 0 + Phase 1 (Journeys) in the next message.