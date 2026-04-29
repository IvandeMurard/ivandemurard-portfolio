## Sonor: "Go Further" section + harmonized spacing

### 1. Spacing (already partially done via exec, will be confirmed)

All section vertical padding harmonized to `py-16 md:py-28` (was a mix of `py-20 md:py-40`, `py-20 md:py-48`, `py-20 md:py-32`, `py-24 md:py-48`). Hero bottom margin and inner block margins similarly tightened to `mb-16 md:mb-28` / `mb-12 md:mb-20`. Result: shorter, consistent rhythm with ample whitespace preserved.

### 2. Add "Go Further" section

Three new logo assets already copied to `src/assets/`:
- `logo-nightingale.png`
- `logo-philosophie.png`
- `logo-ted.png`

In `src/pages/Sonor.tsx`:

**Imports** (added after `logoMatrice`):
```ts
import logoNightingale from "@/assets/logo-nightingale.png";
import logoPhilosophie from "@/assets/logo-philosophie.png";
import logoTed from "@/assets/logo-ted.png";
```

**`GO_FURTHER` data array** (alongside `META`, `TIMELINE`, `STATS`, `QUOTES`, `FAQ`):
- Nightingale, "Noisy Cities: Behind the Scenes with Karim Douïeb", https://nightingaledvs.com/noisy-cities-behind-the-scenes-with-karim-douieb/, CTA "Read"
- Philosophie Magazine, "Jura: A Forest Under Surveillance", https://www.philomag.com/articles/une-foret-sur-ecoute, CTA "Read"
- TED, "TEDx: The benefits of the sound of silence", https://www.youtube.com/watch?v=ewNTwBbLUhM, CTA "Watch"

**Section markup**, inserted between the FAQ section and the Acknowledgments section:

```text
<section py-16 md:py-28, bg-surface-container-lowest, border-t outline-variant/20>
  centered eyebrow "Further Reading"
  h2 italic primary "Go Further"
  3-column grid (1 col on mobile), cards:
    - bg-surface-container-lowest, border outline-variant/30, rounded-2xl, p-8, hover shadow + slight lift
    - logo: h-12, object-contain, opacity-80, mb-8 (logos stay native color, sit on cream surface)
    - h3 font-headline italic text-primary text-xl, the title
    - p text-on-surface-variant leading-relaxed
    - link with arrow icon (Icon name="open_in_new"): text-primary font-label uppercase tracking-widest text-xs, "Read"/"Watch"
    - whole card is an <a target="_blank" rel="noopener noreferrer">
```

The styling stays in the existing palette (cream/ivory surfaces, primary blue accents, headline italic, label uppercase tracking) so the Awwwards editorial tone is preserved. No new colors introduced. The Acknowledgments section that follows now shares the same `py-16 md:py-28` rhythm.

### Files to edit
- `src/pages/Sonor.tsx`

### Out of scope
- No changes to other case-study pages (only Sonor was requested).
- No changes to global CSS, PageLight, or layout.
