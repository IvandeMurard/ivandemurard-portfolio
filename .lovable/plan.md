## Sonor, section Outcome: 3 corrections

### 1. Lisibilité en dusk mode

**Problème**: la section `#outcome` est peinte avec `bg-primary text-on-primary`. En dusk, ces tokens convergent et le contenu devient illisible.

**Correction**: ajouter une variante dusk via attribut `data-mood`. La section garde sa signature midnight en day, et bascule sur une palette sombre lisible en dusk.

- Wrapper de la section: `bg-primary text-on-primary` reste pour day, on ajoute `data-[mood=dusk]:bg-surface-container-lowest data-[mood=dusk]:text-on-surface` au niveau d'un parent ou via une classe utilitaire conditionnelle.
- Approche retenue: lire `useMood()` dans le composant et appliquer des classes conditionnelles. Plus simple et déjà utilisé ailleurs.
- Sous-éléments à reconsidérer en dusk: `text-primary-fixed-dim` (déjà lisible sur fond sombre, conservé), bordures `border-on-primary/10` (remplacées par `border-outline-variant/30` en dusk).

### 2. Chronologie « From Hypothesis to Reality »

**Décisions utilisateur**: grid responsive sur une ligne, sans scroll horizontal, pleine largeur + typo agrandie.

**Restructuration**:

```text
┌───────────────────────────────────────────────────────────────┐
│  FROM HYPOTHESIS TO REALITY                                   │
│                                                               │
│  01 ──→ 02 ──→ 03 ──→ 04 ──→ 05 ──→ 06 ──→ 07                 │
│  Oct    Phase  Phase  Phase  Phase  Phase  End                │
│  2020   1      2      3      4      5      2022               │
│  Hack.  Disc.  Pivot  Proto. GTM    ...    Concl.             │
└───────────────────────────────────────────────────────────────┘
```

- Sortie de la grille 2 colonnes: la timeline devient un bloc pleine largeur **au-dessus** du split (titre + stats). La grille `lg:grid-cols-2` reste pour le reste du contenu.
- Layout: `grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6` (7 étapes existantes). Plus de `overflow-x-auto`, plus de scroll.
- Connecteurs: flèches `arrow_forward` visibles en `lg:` entre colonnes, masquées en mobile (les cellules s'empilent en grille 2 colonnes).
- Numérotation: chaque étape commence par un numéral en gold (`text-secondary-fixed` ou équivalent dusk-safe), style `font-label tracking-[0.2em] text-xs`.
- Typo agrandie: les phases passent de `text-sm` à `text-lg md:text-xl font-headline italic`. Les dates restent en `text-xs font-label tracking-wider`.
- Label « FROM HYPOTHESIS TO REALITY »: agrandi à `text-xs md:text-sm`, espacement renforcé.

### 3. Nouveau titre

Remplacer:

```text
A Sanctuary in
the Concrete.
```

par:

```text
Quiet, Measured,
Returned.
```

Garder `text-5xl md:text-7xl font-headline italic leading-tight`.

## Fichiers modifiés

- `src/pages/Sonor.tsx`: section `#outcome` uniquement (l. 318 à 370). Import de `useMood` si pas déjà présent.

## Hors scope

- Pas de changement sur les autres sections, pas de refonte du composant `Timeline` (il n'est pas utilisé ici, c'est un `.map` inline).
- Pas de modification de tokens globaux ni de `index.css`.
