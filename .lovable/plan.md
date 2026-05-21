# Redesign /journeys, version cinématographique

## Intention
Transformer la page d'index en deux mouvements :
1. **Ouverture éditoriale** (1 écran) : "Case studies" + sommaire des 3 projets cliquables, déjà nommés et numérotés. On voit ce qui attend, on choisit ou on scrolle.
2. **Trois actes plein écran** (3 écrans) : un projet par section, 100vh, image large en parallax, titre italic monumental, baseline, CTA. Snap scroll vertical pour un sentiment de chapitres.

Pas de grille asymétrique de cartes. La page devient une expérience filmique, pas un catalogue.

## Section 1, l'ouverture (≈ 100vh desktop)

Layout : colonne gauche, colonne droite.

````text
+------------------------------------------+
| THE PROJECT INDEX                        |
|                                          |
| Case            01 / Sonor               |
|   studies       02 / Aetherix            |
|                 03 / Tacet               |
|                                          |
| A curated collection...                  |
+------------------------------------------+
````

- Gauche : eyebrow, titre `Case` / `studies` italic (réutilise le pattern existant), baseline.
- Droite : liste verticale des 3 noms en `font-headline italic`, taille `text-3xl md:text-5xl`, chacun précédé de son numéral `01 / 02 / 03` en `font-label`. Au hover d'un nom :
  - le filet d'or se trace sous le nom (réutilise le pattern du hover Ivan de Murard),
  - la couleur transitionne `text-primary` → `text-secondary`,
  - en fond de la section (derrière toute l'ouverture), un voile coloré bascule vers la lumière du projet survolé (Sonor = bleu froid, Aetherix = ambre, Tacet = nuit profonde). Géré via `--page-light-progress` ou une variable locale `--journey-tint`.
- Click sur un nom = scroll-snap vers la section correspondante (pas navigation), ou navigation directe vers la case study via modifier (à valider, défaut : scroll vers la section in-page).

Indicateur de scroll en bas, hairline + "scroll" en `font-label`.

## Section 2, les trois actes (3 × 100vh, scroll-snap)

Container parent : `scroll-snap-type: y mandatory`. Chaque acte : `scroll-snap-align: start; min-height: 100dvh`.

Structure d'un acte (alterne gauche/droite pour éviter la monotonie) :

````text
+------------------------------------------+
| [image plein hauteur, 60% largeur]       |
|                            01 / 03       |
|                            Sonor         |
|                            (italic, 7xl) |
|                            baseline      |
|                            [Explore →]   |
+------------------------------------------+
````

Effets cinématographiques :
- **Image zoom out scroll-driven** : l'image entre `scale-110`, se résout à `scale-100` au centre de la section, repart en `scale-105` à la sortie. Utilise `animation-timeline: view()` quand supporté, fallback IntersectionObserver + transform.
- **Parallax image** : `translateY` de -8% à +8% sur la durée de la section.
- **Titre split** : `Sonor` apparaît lettre par lettre (stagger 40ms) à l'entrée dans le viewport.
- **Numéral `01 / 03`** : compte à rebours visuel, le `01` se trace comme à l'encre.
- **Tint de fond** : chaque acte pousse `--journey-tint` vers sa couleur (bleu / ambre / nuit), interpolé avec le `PageLight` existant.
- **CTA `Explore the Narrative`** : flèche qui se déplie au hover.

L'image est cliquable (toute la zone image = lien vers la case study), pas seulement le CTA.

## Section 3, outro
Réutilise le bloc CTA actuel "Every journey begins with a single conversation" + bouton Inquire Within. Hors snap scroll (snap se termine après l'acte 3).

## Accessibilité
- `prefers-reduced-motion` : désactive parallax, zoom, split letters, tint transitions. Garde fade simple et le snap scroll (le snap n'est pas une animation).
- Le sommaire de l'ouverture est une vraie `<nav aria-label="Case studies index">` avec liens.
- Chaque acte a un `<section aria-labelledby="...">` et un heading propre.
- Skip-link déjà en place via SiteLayout, conservé.
- Tap targets ≥ 44px (noms du sommaire en mobile : padding vertical généreux).
- Focus visible sur les noms du sommaire (filet or = indicateur de focus aussi, pas seulement hover).

## Responsivité mobile
- Ouverture : titre `Case studies` en haut, sommaire en dessous (stack vertical), baseline en bas. Pas de split colonnes.
- Actes : image plein écran en background, texte par-dessus avec voile foncé sur la moitié basse pour lisibilité. Pas de parallax sur mobile (perf), juste fade-up + image zoom léger.
- Snap scroll conservé sur mobile, c'est même plus naturel au touch.

## Hors scope
- Pas de modification des case studies elles-mêmes (`/sonor`, `/aetherix`, `/tacet`).
- Pas de nouveau contenu copy, on réutilise les `body` et CTA actuels de `Journeys.tsx`.
- Pas de changement à `AtriumHeader` ni au footer.
- `CaseHoverPreview` (iframe preview) : retiré de cette page, l'expérience snap-scroll plein écran le rend redondant. Le composant reste pour d'éventuels autres usages.
- Pas de nouvelle dépendance, tout en CSS + IntersectionObserver natif.

## Section technique

Fichiers touchés :
- `src/pages/Journeys.tsx` : réécriture quasi complète du JSX, conserve `Seo`, `SiteLayout`, imports `PROJECTS`.
- `src/index.css` : ajouter classes utilitaires `.journey-snap-container`, `.journey-act`, `.journey-tint`, keyframes pour le split letters, variable `--journey-tint`.
- Pas de modif `tailwind.config.ts` (utilise les tokens existants : `primary`, `secondary`, `on-surface-variant`, `font-headline`, `font-label`).

Approche animation :
- Scroll-driven : feature-detect `CSS.supports('animation-timeline: view()')`. Si oui, CSS pur. Sinon, hook `useScrollProgress(ref)` léger basé sur `getBoundingClientRect` + rAF (1 listener global, throttled).
- Split letters : composant `<SplitText text="Sonor" />` qui rend une `<span>` par lettre avec `--char-index` et delay calculé.
- Tint : chaque acte porte `data-tint="ocean|amber|night"`, un observer met à jour `--journey-tint` sur `<main>` quand l'acte est ≥ 50% visible.

Respect du design system :
- Pas de couleurs hex en dur. Tints définies en HSL via tokens (`--journey-tint-sonor`, `-aetherix`, `-tacet`) dans `index.css`, dérivées de la palette existante (variations de `primary` et `secondary`).
- Typo : `font-headline` italic partout pour les titres, `font-label` uppercase tracking-wide pour numéraux et eyebrow.
- Respect règle Core : pas d'em-dashes dans la copy.

## Question ouverte (réponse implicite : "non, séquentiel")
Tu as choisi "un seul projet à la fois plein écran", donc la réponse à *"tous les projets doivent-ils apparaître en même temps ?"* est **non**. L'ouverture les nomme tous (sommaire), mais visuellement chaque projet a son moment, son espace, sa lumière.

## Validation visuelle prévue
Après implémentation : screenshot desktop (1440) de l'ouverture, screenshot mid-scroll d'un acte, screenshot mobile (390) de l'ouverture et d'un acte. Vérifier le tint, le snap, la lisibilité du texte sur l'image en mobile.
