## Intent

Six small, surgical changes. No structural rewrites.

---

## 1. Hero (`src/pages/Index.tsx`)

- Replace `Welcome.` with `Welcome,` (period becomes comma, italic preserved).
- Subtitle: replace the opening words `A digital practice where` with `I build`. Full new line:
  > "I build AI-powered systems that quietly deliver measurable business impact by reducing operational costs, eliminating waste, sharing intelligence, while keeping the human at the center."
- Remove the "Descend" indicator (the bottom block with the vertical hairline and `Descend` label).
- Make the gold halo slightly more present and alive:
  - In `src/index.css`, push opacity in `.gold-halo` (0.55 → 0.7 inner, 0.25 → 0.35 mid) and reduce blur (60px → 50px) so it reads as light, not haze.
  - Strengthen the pulse: keyframes go `0.7 → 1.0` opacity, scale `1 → 1.06`, cycle shortened from 7s to 5s for a more "alive" breath.

## 2. Navigation underline (`src/components/layout/AtriumHeader.tsx`)

Add a thin elegant divider under the nav bar. On the `<nav>` element, append `border-b border-outline-variant/20` so a hairline sits below the bar without breaking the existing translucent glass treatment.

## 3. Case Studies, new Tacet image

- Copy `user-uploads://image-4.png` to `src/assets/case-tacet.jpg`, overwriting the current asset (the import in `src/content/site.ts` stays the same, so it propagates everywhere automatically).

## 4. Restore "What I do" as a complement to "How I work" (`src/pages/Index.tsx`)

Keep `How I work` (sequential method, 01/02/03) as is. Add a second, distinct section above or below it titled **"What I do"** with the three cards from the screenshot:

1. *Product Strategy 0→1* — From insight to shipped product, bridging digital interfaces and physical operations.
2. *Agentic AI Systems* — Architectures and real-time agents that anticipate needs, reduce waste, and free teams to focus on what matters : human interactions.
3. *Human-centered Craft* — Designing holistic user journeys and services with the right balance between technology and human interactions.

Each card uses a Lucide icon (Compass, Cpu, HeartHandshake — same icon set already imported), italic headline, no numerals (numerals stay reserved for `How I work` to keep the two sections visually distinct).

Section subcopy under the heading: *"A practice at the intersection of product, AI, and operations and human interaction."*

Order on the page:

```text
Hero → Signature line → Case Studies → What I do (capabilities) → How I work (method) → Milestones → Thank you
```

This way "What I do" reads as **capabilities** (full-stack 0→1, human-centered) and "How I work" reads as **method** (read the ground → product decisions → agentic ecosystems). They complement, they don't repeat.

## 5. Milestones, add a section title (`src/pages/Index.tsx`)

Add a heading block above the four-column row, matching the typographic style of the other section headings:

- Heading: *"Milestones"* (font-headline italic, 4xl/5xl, text-primary)
- Subcopy: "A few markers along the way."

Same left-aligned `max-w-2xl` block used by the other sections, with consistent bottom margin before the row.

---

## Files touched

- `src/pages/Index.tsx` — hero copy + remove Descend + add "What I do" section + Milestones title
- `src/index.css` — halo opacity, blur, pulse keyframes
- `src/components/layout/AtriumHeader.tsx` — bottom hairline border on `<nav>`
- `src/assets/case-tacet.jpg` — overwritten with new uploaded Paris street image

No new components, no new routes, no new dependencies.

---

## Out of scope

- No changes to typography, color tokens, or component library.
- No edits to Field Notes, case study pages, About, or Contact.
- No re-architecture of the homepage beyond inserting the "What I do" section and the Milestones title.