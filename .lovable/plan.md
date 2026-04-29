# Homepage & Footer Refinements

Targeted changes across `src/pages/Index.tsx`, `src/index.css`, `src/content/site.ts`, and `src/components/layout/Footer.tsx`. No new dependencies.

## 1. Hero section (`src/pages/Index.tsx`)

- Replace eyebrow `THE DIGITAL ATRIUM` → `IVAN DE MURARD`.
- Replace headline second line `I've been expecting you.` → `It's great to see you!`.
- Strengthen the gold halo behind the headline:
  - Add a dedicated `secondary-fixed` (warm gold) blurred orb centered behind the H1, larger and more opaque than current ambient blobs (kept as supporting layers).
  - Apply a new utility class `gold-halo-pulse` driving a slow, subtle breathing animation (opacity + scale only — no position shift, no flicker that feels nervous).

## 2. Halo animation (`src/index.css`)

Add a new keyframe + utility, respectful of the existing `prefers-reduced-motion` block already in the file:

```css
@keyframes gold-halo-breathe {
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50%      { opacity: 0.7;  transform: scale(1.04); }
}
.gold-halo-pulse {
  animation: gold-halo-breathe 7s ease-in-out infinite;
  will-change: opacity, transform;
}
```

7s cycle and small delta keep it meditative — aligned with the "Digital Hospitality" tone.

## 3. Current Journeys section (`src/pages/Index.tsx` + `src/content/site.ts`)

- Heading `Current Journeys` → `Case Studies`.
- Subcopy → `A small selection of recent projects and collaborations, driven by curiosity and a passion for hands-on crafting.`
- Update project image URLs in `src/content/site.ts` (keeps Journeys page in sync automatically since it reads the same source):
  - `sonor.image` → Paris cityscape (Unsplash, e.g. an aerial of Haussmannian rooftops).
  - `atherix.image` → boutique hotel lobby.
  - `tacet.image` → a different Paris view (e.g. street-level / Seine) so it visually echoes Sonor without duplicating it.
- Rename `atherix.name` from `Atherix` → `Aetherix`. Slug, route, and folder remain `/atherix` to avoid breaking links; only the display name changes.

Image source: Unsplash direct URLs with sizing params (consistent with how AIDA URLs are used today). Final URLs picked at implementation time.

## 4. Contact panel on home (`src/pages/Index.tsx`)

- Heading `Shall we begin?` → `Thank you for your visit`.
- Body → `Shall we meet again? Let's discuss how to create business value and meaningful human experiences for your operations or users.`
- Replace the `Schedule` link label with `Book a Call`.
- Background: current `bg-surface-container-highest` reads grey. Switch the panel to a soft, warm, luminous tone using existing tokens — a tinted gradient blending `secondary-fixed` (warm gold) and `surface` so it stays gentle and on-brand:
  - `bg-gradient-to-br from-secondary-fixed/30 via-surface to-primary-fixed/20`
  - Keep rounded-lg, hover overlay, and existing typography untouched.

## 5. Footer (`src/components/layout/Footer.tsx` + `src/content/site.ts`)

Replace the three text links (Instagram / LinkedIn / Journal) with four icon-only links: Email, Book a Call, LinkedIn, GitHub.

- Use `lucide-react` icons (already a dependency): `Mail`, `Calendar`, `Linkedin`, `Github`.
- Each link: 20px icon, `text-on-surface-variant` → hover `text-secondary`, subtle scale on hover, `aria-label` for accessibility, `title` tooltip with the label.
- Hrefs reuse `SOCIAL_LINKS` (`email`, `schedule`, `linkedin`, `github`); external ones get `target="_blank" rel="noopener noreferrer"`.
- Drop the Instagram entry from `SOCIAL_LINKS` usage in the footer (kept in the export for now — safe no-op).

## Out of scope

- No changes to header, About, Journeys page layout, or case study pages.
- No new routes, no new dependencies.
- The folder/route name `atherix` stays; only the displayed brand becomes `Aetherix`.
