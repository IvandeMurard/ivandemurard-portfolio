# Milestone fix + page-wide light progression

## 1. Milestone copy fix

In `src/pages/Index.tsx`, replace milestone #4:

- before: `{ value: "3", label: "Shipped products: Sonor, Aetherix, Tacet" }`
- after: `{ value: "4", label: "Sizes of companies explored (entrepreneur, start-up, scale-up, large group)" }`

Keep the 2x4 grid intact.

---

## 2. The "light progression" idea, refined

Going **cream/gold → Picasso blue** as the user scrolls is the right instinct. It mirrors the editorial arc of the page (welcome → proof → conviction → invitation), and both colors already live in the palette (`--surface`, `--secondary-fixed`, `--primary`, `--primary-fixed-dim`). No new hue needed, the site already has its own answer.

A few refinements for the high-end feel:

- **Three stops, not two.** A pure cream→blue ramp risks feeling like a slider. Stage it as three breaths so it reads as light moving through a room, not a hue dial:
  ```text
  Hero / Milestones        warm cream + gold halo, current state
  Signature / Case Studies cream cooling, faint blue undertone rising
  Why I care / How I work  blue-tinted cream, gold receding
  Thank you                deepest blue wash, current panel as climax
  ```
- **Stay desaturated.** Saturation never exceeds what the Thank-you card already shows. The page should feel like late-afternoon light shifting toward dusk, not a color picker.
- **Tint the surface, not the text.** Body text and primary blue stay constant. Only the page background and ambient glows shift. This keeps legibility editorial and avoids the "marketing site" vibe.
- **Reverse on scroll up,** identical curve. The state is purely a function of scroll position, so up and down feel symmetrical.

This is more pertinent than introducing a third color (sage, terracotta, etc.). The site's identity is built on the cream↔Picasso-blue dialogue with gold as the warm note. Adding a fourth hue would dilute that.

---

## 3. How to animate the page, discreet and high-end

Four layers, each tuned for restraint:

### a. Scroll-linked background tint (the "light")

A single fixed gradient layer behind the whole page, driven by `scrollYProgress`. Implementation: a `<div>` mounted once in `SiteLayout`, `position: fixed; inset: 0; z-index: -1; pointer-events: none;`, with its `background` interpolated between three stops as scroll progresses 0 → 1.

- 0%   `hsl(var(--surface))` (cream)
- 55%  blend of cream and `hsl(var(--primary-fixed) / 0.35)` (cooling)
- 100% `hsl(var(--primary-fixed-dim) / 0.55)` over cream base (dusk blue wash)

Use a single `requestAnimationFrame` loop, clamp updates to ~60fps, and only write a CSS variable (`--page-light`). The gradient itself reads from that variable. No layout thrash.

Transitions on the variable use a long `ease-out` so micro-scrolls don't flicker.

### b. Halo color drift

The hero gold halo fades in opacity and warmth as the page scrolls past it (already partially out of view), and a faint **blue halo** equivalent (using `--primary-fixed-dim`) appears behind the Thank-you section, mirroring the gold one. Same blur, same breathing animation, same restraint. This bookends the page: gold welcome, blue farewell.

### c. Section reveal, the only "motion" the user notices

Each section (Milestones, Signature, Case Studies, Why I care, How I work, Thank you) fades + lifts on enter:

- `opacity: 0 → 1`
- `transform: translateY(16px) → translateY(0)`
- duration `900ms`, easing `cubic-bezier(0.22, 1, 0.36, 1)` (slow start, soft land)
- `IntersectionObserver`, `threshold: 0.15`, fires once per section
- staggered children inside grids: 80ms delay between cards in Why I care, How I work, Case Studies

Implementation as a tiny `useReveal` hook (10 lines) plus a `data-reveal` attribute, no library. Avoids Framer Motion bloat for a static site.

### d. Micro-details that sell the elegance

- Headline italic words get a 600ms fade + 4px lift on first paint (hero only).
- Milestone numbers count up from 0 to their value over 1.2s on first reveal (`5 yrs`, `10+`, `4`, `2`, plus the textual ones stay static). Single `requestAnimationFrame` tween, no library.
- Case Study images: existing `group-hover:scale-105` stays, but ease lengthened to `duration-1000` (already there). Add a 300ms opacity fade on the image when it first reveals.
- Underline links in Thank you grow from `scaleX(0)` to `scaleX(1)` on hover, left origin. (Tailwind `story-link` utility already documented in animations context.)

Everything respects `prefers-reduced-motion: reduce`, which the CSS already enforces globally.

---

## Why this stays high-end

- One idea per layer, no compounding effects.
- No parallax, no horizontal scroll, no scroll-jacking, no scrub-locked video.
- All easing curves are slow-out, like a door closing.
- Color shift is sub-perceptual at any single moment, only obvious if you compare top vs bottom.
- Numbers count up once, never loop. No gimmicks.

---

## Files touched

- `src/pages/Index.tsx`, milestone copy + `data-reveal` attributes + count-up on numerals
- `src/components/layout/SiteLayout.tsx`, mount the fixed `<PageLight />` background layer
- `src/components/PageLight.tsx`, **new**, scroll listener + CSS variable writer + gradient div
- `src/hooks/useReveal.ts`, **new**, IntersectionObserver hook
- `src/index.css`, `[data-reveal]` base + revealed state, `--page-light` variable, blue halo class

No new dependencies. No token changes. Memories already cover the punctuation and positioning rules, no updates needed.

---

## Out of scope

- No animation on Case Study, About, Contact pages (yet). This round is the home page only, to validate the language.
- No changes to typography, palette tokens, or layout.
- No Framer Motion, GSAP, Lenis, or smooth-scroll libraries. Native scroll only.

