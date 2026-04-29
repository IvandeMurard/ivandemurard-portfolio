## Why this page needs work

The About page reads like a brochure written by someone else: third-person voice, a "Chapter One" that promises sequels, two stock portraits that aren't you, and a "Principles" band that turns washed-out blue in dusk mode. It also under-sells the actual track record (Sonor, Opendatasoft, Bouygues Telecom 1.9M EUR / 40% recovered, DomusVi 500+ users / 100 sites, plus Aetherix, Tacet, EvalLabs, Kissa, Lore on GitHub). Recruiters and prospects land here and don't get the proof.

The new page keeps the warm, painterly art direction of the site, switches to first person throughout, surfaces the CV and the GitHub work, fixes the dusk band, and converts on three CTAs.

## New structure

```text
1. Hero, first person                "I'm Ivan. I build products."
2. Origin                            Engineering to product, why I build
3. Track record                      Timeline with metrics (CV roles)
4. Now, building in public           Aetherix, Tacet, EvalLabs, Kissa, Lore
5. Principles I build with           3 cards, fixed dusk mode
6. How I work                        Problem analysis, Build, Discovery, Documenting
7. Let's talk                        3 prioritised CTAs
```

Each section gets a quiet lower-case label above it (Origin, Track record, Now, Principles, Method, Contact) instead of "Chapter One". One voice, top to bottom.

## Section by section

### 1. Hero
- Headline in first person, italic primary: "I'm Ivan." with a second line "A Product Builder, by curiosity and craft." (echoes the GitHub bio "Product Builder, Design Engineer" without the engineer label, since we don't want to overclaim). Comma punctuation only.
- Sub-paragraph: 5 years in Product Management across start-ups, scale-ups and large groups, 2 years co-founding a SaaS, building from operational reality and shipping AI-native products. One short paragraph.
- Right column: portrait placeholder (see below). Soft warm gradient, thin gold frame, italic label "Portrait, coming soon".

### 2. Origin
- Section label "Origin", first-person paragraph drawing from the CV: mechanical engineering background, service-design training (Interaction Design Foundation), MSc management, Sonor as the co-founding moment that turned engineering curiosity into product instinct (open data, urban noise, Matrice incubator, Banque des Territoires backing, 20K EUR grants, MVP delivered).
- Sidebar pull-quote, promoted from current page: "Curiosity is a discipline."

### 3. Track record
The big new section. Vertical timeline of the four CV roles, each as a compact card:

- 2024 to 2025, Product Manager, FORTIL for DomusVi. SaaS rolled out to 500+ internal users across 100 care homes, POC with Airtable + Make, full lifecycle from discovery to training.
- 2023 to 2024, Product Manager, ALTEN for Bouygues Telecom. Data-driven dashboard tracking 1.9M EUR in receivables, 40% recovered, adopted by ops teams.
- 2022 to 2023, Customer Success Manager, Public Sector SaaS, Opendatasoft. 22 European city and metropolitan clients, 2 launches, zero churn.
- 2020 to 2022, Co-founder and Product Manager, Sonor. 0 to 1 SaaS for urban noise, B2G, Matrice incubator, Banque des Territoires, 20K EUR grants, MVP shipped.

Each card: year range as eyebrow, role as headline, company as label, two-line outcome with the number. Same card style as the home page conviction cards, so it fits. On mobile it stacks; on desktop it's a two-column timeline with a thin gold guide line.

### 4. Now, building in public
This is what the GitHub profile adds. Section label "Now". A six-cell grid of current projects, each linking to the right destination (internal page if we have one, GitHub repo otherwise):

- Aetherix, contextual agentic intelligence for hospitality operations. Internal link `/atherix`.
- Tacet, mobile-first app to find quiet streets in Paris. Internal link `/tacet`.
- EvalLabs, evaluation solution for agent-to-agent workflows with business-centric metrics. External GitHub link.
- Kissa, digital twin of a record collection (selectors, hi-fi culture). External GitHub link.
- Lore, voice AI to capture tacit expertise from senior technicians (hackathon win, 24h). External GitHub link.
- Field Notes, where I write what I learn. Internal link `/journal`.

Cards keep the convictions-card style, with a small "GitHub" or "Read more" affordance at the bottom and an `arrow_outward` for external. This section signals range (hospitality, civic, evaluation, music, industry, writing) without leaning on "agentic AI" as the identity. Agentic appears as a means in two of the six.

### 5. Principles I build with (the dark band, fixed)
Keep the three-card structure, rewrite copy along the memory rules (business value, human interactions, full-stack 0→1 craft), fix the colors:

- **Day mode** keeps `bg-primary` (the deep navy works well).
- **Dusk mode**: `bg-primary` currently resolves to a pale blue (`hsl(217 71% 82%)`), which is the visible bug. Add a `.principles-band` class and a scoped override `[data-mood="dusk"] .principles-band { background-color: hsl(var(--tertiary)); }`. In dusk, `--tertiary` is a deep warm taupe (`45 11% 22%`), giving a serious dark band that respects the system without inventing tokens.
- Heading and body color overrides in dusk shift to `text-on-tertiary-container` and `text-tertiary-container` so contrast stays right.
- The inner cards `bg-surface/10` go too pale on the navy in day and too dim on the taupe in dusk. Replace with `bg-surface-container-high/15` plus `border-outline-variant/20`, which reads correctly in both moods.

Card copy rewritten to lean on memory positioning:
- Real business value (operational cost, capacity, sharper decisions).
- Human interactions first (technology gives time back to people).
- Full-stack 0→1 craft (insight to shipped product, digital and physical bridged).
Hospitality is felt, not named.

### 6. How I work (the Method section)
Replace the current 3-step ritual with the 4-step process from your GitHub README, in your words, first person. Section label "Method".

- 01 Problem analysis, understanding context, problem and architecture before building.
- 02 Build, picking the adapted stack and methodology, fast iterations, real testing.
- 03 Continuous discovery, challenging the vision and roadmap with market signals.
- 04 Documenting, a single source of truth so context, decisions and learnings stay accessible.

Replace the abstract overlay image and nested circles with a single quiet gold halo and an italic line, "A shared walk." The current circles compete with the home page halo.

### 7. Let's talk
Replace the lone "Inquire for a Journey" button with the prioritised conversion bar:

- **Primary, Book a call**: solid primary button to `SOCIAL_LINKS.schedule` (Cal.com).
- **Secondary, Email**: outline button to `SOCIAL_LINKS.email`.
- **Tertiary, Download CV**: small text link with download icon, pointing at `/cv/Ivan_de_Murard_CV.pdf` (PDF copied into `public/cv/`).
- Below: a single utility line with LinkedIn, GitHub, X (`@IvanMurard` from the GitHub profile), styled like the home farewell card.

## Voice and copy rules

- First person throughout, no third-person framing, no chapter device.
- No em-dashes, commas and colons only (memory rule).
- Hospitality is felt, not named (memory rule). Aetherix can mention hotel ops; the page itself doesn't call me a hospitality builder.
- Agentic AI is one tool among others, not the identity (memory rule). Agentic is a means in 2 of 6 Now cards, not a label on me.

## Portrait placeholder

A new component `PortraitPlaceholder.tsx` (~40 lines), used in the hero and (optionally) Origin:

- Same aspect and position as today's hero portrait.
- Background: existing `turner-gradient-warm` plus a low-opacity `gold-halo`.
- Foreground: a thin gold-tinted frame, an italic label bottom-left "Portrait, coming soon", and a smaller utility line "A real photo will live here."
- Reads as intentional editorial whitespace, not a broken image. When you send the real photo, we swap one component instead of editing five layouts.

## Dusk-mode background fix (the specific bug)

Today: dusk maps `bg-primary` to a pale blue, which causes the washed-out band.
Fix: scoped CSS only.
```css
.principles-band { background-color: hsl(var(--primary)); }
[data-mood="dusk"] .principles-band { background-color: hsl(var(--tertiary)); }
```
Heading and body color tokens swap accordingly. No new tokens, no design-system surgery.

## CV asset

Copy `user-uploads://CV_Ivan_de_Murard_Product_Builder.pdf` to `public/cv/Ivan_de_Murard_CV.pdf` so `Download CV` resolves at `/cv/Ivan_de_Murard_CV.pdf`.

## Files touched

- `src/pages/Atrium.tsx`: full rewrite of the page.
- `src/components/PortraitPlaceholder.tsx`: new.
- `src/index.css`: add `.principles-band` rule and the dusk override.
- `src/content/site.ts`: add `x` handle to `SOCIAL_LINKS` and a `GITHUB_PROJECTS` array (Aetherix, Tacet, EvalLabs, Kissa, Lore) used by the Now grid.
- `public/cv/Ivan_de_Murard_CV.pdf`: new asset (copied from upload).
- `.lovable/plan.md`: log this iteration.

## What I won't change

- Global tokens, fonts, halos, page-light, header, footer.
- `usePreviewMode`, `Reveal`, `MoodProvider`, ambience system.
- The home page (separate iteration if needed).

## Open questions for after approval

- When you send the real portrait, do you want the same crop in the hero and the Origin section, or a tighter face crop in the hero and a wider environmental shot in Origin?
- Should EvalLabs and Kissa appear in the main `/journeys` index too, or stay GitHub-only links from the About page for now?
