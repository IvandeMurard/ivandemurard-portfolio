## Intent

Make hospitality a **felt** quality of the site — through tone, imagery, pacing, micro-gestures — rather than a stated label. Enrich the homepage so it stands as a complete first impression. Replace the three Case Studies images with the uploaded color photos.

---

## 1. Remove explicit "hospitality" language (felt, not announced)

Goal: no visitor should read the word "hospitality" / "hospitalité" on public surfaces of the site, except where it is genuinely a *business domain* (Aetherix is for hotels — that stays, but reworded once).

| File | Current | New |
|---|---|---|
| `index.html` `<title>` | `Ivan de Murard — Digital Hospitality` | `Ivan de Murard — Product Builder` |
| `index.html` meta description | "rooted in the philosophy of high-hospitality…" | "A digital practice where AI-powered systems quietly deliver business impact while keeping the human at the center." |
| `index.html` og:title / og:description | same | mirror the new title/description |
| `src/index.css` header comment | "Digital Hospitality" | "Ivan de Murard — Product Builder" |
| `src/components/layout/SiteLayout.tsx` default title | `… Digital Hospitality` | `… Product Builder` |
| `src/pages/Index.tsx` hero subcopy | "A digital practice rooted in the philosophy of high-hospitality. I design and ship AI-powered systems…" | "A digital practice where AI-powered systems quietly deliver measurable business impact — reducing operational costs, eliminating waste, unlocking new value — while keeping the human at the center." |
| `src/pages/Atrium.tsx` intro paragraph | "philosophy rooted in digital hospitality" + "designing agentic AI systems for hospitality" | "philosophy rooted in care and craft" + "designing agentic AI systems for boutique hotel operations" |
| `src/pages/Contact.tsx` eyebrow | `The Concierge Desk` | `Get in touch` |
| `src/pages/Contact.tsx` body | "every conversation begins as it should: with care." | keep "with care" tone but drop concierge framing — "Choose the channel that suits you best — every conversation begins with attentive listening." |
| `src/content/site.ts` Aetherix `label` | `AI Agent • Hospitality Operations` | `AI Agent • Boutique Hotel Operations` |
| `src/pages/Journeys.tsx` Aetherix body | "The Hospitality Vision. An agentic AI…" | "An agentic AI framework for boutique hotel operations…" (drop the label) |
| `src/pages/Atherix.tsx` | Multiple visible mentions: page title, eyebrow `Project Detail / Hospitality AI`, H1 `Aetherix: The Hospitality Vision`, section heading `The Hospitality Vision`, `Core Design Principles for Hospitality AI`, "fully agentic hospitality mesh" | Reword to: page title `Aetherix — Boutique Hotel Operations AI`; eyebrow `Project Detail / Operations AI`; H1 `Aetherix: A new operating layer for boutique hotels`; section heading `The Vision`; `Core Design Principles for Operations AI`; "fully agentic operations mesh". The single French sentence about transforming automation into "expériences d'hospitalité humaines" → "expériences profondément humaines". One contextual mention "Food waste is one of the biggest challenges in hospitality" stays — it's a domain-fact quote, not a brand claim. The GitHub repo URL stays unchanged (external). |

Result: hospitality becomes the texture (typography, pacing, warm palette, halo, "with care" footer line, "thank you for your visit" panel) — never the headline.

---

## 2. Swap Case Studies images (color, uploaded)

Copy uploads into the project and reference them as ES6 imports in `src/content/site.ts`:

- `user-uploads://image.png` → `src/assets/case-sonor.jpg` (Paris rooftops with Eiffel Tower) → `PROJECTS.sonor.image`
- `user-uploads://image-2.png` → `src/assets/case-aetherix.jpg` (warm hotel lobby) → `PROJECTS.atherix.image`
- `user-uploads://image-3.png` → `src/assets/case-tacet.jpg` (Paris street with Eiffel Tower) → `PROJECTS.tacet.image`

Also, since the photos are now meant to read in **color**:

- `src/pages/Index.tsx` Case Studies cards: remove the `grayscale opacity-80` from `<img>` and the `bg-primary/15 mix-blend-multiply` overlay. Keep the gentle hover scale + a much lighter overlay (e.g. `bg-primary/5` → fully transparent on hover) so images feel alive but still cohesive.
- `src/pages/Journeys.tsx` Row images: remove `mix-blend-multiply opacity-80` so the same photos display in full color on the Stories page too.

---

## 3. Enrich the homepage

The current homepage is: Hero → Case Studies → Contact. Add three sections so it stands on its own as a richer first encounter, while staying calm and on-brand.

New homepage structure:

```text
1. Hero (existing, kept)
2. Signature line — one quiet sentence (NEW)
3. Case Studies (existing, with new color images)
4. What I do — three pillars (NEW)
5. Selected milestones / numbers (NEW)
6. Thank you for your visit (existing contact panel)
```

### 3a. Signature line (between Hero and Case Studies)

A single italic sentence on a soft band, full-width, generous vertical padding. Sets the tone without labeling it.

> "Designing systems that take care of the details, so people can take care of what matters."

Layout: centered, `font-headline italic`, ~3xl/4xl, on a thin top/bottom hairline divider. No CTA. Acts as a breath between hero and work.

### 3b. "What I do" — three pillars (after Case Studies)

A 3-column grid (stacks on mobile). Reuses the visual language of `Atrium.tsx` `PRINCIPLES` but tighter: small icon (Lucide), short title, 2-line body. Pillars:

1. **Product Strategy 0→1** — From insight to shipped product, bridging digital interfaces and physical operations.
2. **Agentic AI Systems** — Real-time agents that anticipate needs, reduce waste, and free teams to focus on what matters.
3. **Human-centered Craft** — Interfaces and operations designed to feel calm, attentive, and quietly precise.

Section heading: `What I do` (font-headline italic, sized like Case Studies). Subcopy one line: "A practice at the intersection of product, AI, and operations."

### 3c. Selected milestones (after the pillars)

A compact row of 3–4 numeric/credential highlights — visual rhythm, easy to scan. Pulled from the existing narratives (no new claims invented).

Tentative items (subject to your confirmation in the build step):
- `2 yrs` — Co-founder & Product Lead, Sonor
- `3` — Shipped products: Sonor, Aetherix, Tacet
- `0→1` — Products taken from concept to live
- `Open data` — Built on public datasets (Bruitparif, etc.)

If any of these doesn't feel accurate, I'll swap it for "Available for select collaborations" or remove the row. Visual: large `font-headline italic` number/keyword, small uppercase label below, divided by thin vertical hairlines on desktop.

### 3d. Hero refinements (small)

- Keep `IVAN DE MURARD` eyebrow, `Welcome. / It's great to see you!` headline, and the centered animated gold halo (already correct).
- Subcopy reworded as in §1 (no "high-hospitality").
- Keep the "Step inside" + "View the Journeys" CTAs.

---

## 4. Out of scope

- No changes to routing, header structure, footer (already done), or color tokens.
- No new dependencies.
- The `/atherix` route slug stays; only display copy changes.
- The Atherix case study page gets text reworded (per §1) but no layout change.

---

## Technical notes

- Image imports: `import sonorImg from "@/assets/case-sonor.jpg"` etc., then `image: sonorImg` in `PROJECTS`. Vite handles hashing/optimization. Both Index and Journeys consume `PROJECTS[x].image` so a single change updates both pages.
- Removing `grayscale` + `mix-blend-multiply` from the two consumers is a 2-line edit each.
- New homepage sections live inline in `src/pages/Index.tsx` (consistent with current pattern). No new components needed unless the file grows past ~250 lines, in which case I'll extract `HomePillars` and `HomeMilestones` into `src/components/home/`.
- All copy uses existing tokens (`text-primary`, `text-on-surface-variant`, `font-headline`, `font-label`) — no Tailwind config changes.
