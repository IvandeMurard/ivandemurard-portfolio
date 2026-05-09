## Goal
Bring the Home page to life with the same editorial rhythm used across case studies: numbered `SectionDivider`s, `headline-ink` reveals, `lift-card` hovers, halo drifts, and tightened reveal choreography. Purely presentational, no copy rewrites, no IA changes.

All work in `src/pages/Index.tsx`, with one or two small additions to `src/index.css` only if shared utilities need a Home-friendly variant.

## Section rhythm (final)

```text
Hero                                  (unnumbered, page itself is the index)
SectionDivider 01 / Milestones
Milestones
SectionDivider              (unlabeled hairline, tight)
Signature line              (single line, kept as the breath between Case Studies and Approach)
SectionDivider 02 / Case Studies
Case Studies
SectionDivider 03 / Approach
My approach (convictions)
SectionDivider 04 / Method
How I work (pillars)
SectionDivider              (unlabeled hairline, tight)
Farewell card
```

The two existing italic signature lines collapse into one, placed between Case Studies and Approach. The other is removed.

## Changes to `src/pages/Index.tsx`

### 1. Hero, light additions only
- Add `headline-ink` to the H1 so the title performs the same ink-reveal as case-study headlines.
- Add staggered `data-reveal-child` + `--reveal-delay` to eyebrow (0ms), headline (120ms), subtitle (360ms), CTAs (540ms).
- Add a small scroll cue at the bottom of the hero: `Scroll` label + animated chevron (`Icon name="keyboard_arrow_down"`), so the page does not end mid-air.

### 2. Milestones, lighter motion
- Wrap the section header in `headline-ink` and stagger reveal-children at 70ms steps.
- Keep the bare divided-grid look (no full card chrome), this stays a proof bar.
- Add a subtle gold underline under each numeric value that animates in on reveal (`divider-fall`-style, 1px, `bg-secondary/30`, scaling from 0 to 100% width). This is the "lighter option".

### 3. Single signature line
- Remove the second `Signature line` section.
- Keep the first one between Case Studies and Approach. Wrap headline in `headline-ink`.

### 4. Case Studies
- Add `<SectionDivider index="02" label="Case Studies" />` above the section.
- Apply `lift-card` chrome around each project card (subtle elevation + ambient shadow on hover) so the existing `CaseHoverPreview` image effect sits inside a richer container.
- Tighten reveal stagger to 80ms.

### 5. Convictions and Pillars
- `<SectionDivider index="03" label="Approach" />` above Convictions.
- `<SectionDivider index="04" label="Method" />` above Pillars.
- Replace the bare bordered cards with `lift-card` (matches Tacet `HOW` cards): subtle elevation, gold-tinted hover border, soft ambient shadow.
- For Pillars, restyle the `01 / 02 / 03` numerals with the case-study label style: `font-label text-[10px] uppercase tracking-[0.25em] text-secondary`.

### 6. Farewell card
- Add `<SectionDivider />` (unlabeled, tight) above it.
- Add a faint `halo-drift` blur element behind the card so the dusk feels animated. Strict z-index discipline so existing content stays on top.

### 7. Section headers, consistent ink animation
Apply `headline-ink` to every H2 (`Milestones`, `Case Studies`, `My approach`, `How I work`) so the page speaks with one voice.

### 8. Reveal delays, unified scale
Standardize stagger to 70-90ms increments across all sections, matching case-study pacing.

## Optional, only if scope allows
- Subtle parallax on the hero gold halo, tied to `--page-light-progress` (one CSS rule, no JS).

## Out of scope
- No copy rewrites.
- No new sections beyond dividers.
- No data, Seo, or routing changes.

## Files affected
- `src/pages/Index.tsx`, presentational edits only.
- `src/index.css`, possibly a small `lift-card` variant tweak.
