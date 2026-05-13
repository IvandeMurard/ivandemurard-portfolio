# Plan

## 1. Rewrite the "Intelligent Anticipation" intro paragraph

File: `src/pages/Atherix.tsx`, line 336.

Current copy reads as a flat technical list ("Four intelligence layers in sequence: numerical forecasting (Prophet)..."). Rewrite it so each layer maps to a tangible GM outcome, keeps the human-in-the-loop framing, and ends on the MCP/WhatsApp delivery beat. No em-dashes (project rule).

Proposed copy (final wording open to your edit):

> Four layers, one recommendation. Prophet forecasts tomorrow's covers and shifts. Qdrant matches today against 495+ past scenarios. pgvector remembers what worked in *your* hotel. Claude Sonnet turns the whole picture into one plain-language call, pushed only when it matters, and callable by any other agent over MCP.

Rationale:
- Verbs first ("forecasts / matches / remembers / turns") instead of nouns in parentheses.
- Each layer answers "so what?" for a GM.
- Closes on the unique moat: per-hotel memory + agent-callable.
- Keeps technical names (Prophet, Qdrant, pgvector, Claude Sonnet, MCP) for credibility, but each is anchored to an outcome.

Single-line edit, no structural change to the section.

## 2. Site-wide section TOC + back-to-top rail

Goal: on long pages (case studies, journal entries, about), let the reader (a) see where they are, (b) jump to a section, (c) return to top.

### Component to build

`src/components/layout/SectionRail.tsx` (new). A fixed vertical rail, right side, desktop only (≥ lg). Hidden on mobile to preserve the editorial silence. It shows:

- A thin column of dots, one per section, with the active dot filled.
- Section label revealed on hover (italic headline font, low-opacity surface chip).
- A small "Top" affordance (arrow_upward icon) at the bottom that scrolls to top with `behavior: smooth` once the user has scrolled past ~600px.

Behavior:
- Accepts a prop `sections: { id: string; label: string }[]`.
- Uses `IntersectionObserver` on the matching `#id` anchors to track the active section. Threshold tuned so the section in the upper third is considered active.
- Click on a dot → `scrollIntoView({ behavior: "smooth", block: "start" })`.
- Respects `prefers-reduced-motion`: disables smooth scroll.
- Keyboard accessible: each dot is a `<button>` with `aria-label`, focus ring uses existing tokens.

Styling: uses semantic tokens only (`text-on-surface-variant`, `bg-surface/70`, `border-outline-variant/30`, secondary glow on active). Matches the glass-nav vocabulary already used in `AtriumHeader`.

### Where to mount it

Add an optional `sections` prop to `SiteLayout` (`src/components/layout/SiteLayout.tsx`). When present, render `<SectionRail sections={...} />` next to `<main>`. When absent, layout renders unchanged.

Pages to wire up in this pass:
- `src/pages/Atherix.tsx` — sections: Hero, Vision, Operations Pipeline, Hive, Architecture, Economics, Why, Closing.
- `src/pages/Tacet.tsx` — equivalent sections.
- `src/pages/Sonor.tsx` — equivalent sections.
- `src/pages/JournalEntry.tsx` — auto-extract h2s, or pass an explicit list.

Each target section gets an `id="…"` and `scroll-mt-24` utility so anchored scroll lands below the fixed nav.

Other pages (Index, Contact, Atrium, Journal index) are short; they get a simpler standalone **back-to-top** button only — same component, but rendered in "minimal" mode (`sections={[]}`), so only the top arrow appears after scroll.

### Accessibility & polish
- Rail is `aria-label="Section navigation"`, dots are `<button>` with `aria-current="true"` on active.
- Reduced-motion fallback for both scroll and the dot's transition.
- z-index below the header (`z-30`), above page content.

## Out of scope
- No new icon library, no new dependency.
- No copy changes outside the one paragraph in §1.
- No mobile bottom-bar variant in this pass (can be a follow-up if you want it on phones).
