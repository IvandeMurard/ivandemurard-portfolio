# Homepage hero, plus three defects

Scope: the hero block of `/` and four fixes found while auditing it. Milestones, Case Studies, My approach and How I work are untouched.

## 1. New hero (src/pages/Index.tsx)

Same container, same gold halo, same reveal delays and stagger. Only copy, order and type scale change.

1. Eyebrow (small, where the greeting sits today, replacing the "Ivan de Murard" label line): "Welcome, it's good to see you."
2. `<h1>`, now the largest element on the page: "I build agentic AI systems for operations, and I publish what they cannot do yet." Headline italic, but stepped down from the current 8xl so a long sentence still reads well (target roughly `text-4xl md:text-6xl`, second clause in `text-primary-container` to keep the two-tone treatment).
3. Subline: "Product builder, Paris. Five years across start-ups, scale-ups and large groups, plus two years co-founding a SaaS. Currently: a network of specialised agents for hotel operations, and a voice mentor for aviation maintenance."
4. Proof strip, three items, between subline and CTAs, using the existing `CountUp` component and the same numeral/label typography as Milestones:
   - 500+ — users on an internal SaaS rolled out across 100 care homes
   - EUR 1.9M — receivables tracked and 40% recovered through a decision tool
   - 22 — European public-sector clients onboarded, zero churn
5. Existing CTAs and scroll cue, unchanged.

The section stays `min-h-screen`. Only one `<h1>` on the page.

## 2. Homepage title

`/` renders as "The Atrium · Ivan de Murard" because `Index.tsx` passes `title="The Atrium"` to `SiteLayout`, which writes `document.title` alongside `Seo`. Fix both sources: drop the "The Atrium" layout title on the homepage, and set the `/` entry in `scripts/seo-routes.ts` and the `Seo` title on the page to "Ivan de Murard — Product builder, agentic AI for operations". Description unchanged.

## 3. `/atherix` link

Confirmed: `/atherix` is a legacy route that redirects to `/aetherix` (`src/App.tsx`). The homepage case cards build their href from `PROJECTS.atherix.slug`, so the most-clicked internal link pays a redirect. Change the project slug to `aetherix` and update the places keyed on the old value: `src/content/site.ts`, `src/pages/Journeys.tsx`, `src/content/systems.ts`, and the `CaseAnchors current` prop on `src/pages/Atherix.tsx`. The `/atherix` redirect route stays for inbound links. Component filenames under `src/components/atherix/` are internal paths and stay as they are.

## 4. Reduced-motion counters

`CountUp` already short-circuits to the final value when `prefers-reduced-motion: reduce` matches, so no code change is expected. It will be verified by rendering `/` and Milestones with the reduced-motion emulation on and reading the DOM, for both the existing figures and the new proof strip. If anything still reads `0`, it gets fixed in `CountUp`.

## Follow-through

- Mirror the new hero copy into `public/llms.txt` and `public/llms-full.txt`.
- Regenerate SEO snapshots and sitemap.
- Verify the rendered DOM in both moods at 375px and 1280px, and report what sits above the fold at each size.

## Technical notes

Existing semantic tokens only. No changes to `index.css` or `tailwind.config.ts`. The proof strip reuses `CountUp` with `separator` for 1.9M rendered as a prefixed decimal (a static "€1.9M" numeral with the same styling if `CountUp` cannot express the decimal cleanly, noted in the report either way).
