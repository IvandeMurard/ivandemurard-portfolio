## Intent

Seven targeted edits. No new components, no new routes.

---

## 1. Navigation, "Stories" → "Case Studies"

`src/content/site.ts`, in `PRIMARY_NAV`, rename the first item label from `Stories` to `Case Studies`. The route `/journeys` stays unchanged so no link breaks.

## 2. Hero, circular centered halo

`src/pages/Index.tsx`, the halo div currently uses `w-[900px] h-[700px]` (oval). Make it a true circle: `w-[720px] h-[720px] max-w-[110vw] max-h-[110vw]`, kept centered with the existing `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`. Aspect stays 1:1 at every breakpoint, so it reads as a luminous disc behind the headline.

## 3. Signature line, business value + human interactions

`src/pages/Index.tsx`, replace the signature quote with a line that braids the two threads, no em-dashes:

> *"I read environments from the inside, then turn what I see into products that create real business value while keeping human interactions at the center."*

## 4. Funnel: rename "What I do" → "Why I care", widen the gap with "How I work"

Rename the upper section to **Why I care** (belief layer), keep **How I work** as the method layer. The two now read as funnel: *belief → method*.

`src/pages/Index.tsx` updates to `CAPABILITIES`:

- Section heading: *"Why I care"*
- Section subcopy: *"Three convictions that shape every product I build."*
- Card 1, Compass, *"Real business value"* — "Reducing operational costs, freeing capacity, sharpening decisions. Every product I ship has to move a number that matters to the business."
- Card 2, HeartHandshake, *"Human interactions first"* — "Technology should give time back to people, not pull them deeper into screens. The best automation is the one that lets a host be more present."
- Card 3, Cpu, *"Full-stack 0→1 craft"* — "From insight to shipped product, bridging digital interfaces and physical operations, so the experience holds together end to end."

For **How I work**, keep section heading and subcopy, but rewrite pillar 03 so agentic AI is one tool among many:

- 03 title: *"Right tool for the problem"*
- 03 body: "Sometimes a workflow, sometimes a checklist, sometimes an agentic system. I pick the lightest mechanism that solves the job, with the human always in the loop."
- Keep the `Cpu` icon, or swap to `Wrench` if available (Lucide has `Wrench`); using `Cpu` is fine to avoid a new import.

Also lighten **How I work** subcopy so the funnel is clearer:
- New subcopy: *"And how those convictions translate into a working method."*

## 5. Milestones, lift above the fold and expand to 8

`src/pages/Index.tsx`:

- **Move** the `Milestones` section out of its current position and place it directly after the Hero, before the Signature line. New page order:

```text
Hero
  ↓
Milestones (proof bar)
  ↓
Signature line (quiet breath)
  ↓
Case Studies
  ↓
Why I care (belief)
  ↓
How I work (method)
  ↓
Thank you
```

- **Expand** `MILESTONES` to 8 entries, displayed as a `grid-cols-2 md:grid-cols-4` with two rows on desktop. New full list:

  1. `5 yrs` — Product Management experience
  2. `10+` — Products launched (DomusVi, Bouygues Telecom, Opendatasoft, …)
  3. `2 yrs` — Co-founder & Product Lead, Sonor
  4. `3` — Shipped products: Sonor, Aetherix, Tacet
  5. `MCP` — Agentic architecture (Aetherix)
  6. `Field` — Hotel & F&B design partners
  7. `2` — Hackathons won
  8. `Paris` — Based

- Add subtle row separation: keep `md:divide-x divide-outline-variant/20` on each row, and a faint `border-t border-outline-variant/15` between the two rows on desktop (`md:[&>div:nth-child(n+5)]:border-t md:[&>div:nth-child(n+5)]:pt-12`) so the second row breathes.

## 6. Thank-you section, stronger blue presence

`src/pages/Index.tsx`, the Thank-you block currently uses `from-primary-fixed/50 via-surface-container-low to-primary-fixed-dim/30` which renders nearly cream. Deepen it:

- Outer gradient: `bg-gradient-to-br from-primary-fixed-dim/70 via-primary-fixed/60 to-surface-container-low`.
- Hover overlay: `bg-primary-fixed-dim/40` (was `/25`).
- Add a soft inner ring: `ring-1 ring-primary-fixed-dim/40`.
- Underline links go from `border-primary/30` to `border-primary/50` so the blue thread is consistent.

Result: the panel reads clearly as a Picasso-blue washed card on the cream background, instead of disappearing into it.

## 7. Memory

Save two project memories:

- `mem://design/punctuation` — *No em-dashes anywhere. Use commas, colons, parentheses.*
- `mem://design/positioning` — *Hospitality is felt, never named. Headline themes: business value, human interactions, full-stack 0→1 craft. Agentic AI is one tool among others, not the identity.*

Update `mem://index.md` Core with: *No em-dashes. Hospitality felt not named. Agentic is a tool, not the identity.*

---

## Files touched

- `src/content/site.ts` — nav label rename
- `src/pages/Index.tsx` — halo shape, signature copy, sections rename + reorder + new copy, Milestones expansion + relocation, Thank-you palette
- `mem://index.md`, `mem://design/punctuation`, `mem://design/positioning` — persistent rules

No CSS token changes, no new dependencies.

---

## Out of scope

- No edits to Field Notes, case study pages, About, Contact, Footer.
- No changes to halo opacity or pulse timing (kept from previous round).
- No changes to typography or color tokens.
