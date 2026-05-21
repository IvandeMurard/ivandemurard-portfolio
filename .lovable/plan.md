
## Objectif

Sur la première vue de `/journeys` (desktop), exploiter l'espace vide à droite des noms en y révélant l'aperçu visuel du case study au hover, et aérer la distance entre le titre "Case studies" et la liste numérotée.

## Changements

### 1. Grille de l'opening — 3 colonnes au lieu de 2

`src/pages/Journeys.tsx`, section header :

- Passer de `md:grid-cols-12` (7 / 5) à une grille `md:grid-cols-12` répartie en **5 / 3 / 4** :
  - col 5 : titre éditorial + paragraphe (inchangé)
  - col 3 : liste numérotée des projets
  - col 4 : zone d'aperçu (image du case study actif au hover)
- Augmenter le `gap` à `md:gap-20` pour éloigner visuellement le titre de la liste (répond au point "trop près du titre").
- Sur mobile : la zone aperçu est masquée (`hidden md:block`), comportement actuel préservé.

### 2. État `hoveredSlug` + zone d'aperçu

Dans le composant `Journeys` :

- Ajouter `const [hoveredSlug, setHoveredSlug] = useState<string | null>(ACTS[0].slug)` — Sonor visible par défaut pour ne pas avoir un trou.
- Sur chaque `<a>` de la liste : `onMouseEnter={() => setHoveredSlug(act.slug)}` et `onFocus` idem (accessibilité clavier). Pas de `onMouseLeave` sur les items individuels : on garde le dernier survolé affiché (sensation cinéma).
- Optionnel : `onMouseLeave` sur le `<ol>` qui restaure `ACTS[0].slug`.

Zone d'aperçu (col 4) :

```
<div className="hidden md:block relative aspect-[4/5] overflow-hidden rounded-sm">
  {ACTS.map(act => (
    <SafeImage
      key={act.slug}
      src={act.image}
      alt=""
      aria-hidden="true"
      className={cn(
        "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out",
        hoveredSlug === act.slug
          ? "opacity-100 scale-100"
          : "opacity-0 scale-105"
      )}
    />
  ))}
  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
</div>
```

- Crossfade 700ms + léger zoom (1.05 → 1.0) pour rester dans le registre "cinématographique" déjà en place.
- `aria-hidden` car purement décoratif ; les vrais liens cliquables restent la liste numérotée.

### 3. Espacement titre / liste

- `md:gap-20` (au lieu de `gap-16`) entre colonnes pour donner de l'air horizontal.
- Sur la liste, augmenter le `gap` vertical entre items à `md:gap-5` pour respirer.
- Le bloc "scroll to enter" reste sous la liste.

### 4. Accessibilité & reduced-motion

- Préserver le focus visible des liens.
- Si `prefers-reduced-motion: reduce` : désactiver le `scale` et raccourcir la transition à 200ms (via classe utilitaire conditionnelle ou simple media query CSS dans `index.css`).
- L'aperçu est `aria-hidden` : aucun impact lecteur d'écran, navigation clavier identique.

## Fichiers touchés

- `src/pages/Journeys.tsx` (grille opening, état hover, zone aperçu)
- éventuellement `src/index.css` pour la règle reduced-motion sur `.journey-preview img`

Aucune modif des sections "acts" ni du reste du site.

## Réponse à la question

Oui, c'est tout à fait possible et c'est exactement le bon usage de l'espace vide à droite : crossfade des covers déclenché au hover/focus du nom, Sonor affiché par défaut, désactivé sur mobile.
