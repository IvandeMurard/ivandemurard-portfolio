## Ajout d'un lien discret vers le site original Sonor

**Contexte** : Le case study Sonor (`/sonor`) n'a actuellement aucun lien vers le site de présentation historique du projet (https://sonor.dorik.io/). L'utilisateur souhaite un lien discret, Option A : sous la grille des métadonnées du hero.

**Changement** :
- Dans `src/pages/Sonor.tsx`, ligne ~183 (juste après la grille `META`), ajouter une ligne de texte fine `text-on-surface-variant` avec un lien externe vers `https://sonor.dorik.io/` :
  - Texte : "Original project site" (ou formulation adaptée)
  - Style : pas de bouton, pas de puce, juste du texte lien avec `TransitionLink` ou `<a>` externe + icône `arrow_outward` optionnelle
  - Espacement : `mt-4` ou `mt-6` sous la grille, léger

**Fichier concerné** :
- `src/pages/Sonor.tsx` uniquement.

**Non-concerné** :
- Pas de changement SEO, pas de changement de structure, pas d'ajout de section.
- Le lien est externe : `target="_blank" rel="noopener noreferrer"`.