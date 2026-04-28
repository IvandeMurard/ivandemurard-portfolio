# Ivan de Murard — Digital Hospitality Portfolio

Port your six Stitch HTML pages into a clean, production-grade React + Vite + Tailwind site. All copy, links, and visual structure already exist in your uploaded HTML — I'll convert them faithfully into reusable React components, wire React Router between them, and align everything to one shared design system.

---

## 1. Design system (built once, used everywhere)

Lifted directly from your Stitch `tailwind.config` blocks so colors and typography stay 1:1 with the prototypes.

**Colors** (defined as HSL CSS variables in `index.css`, exposed as semantic Tailwind tokens)
- `surface` `#fbf9f4` · `surface-container-low` `#f5f3ee` · `-container` `#f0eee9` · `-high` `#eae8e3` · `-highest` `#e4e2dd` · `-lowest` `#ffffff`
- `primary` `#001b3a` · `primary-container` `#163052` · `primary-fixed-dim` `#afc8f1` · `on-primary-container` `#8199c0`
- `secondary` `#715b2e` · `secondary-fixed` `#fddfa6` · `secondary-fixed-dim` `#dfc38d`
- `tertiary` `#1d1b15` · `on-surface` `#1b1c19` · `on-surface-variant` `#454652` · `outline-variant` `#c6c5d4`

**Typography**
- **Newsreader** (italic 200–800, optical sizes) — `font-headline`
- **Manrope** (200–800) — `font-body`, `font-label`
- **Material Symbols Outlined** for the small inline icons (menu, arrow_forward, architecture, favorite, visibility_off, etc.)
- All loaded via `<link>` tags in `index.html`

**Shared utilities** (in `index.css`)
- `.glass-nav` — `backdrop-filter: blur(20px)`
- `.turner-gradient` — 45° linear gradient `primary → primary-container` (or the cream/gold/blue variant for About)
- `.hilma-circle` — soft radial bloom for ambient backgrounds
- `.perspective-text` — subtle hero text-shadow
- Border radii: `DEFAULT 0.125rem`, `lg 0.25rem`, `xl 0.5rem`, `full 0.75rem` (pill buttons)
- Selection colors per page mood

---

## 2. Layout shell

**`<AtriumHeader>`** — fixed top, glass background (`bg-surface/70 backdrop-blur-xl`), asymmetric: logo left, center nav (Stories · Journeys · About · Contact), right utility links (Email · Schedule · LinkedIn · GitHub). Active route gets the gold underline treatment from your About prototype. Mobile collapses to a full-screen overlay menu.

**`<Footer>`** — `© 2026 Ivan de Murard — Curated with Care` left, Instagram · LinkedIn · Journal right, with the gold hover + letter-spacing expansion animation.

**`<SiteLayout>`** wraps every page with header + footer + smooth-scroll + reduced-motion respect.

---

## 3. Pages (React Router routes in `App.tsx`)

| Route | Source | Page |
|---|---|---|
| `/` | code-5.html | Home — The Atrium |
| `/journeys` | code-6.html | Stories index — Case studies |
| `/sonor` | code-2.html | Sonor case study |
| `/atherix` | code.html | Atherix case study |
| `/tacet` | code-3.html | Tacet case study |
| `/atrium` | code-4.html | About — A Conversation with Ivan |
| `/contact` | (new, derived) | Contact — Shall we begin? |

Each page is a faithful port — same copy, same hierarchy, same imagery (using the Google AIDA image URLs from your HTML directly, with `onError` fallbacks), same buttons. Internal CTAs become `<Link>` navigation:
- "Step inside" → `/journeys`
- "View the Journeys" → `/journeys`
- "Explore the Narrative / Trace the Path / Begin the Ascent" → respective case study
- "Inquire Within / Inquire for a Journey" → `/contact`

Real links preserved:
- Email → `mailto:ivandemurard@gmail.com`
- Schedule → `https://cal.com/ivandemurard/30min?month=2026-05`
- LinkedIn → `https://www.linkedin.com/in/ivandemurard/`
- GitHub → `https://github.com/IvandeMurard`

---

## 4. Component library

Extracted from repeated patterns across the 6 HTML files so editing once propagates everywhere.

```
src/components/
  layout/
    AtriumHeader.tsx
    Footer.tsx
    SiteLayout.tsx
  sections/
    Hero.tsx                 (variants: atrium / case-study / about / index)
    CurrentJourneys.tsx      (3-card teaser used on Home)
    AsymmetricRow.tsx        (image+text rows on /journeys)
    ProjectCard.tsx          (image + serif title + body + label tags)
    MetadataStrip.tsx        (Role / Year / Stack / Industry strip)
    MidnightSection.tsx      (full-bleed primary bg with stats or cards)
    PrincipleCard.tsx        (glass card on dark background)
    QuoteBlock.tsx           (testimonials & pull quotes)
    FAQ.tsx                  (accordion using existing shadcn accordion)
    ContactCTA.tsx           (closing "Shall we begin?" block)
    AmbientBackdrop.tsx      (hilma circles + turner blooms)
  ui/
    Button.tsx               (extend shadcn: primary pill, tertiary underline, label-uppercase)
    SectionLabel.tsx         (uppercase tracked label)
```

Project metadata (titles, taglines, image URLs, links) lives in `src/content/projects.ts` so you can tweak copy without touching JSX.

---

## 5. Conversion details

- Strip the inline Tailwind CDN config and Material Symbols import — they're rebuilt natively in `tailwind.config.ts` + `index.html`
- Replace `light/dark` slate-stone fallback classes with the proper semantic tokens (`text-on-surface-variant`, `bg-surface`, etc.) — the prototypes mix both; we standardize on tokens
- Replace `<button>` tags wrapping navigation with `<Link>` from React Router for proper SPA routing
- Keep all Material Symbols icons via the web font (cleaner than swapping to lucide for these specific glyphs)
- Images: embed the existing AIDA URLs directly so the site looks identical immediately; you can later replace any image by editing `src/content/projects.ts`
- Responsive: all original breakpoints (`md:`, `lg:`) preserved; mobile menu added where the HTML only had a hamburger button

---

## 6. Out of scope for this build

- Replacing AIDA placeholder photos with your own shoot
- Journal / blog page (footer link will scroll to top for now)
- Contact form with backend delivery — staying with `mailto:` and `cal.com` per your answer
- Analytics, SEO meta tweaks beyond per-page `<title>`
- Dark mode (prototypes have stubs, but visual direction is clearly the warm-cream light theme)

---

## What ships

A live 7-route portfolio that looks and reads identical to your Stitch prototypes, with shared components so future tweaks (a new project, a copy edit, a new principle) are one-file changes.
