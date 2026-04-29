# Add hover-scroll teaser to homepage case study cards

Reuse the existing `CaseHoverPreview` component (already used on the Journeys page) on the three Case Studies cards on the homepage.

## Change
In `src/pages/Index.tsx`, inside the Case Studies grid (around lines 182-190), replace the static `<img>` + tint overlay with `<CaseHoverPreview slug={p.slug} image={p.image} alt={`${p.name} project preview`} className="w-full h-full" />` wrapped in the existing `aspect-[4/3] rounded-lg overflow-hidden` container.

Add the import at the top:
```
import { CaseHoverPreview } from "@/components/CaseHoverPreview";
```

Behavior on hover (fine pointer only, respects `prefers-reduced-motion`): cover image stays, after a 250ms delay the live case page iframe fades in and slowly auto-scrolls top→bottom→top, just like the Journeys page. Touch devices keep the static image.

## Out of scope
- No changes to the component itself.
- No copy or layout changes.
- Journeys page untouched.
