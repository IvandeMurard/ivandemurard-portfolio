# Case Studies page: layout fix + hover scroll teasing

## Goals
1. Show the "Case studies" subtitle directly under the title (not floated to the right).
2. Make multiple case studies visible without scrolling so far. Today the Sonor image takes nearly full viewport height because of `aspect-[4/5]` on a 7-column image.
3. Add a hover effect: the case study image becomes a live, slowly auto-scrolling teaser of the actual case page.

---

## 1. Header: subtitle under the title

In `src/pages/Journeys.tsx`, replace the 12-col grid header (title in col-8, paragraph in col-4) with a stacked structure:

- Eyebrow: "The Project Index"
- H1: "Case studies" (keep the italic two-line treatment, but tighter)
- Paragraph subtitle directly underneath, max-width ~xl, left-aligned

This also reclaims vertical space (no more `mb-24 md:mb-32` giant gap pushing rows down).

## 2. Denser case study rows so 2+ are visible at once

Current row: `aspect-[4/5]` image in 7/12 cols → on a 1313px viewport the image is ~720px tall, eating the whole fold.

Changes in the `Row` component:
- Image aspect: `aspect-[4/5]` → `aspect-[16/11]` on desktop (keep 4/5 only on mobile). Wider, shorter, more cinematic.
- Reduce image column from `md:col-span-7` to `md:col-span-6`, text from 5 to 6, so layout is balanced.
- Reduce hero `mb-24 md:mb-32` → `mb-16 md:mb-20`.
- Reduce row spacing `space-y-24 md:space-y-32` → `space-y-16 md:space-y-24`.
- Reduce top padding `pt-32 md:pt-40` → `pt-28 md:pt-32`.

Result on 1313×843: the hero + first case fully visible, with the top of case 02 peeking, signaling there's more.

## 3. Hover teaser: live scrolling preview of the case page

Yes, technically feasible. Recommended approach: render the actual case route inside an `<iframe>` that appears on hover, with a JS-driven slow auto-scroll. This guarantees the preview matches the real page (no duplicate content to maintain).

### Component: `src/components/CaseHoverPreview.tsx` (new)

Props: `slug`, `image`, `alt`.

Behavior:
- Always renders the static `<img>` as today.
- On `mouseenter` (desktop, pointer: fine only), after a 250 ms delay to avoid accidental triggers:
  - Mounts an `<iframe src={`/${slug}?preview=1`} />` absolutely positioned over the image, `pointer-events-none`, scaled with CSS `transform: scale(0.5); transform-origin: top left; width: 200%; height: 200%;` so a desktop-width render fits the card.
  - Fades it in over 400 ms.
  - Starts a `requestAnimationFrame` loop posting `window.scrollTo` messages via `postMessage` to the iframe, advancing ~0.4 px/frame for a slow drift from top to bottom, then easing back to top in a loop.
- On `mouseleave`: fades out, unmounts after 500 ms, cancels rAF.
- Respects `prefers-reduced-motion`: no auto-scroll, just a static preview fade.
- Touch / coarse pointer: skip entirely, image stays as-is.

### Iframe-side helper

Add a tiny `usePreviewMode()` hook called from `SiteLayout` (or directly in `Sonor`, `Atherix`, `Tacet`):
- Reads `?preview=1` from URL.
- When true, sets `document.documentElement.dataset.preview = "1"`, which CSS uses to:
  - Hide the header/footer (`[data-preview="1"] header, [data-preview="1"] footer { display: none; }`).
  - Disable smooth scroll and the page-light transitions for snappier preview.
- Listens to `message` events from the parent: `{ type: "preview-scroll", y: number }` → `window.scrollTo(0, y)`.

This keeps the preview faithful to the real page while letting the parent drive the scroll.

### Performance notes
- Iframe is only created on hover, then destroyed on leave. No upfront cost on the listing page.
- `loading="lazy"` and `referrerpolicy="no-referrer"` on the iframe.
- One iframe at a time: if the user moves to another card, the previous one unmounts first.
- Scaled-down render means the iframe paints at half resolution, which is cheap.

## Files to change
- `src/pages/Journeys.tsx` — header restructure + Row aspect/spacing + use `CaseHoverPreview`.
- `src/components/CaseHoverPreview.tsx` — new component (image + hover iframe + rAF scroll driver).
- `src/components/layout/SiteLayout.tsx` — call new `usePreviewMode` hook, hide chrome via `data-preview`.
- `src/hooks/usePreviewMode.ts` — new hook (parse `?preview=1`, listen for postMessage scroll commands).
- `src/index.css` — `[data-preview="1"]` rules to hide header/footer and quiet transitions.

## Recommendation
Do all three changes together: the layout fix alone makes the page scannable, and the hover teaser then rewards exploration without overwhelming first impression. If you want to ship incrementally, items 1+2 are a one-step quick win; item 3 is a separate, slightly larger build.
