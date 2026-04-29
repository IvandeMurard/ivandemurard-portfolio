## Sonor Case Study: asset integration

Replace external/placeholder content with the user's uploaded assets and embed the Figma prototype for the Hypothesis section.

### 1. Copy uploaded assets into the project

Save the four uploads under `src/assets/` so they bundle through Vite:

- `user-uploads://image-9.png` -> `src/assets/sonor-cartographie.png` (Cartographie / map dashboard)
- `user-uploads://image-10.png` -> `src/assets/sonor-recommandations.png` (Recommandations table)
- `user-uploads://image-11.png` -> `src/assets/sonor-logo.png` (Sonor wordmark)
- `user-uploads://image-12.png` -> `src/assets/logo-banque-territoires.png`
- `user-uploads://image-13.png` -> `src/assets/logo-matrice.png`

### 2. Update `src/pages/Sonor.tsx`

Add ES6 imports for the five new assets at the top of the file.

**Data Synthesis block**
Replace the external `lh3.googleusercontent.com` `<img src=...>` with `src={sonorCartographie}` and update the `alt` to "Sonor Cartographie dashboard, real-time acoustic mapping".

**Citizen Engagement & Urban Quietude block**
Replace the second external `lh3.googleusercontent.com` `<img>` with `src={sonorRecommandations}` and update `alt` to "Sonor Recommandations interface, prioritized action plans for planners".

**Hypothesis section (Figma prototype)**
Replace the current placeholder (the play icon + paragraph in the 16:9 box) with a real Figma prototype embed, and add the requested subtitle. Structure:

```text
[eyebrow] The Hypothesis
[h2 italic primary] Our first 2020 prototype
[16:9 iframe] Figma prototype
[paragraph, below the frame, muted] By making noise visible and data
truly actionable... silence.
```

The iframe uses Figma's standard embed wrapper:

```
src = "https://www.figma.com/embed?embed_host=lovable&url="
    + encodeURIComponent(
        "https://www.figma.com/proto/OcBu81qdpjpPdjHQPA6oae/"
        + "Sonor-Site-Mairie?content-scaling=fixed&kind=proto"
        + "&node-id=25-0&page-id=0%3A1&scaling=scale-down"
        + "&starting-point-node-id=25%3A0"
      )
```

Attributes: `allowFullScreen`, `title="Sonor 2020 prototype"`, `loading="lazy"`, absolutely positioned to fill the 16:9 container. The `Icon` import is removed only if no longer used (it is still used by the Outcome timeline, so keep it).

The supporting paragraph keeps the existing copy ("By making noise visible...") but moves below the prototype as a caption.

**Acknowledgments section**
Replace the three text spans (`SONOR`, `Banque des Territoires`, `Matrice`) with the actual logos. Each rendered as:

```
<img src={...} alt="..." className="h-16 md:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
```

Layout stays `flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16`. Logos: Sonor, Banque des Territoires, Matrice, in that order.  
  
Allow the user to click on images to view them fullscreen.

### Files edited

- `src/pages/Sonor.tsx`
- `src/assets/` (5 new image files copied in)

### Out of scope

- No changes to the Hypothesis copy itself, only its placement (caption under the prototype).
- No changes to other pages, layout, or scroll/PageLight behavior.