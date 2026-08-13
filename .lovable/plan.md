Homepage case-study grouping

## Goal
Make the hierarchy on the homepage explicit: the Hospitality Mesh projects (Aetherix, Anima, Tacet) and the standalone systems (Sonor, Lore, Paris Compass) must read as two distinct groups of equal internal weight, not one flat numbered list.

## What will change
1. **Split the existing "Case Studies" grid into two labelled blocks** inside `src/pages/Index.tsx`:
   - **The Hospitality Mesh** — Aetherix, Tacet, Anima (3 cards, same 3-column layout).
   - **Standalone systems** — Sonor, Lore, Paris Compass (3 cards, same 3-column layout).
2. **Keep every existing card component and style** (`lift-card`, `CaseHoverPreview`, `SafeImage`, external badge, hover arrow). No new component.
3. **Add a short group kicker / header** above each block, using the existing label/title style (`font-label uppercase tracking-[0.2em] text-[11px] text-secondary`).
4. **Link the mesh header to `/architecture`** so the grouping is not just visual.
5. **Preserve the top-level "Case Studies" H2 and the "Explore all stories" link** to `/journeys`.
6. **Update the section intro copy** from the generic "A small selection..." to a line that signals the two categories.

## Files touched
- `src/pages/Index.tsx` — restructure the Case Studies section only.
- No mirror files, no SEO registry changes: this is a layout-only change on `/`.

## Out of scope
- No new page.
- No change to `/journeys` (already grouped).
- No change to project data in `src/content/site.ts`.
