## Sonor, section #product: en-tête et fond différencié

### Objectif

Marquer visuellement que la section des deux interfaces produit (Data Synthesis + Citizen Engagement) est distincte de « The Hypothesis » qui la précède, et créer une continuité narrative proto -> plateforme.

### Changements

**Fichier:** `src/pages/Sonor.tsx`, section `#product` uniquement (l. 255 à 318).

1. **Background**: `py-16 md:py-28 overflow-hidden` -> `py-16 md:py-28 overflow-hidden bg-surface-container scroll-mt-24`. La section précédente reste sur `bg-surface`, le contraste sépare nettement les deux blocs.

2. **En-tête de section** ajouté en haut du `<div className="px-6 md:px-12 max-w-screen-2xl mx-auto">`, avant la première grille:

   ```text
   THE PRODUCT
   From prototype to platform.
   ```

   - Eyebrow: `font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-6 block`
   - Titre: `text-4xl md:text-5xl font-headline italic text-primary`
   - Bloc centré, marge basse `mb-16 md:mb-24` pour respirer avant la première paire image/texte.

3. **Cohérence**: pas de modification des deux grilles existantes (Data Synthesis, Citizen Engagement). Les `<h3>` internes restent tels quels, ils deviennent des sous-titres logiques sous le nouveau `<h2>`.

### Hors scope

Pas de SectionDivider ajouté ici (le changement de fond joue déjà ce rôle). Pas de retouche aux autres sections.
