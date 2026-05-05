
# SEO + GEO strategy for ivandemurard.com

Goal: rank for "Ivan de Murard" + intent queries (product builder Paris, agentic AI hospitality, boutique hotel AI, Aetherix, Sonor, Tacet), and be cited by generative engines (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews).

## Current state (gaps)

- `index.html` ships a single static title/description for every route (SPA). No canonical, no per-page meta.
- No structured data (JSON-LD): no Person, WebSite, Article, CreativeWork.
- No `sitemap.xml`. `robots.txt` exists but does not reference a sitemap.
- OG image is a Google Storage URL with a non-ASCII filename (fragile). No per-page OG.
- No `lang` variants, no author bios on case study pages, no FAQ schema, no published/updated dates on Field Notes.
- No `llms.txt` or AI-friendly plain-text surfaces.

## Plan

### 1. Per-page meta via a lightweight `<Seo>` component

Create `src/components/Seo.tsx` that imperatively sets `document.title`, description, canonical, OG, Twitter, and JSON-LD on mount (no extra deps; matches existing `SiteLayout` pattern that already sets `document.title`). Props: `title`, `description`, `canonical`, `image`, `type` (website/article/profile), `jsonLd`.

Wire into every page (Index, Atrium, Journeys, Atherix, Sonor, Tacet, Journal, JournalEntry, Contact, NotFound) with hand-written, keyword-rich, human descriptions (no em-dashes, per memory).

Canonical base: `https://www.ivandemurard.com`.

### 2. Structured data (JSON-LD)

- Site-wide on `/`: `Person` (Ivan de Murard, jobTitle, sameAs LinkedIn/GitHub/X, knowsAbout, address Paris) + `WebSite` with `SearchAction` placeholder removed if no search.
- Each case study (`/atherix`, `/sonor`, `/tacet`): `CreativeWork` or `SoftwareApplication` with `creator` Person, `dateCreated`, `about`, `image`, `url`.
- Journal entries: `Article` with `headline`, `datePublished`, `dateModified`, `author`, `image`.
- Journeys index + Journal index: `CollectionPage` + `ItemList`.
- Contact: `ContactPage`.

### 3. Crawlability

- Add `public/sitemap.xml` (static, regenerated when routes change) listing all canonical URLs with `lastmod`.
- Update `public/robots.txt` to add `Sitemap: https://www.ivandemurard.com/sitemap.xml`.
- Add `<link rel="canonical">` per page (handled by `<Seo>`).
- Add a static prerendered fallback for crawlers via a build-time prerender step (see Technical notes for the lightest option).

### 4. GEO (generative engine optimization)

- Add `public/llms.txt` and `public/llms-full.txt`: plain-text site map and condensed bios + case studies, optimized for LLM ingestion. Include name, location, expertise, current builds, and stable URLs.
- Add a public `/about.txt`-style answer-shaped bio block on the Atrium page and ensure it appears in raw HTML (prerender) so retrieval-augmented engines pick it up.
- Strengthen entity clarity: consistent name spelling, employer/role history, schema `Person.sameAs` linking LinkedIn, GitHub, X, Cal.com. Helps Google Knowledge Graph + LLM disambiguation.
- Add concise, question-shaped subheads on case studies ("What is Aetherix?", "How does it work?", "What problem does it solve?") with short answers under 60 words. This is the format LLMs quote.
- Add `Article` `dateModified` on Field Notes so engines prefer fresh content.

### 5. Content + on-page

- Replace generic homepage `<title>` with a keyword-shaped one, e.g. `Ivan de Murard, Product Builder, Paris (AI, Hospitality, SaaS)`.
- Per-page H1/H2 audit: ensure each route has one H1 containing the entity (already mostly true; Journeys + Journal need tightening).
- Add author byline + published date on Field Notes entries.
- Internal linking: every case study links back to `/journeys` and to related entries; homepage already links to all three.
- Image alts: scan and tighten (portraits, case images, architecture diagram).
- Self-host the OG image under `/og/` with ASCII filenames (e.g. `/og/ivan-default.jpg`, `/og/atherix.jpg`, etc.) and per-page overrides.

### 6. Performance + Core Web Vitals (ranking factor)

- Preload hero font subset, drop unused Google Font weights (currently `200..800` for Newsreader + Manrope, very heavy).
- Add `loading="lazy"` + explicit `width`/`height` to all non-hero images.
- Defer Material Symbols Outlined or swap for tree-shaken Lucide icons already in use.

### 7. Analytics + monitoring

- Confirm Google Search Console + Bing Webmaster property for `ivandemurard.com`, submit sitemap (manual step for user, list in deliverables).
- Optional: add basic `referrer`-aware logging on outbound links (already partially via `useTrackClick`).

## Technical notes

- Prerender: use `vite-plugin-prerender-spa` or a small post-build script that renders each route to static HTML using `react-dom/server`. Without prerender, `<Seo>` still works for social crawlers that execute JS (Google does, Twitter/Facebook do not). Recommended: ship `<Seo>` first, prerender second.
- No new runtime deps required for step 1-5. Prerender step is optional and can be deferred.
- `lang="en"` stays on `<html>`. If a French version is desired later, add `hreflang` alternates.

## Deliverables (in order)

1. `src/components/Seo.tsx` + wire into all 10 pages with handcrafted titles, descriptions, JSON-LD.
2. `public/sitemap.xml`, updated `public/robots.txt`.
3. `public/llms.txt`, `public/llms-full.txt`.
4. `public/og/` directory with per-page social images (ASCII filenames).
5. Font + image perf cleanup pass.
6. (Optional, follow-up) Build-time prerender for static HTML.

## Out of scope

- New pages or copy redesign (only targeted question-shaped subheads on existing case studies).
- Backend/CMS work, edge functions, analytics dashboards.
- Paid SEO tooling.

After approval I will implement steps 1-5 in a single pass and flag step 6 for a follow-up.
