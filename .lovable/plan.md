# Homepage: case studies first, field notes next, less scaffolding

Scope: `src/pages/Index.tsx` plus a small addition to `src/content/site.ts` for Paris Compass. No changes to Field Notes, case study pages or the design system.

## 1. New section order

```text
Hero (title + subline + CTAs)
Case Studies        <- was 02, now first
Field Notes         <- new
My approach
How I work
Milestones          <- moved down, just before the farewell
Thank you for your visit
```

Milestones keeps its content and numeral treatment; it simply moves after "How I work". The proof strip in the hero already carries the numbers that matter above the fold.

## 2. Hero

Replace the long sentence with a title line:

- Eyebrow stays: "Welcome, it's good to see you."
- `<h1>`: "Product builder." on the first line, "Agentic AI systems for operations." on the second, in `text-primary-container` for the two-tone treatment. Same italic headline face, size stepped back up (`text-5xl md:text-7xl`) now that the line is short.
- Subline unchanged: "Product builder, Paris. Five years across start-ups, scale-ups and large groups, plus two years co-founding a SaaS. Currently building an architecture of specialised agents for hotel operations."
- Proof strip, CTAs and scroll cue unchanged.

## 3. Signature line, made specific

The section stays but the sentence is replaced, and the two vertical rules around it are removed:

"Five years reading operations from the inside, in care homes, telecom finance and city halls. I now build the agents that carry what those teams know: covers and staffing for a hotel, a retiring technician's judgement, a guest relationship that is allowed to forget."

## 4. Field Notes section

New section directly after Case Studies, deliberately lighter than the case cards: no images, Lucide icons like "My approach", so the two registers read differently at a glance.

- Heading "Field Notes", standfirst "What I learn while building, written to be used."
- Three cards, driven by `JOURNAL_ENTRIES` (newest first): icon, date, title, one-line summary, link to the entry.
- Trailing link "Read all notes" to `/journal`, matching the "Explore all stories" treatment.

## 5. Paris Compass as a sixth case study

Added to `PROJECTS` in `src/content/site.ts` with an `external` flag and `href` to the live demo (`paris-compass.lovable.app`), plus a GitHub link. The card renders like the others but opens externally and carries an "External" marker instead of the arrow-outward hover, since there is no case study page for it yet. Label: "Open data · Commercial real estate, Paris · 2026". Tagline drawn from the repo: contextual search for Paris commercial space, putting each address back into its environment (walkability, transport, retail, schools, noise, air quality, risk) from public open data.

Grid becomes six cards over three columns, so it stays balanced.

## 6. Fewer vertical separators

- Drop the two `w-px h-16` rules bracketing the signature line.
- Drop the `sm:divide-x` in the hero proof strip and the `md:divide-x` in Milestones; spacing alone separates the columns.
- Keep the horizontal `SectionDivider` hairlines between sections, renumbered for the new order (01 Case Studies, 02 Field Notes, 03 Approach, 04 Method, 05 Milestones), and drop the two label-less dividers so a divider always announces something.

## 7. Table of contents and progress bar

Not added. That furniture belongs to the Field Notes reading contract; the homepage is a vitrine, not a long read.

## Follow-through

- Mirror the new hero title and the Paris Compass entry into `public/llms.txt` and `public/llms-full.txt`.
- No SEO title change (the `/` title is already correct).
- Verify the rendered page at 375px and 1280px, in light and dusk.
