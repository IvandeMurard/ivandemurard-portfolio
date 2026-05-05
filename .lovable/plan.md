## Goal
Serve hand-curated markdown versions of the three case studies at stable URLs, and add a discreet "View as markdown" link near the bottom of each case study page.

## Files to create

Three static markdown files in `public/` so they are served as plain text (no JS, ideal for LLM crawlers and humans who curl them):

- `public/atherix.md`
- `public/sonor.md`
- `public/tacet.md`

Each file follows the same structure, tightened and quotable:

```text
# {Project name}
{One-line positioning, same voice as the case study hero}

URL: https://www.ivandemurard.com/{slug}
Role, Duration, Team, Year
Stack: {key tools}

## What it is
2 to 4 sentences.

## Why it exists
The problem and the conviction behind the build.

## How it works
Architecture in plain prose, no diagrams. Mention MCP, Apaleo, FastAPI, Bruitparif, etc. where relevant.

## Outcomes and signals
Concrete numbers when available (Sonor grants, DomusVi rollout style facts that already live in the site).

## Links
- Live: ...
- Repo: ...
- Contact: ivandemurard@gmail.com
```

Content will be drawn directly from the existing case study pages (`src/pages/Atherix.tsx`, `Sonor.tsx`, `Tacet.tsx`) and `public/llms-full.txt`, then tightened. No new claims.

## Discreet link in each case study footer

In each of `Atherix.tsx`, `Sonor.tsx`, `Tacet.tsx`, add a small text link just above the final CTA section, in the existing `font-label` micro-type style already used for utility lines:

```tsx
<div className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-8 text-right">
  <a
    href="/atherix.md"
    className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
  >
    View as markdown
  </a>
</div>
```

Same pattern for `/sonor.md` and `/tacet.md`. Right-aligned, muted, no icon. It reads as a footnote, not a CTA.

## Sitemap and crawl signals

Append the three markdown URLs to `public/sitemap.xml` so crawlers discover them:

```xml
<url><loc>https://www.ivandemurard.com/atherix.md</loc></url>
<url><loc>https://www.ivandemurard.com/sonor.md</loc></url>
<url><loc>https://www.ivandemurard.com/tacet.md</loc></url>
```

`robots.txt` already allows everything, no change needed.

## Keeping markdown in sync with the case studies

Two options. Recommendation: option A.

**A. Hand-curated, with a checklist (recommended)**
The .md files are intentionally tighter than the React pages. They are the quotable version, not a transcript. Drift is fine for marketing copy but not for facts. Mitigation:

- Add a short comment block at the top of each `src/pages/{Project}.tsx`:
  ```
  // Source of truth for facts (dates, stack, metrics).
  // If you change facts here, also update public/{slug}.md and public/llms-full.txt.
  ```
- Add the same reminder once in `.lovable/plan.md` so future sessions see it.

This is the standard approach for portfolio sites. Low maintenance, high editorial quality.

**B. Generated at build time**
Write a `scripts/generate-case-md.ts` that imports a shared content module (e.g. `src/content/cases/atherix.ts` exporting structured fields) and writes `public/*.md` plus feeds the React pages. This is correct engineering but requires refactoring the three case study pages to read from a content module they currently do not use. Heavier, and the rendered React pages have layout-specific copy (captions, image alts, FAQ blocks) that does not belong in the markdown.

Going with A unless you want the refactor.

## Out of scope
- Download buttons in the hero
- PDF exports
- Auto-generation from JSX
- New routes or React rendering of markdown

## Acceptance
- `curl https://www.ivandemurard.com/atherix.md` returns clean markdown
- Each case study page shows a small right-aligned "View as markdown" link near the bottom
- Sitemap lists the three .md URLs
- Source-of-truth comment present at the top of each case study page
