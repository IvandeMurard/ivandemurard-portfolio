## Decision
Going with **B: hairlines + section numerals**, applied to all case studies (Tacet, Atherix, Sonor, Atrium) and reusable for future ones.

## Build a shared component

`src/components/SectionDivider.tsx` (new, ~40 lines)

- Thin 1px vertical hairline, ~80px tall, centered, `bg-outline-variant/40`.
- Optional `index` and `label` props rendered next to the hairline in `font-label text-[10px] uppercase tracking-[0.25em] text-secondary` (e.g. `02  ──  The Problem`).
- Animated in via the existing `Reveal` pattern: hairline scales from `scaleY(0)` to `scaleY(1)` over ~600ms ease-out; numeral fades + translates up 8px.
- Two layout variants:
  - `variant="center"` (default): hairline + numeral centered, used between sections that already have centered headings.
  - `variant="left"`: numeral aligned to the editorial column, for sections with left-aligned headings.
- Honors `prefers-reduced-motion`.

Usage:
```tsx
<SectionDivider index="02" label="The Problem" />
```

## Apply to Tacet (`src/pages/Tacet.tsx`)

Insert `<SectionDivider />` between sections, retune margins for varied cadence:

- Hero → Project Info: no divider (already adjacent by design).
- Project Info → Overview: divider `01 / Overview`, keep wide spacing.
- Overview → Problem: divider `02 / The Problem`, tighten to `mb-20 md:mb-28`.
- Problem → Solution illustration: hairline only (no numeral), tighten to `mb-20 md:mb-28`.
- Solution illustration → Solution steps: divider `03 / The Solution`, keep wide.
- Solution → Pipeline: divider with label `Architecture`, keep wide.
- Pipeline → Synergy: divider `04 / Synergy`, keep wide.
- Synergy → Horizon: divider `05 / Horizon`, keep wide.
- Horizon → CTA: tighten to `mb-20 md:mb-28`, hairline only.
- CTA → FAQ: hairline only.

Remove the duplicate inline `01 / Overview` style numerals inside each section heading (now they live in the divider, which is the new source of truth). Keep the `<h2>` text.

## Apply to Atherix, Sonor, Atrium

These case studies don't currently use 01–05 numerals. Two-pass:

1. **Light pass (immediate)**: insert `<SectionDivider />` (hairline only, no numeral) between each major section to give the same rhythm and connective tissue. Apply the same targeted margin tightening between short adjacent sections.
2. **Numbered pass (per page, reviewed individually)**: assign 01–0N numerals to each page's main sections so the divider can carry a label. Done page by page so wording stays right.

For this implementation cycle: ship the light pass on Atherix, Sonor, Atrium, and the full numbered pass on Tacet. Future case studies follow the Tacet template from day one.

## Spacing rules (codified)
- Default between major sections: `mb-32 md:mb-48`.
- Tightened between two short or thematically linked sections: `mb-20 md:mb-28`.
- The divider itself sits in the gap with `py-12 md:py-16` of its own, so the visual rhythm is: section → breath → tick → breath → section.

## Files affected
- `src/components/SectionDivider.tsx` (new)
- `src/pages/Tacet.tsx` (full pass)
- `src/pages/Atherix.tsx` (light pass)
- `src/pages/Sonor.tsx` (light pass)
- `src/pages/Atrium.tsx` (light pass)
- `mem://design/section-rhythm` (new memory) so future case studies inherit the rule

## Memory to save
`mem://design/section-rhythm`: case studies use `<SectionDivider>` between sections, with editorial numerals (01–0N) where the page has a numbered structure; spacing alternates wide (`mb-32 md:mb-48`) and tight (`mb-20 md:mb-28`) for cadence; no decorative shapes.
