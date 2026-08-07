# Rose: dock discret au repos, plein contraste à l'usage

## Objectif

Quand Rose n'est ni survolée, ni focalisée, ni ouverte, le dock devient un simple voile de verre: fond très transparent, bordure et ombre atténuées, marque et texte légèrement estompés. Dès le survol, le focus clavier, la saisie ou l'ouverture, il reprend exactement l'apparence actuelle.

## Comportement

- Etat repos: fond translucide (environ 35 pour cent d'opacité) avec flou d'arrière-plan conservé, bordure discrète, ombre réduite, opacité globale légèrement abaissée.
- Etat actif: survol souris, focus clavier à l'intérieur du dock, panneau ouvert, ou saisie non vide. Retour au style plein actuel.
- Transition douce sur environ 300 ms, alignée sur la transition existante.
- Sur mobile et sur pointeurs tactiles, pas d'état estompé permanent gênant: le dock reste lisible au repos avec un voile plus léger, et l'ouverture reste déclenchée par le focus du champ.
- Respect de `prefers-reduced-motion`: pas d'animation, seulement le changement d'état.
- Le placeholder et le libellé restent lisibles: on n'abaisse pas l'opacité du texte en dessous du seuil de contraste AA. L'estompage porte sur le fond, la bordure et l'ombre, pas sur la couleur du texte.

## Détails techniques

Fichier concerné: `src/components/rose/RoseDock.tsx` uniquement.

- Ajouter un état local `hovered` et `focusWithin` (via `onMouseEnter` / `onMouseLeave` et `onFocus` / `onBlur` avec `focus-within` en CSS si suffisant).
- Calculer `const active = open || hovered || focusWithin || inputValue.trim().length > 0`.
- Sur le conteneur ligne 119, remplacer les classes fixes par une variante conditionnelle:
  - actif: `border-outline-variant bg-surface-container-lowest/95 shadow-2xl shadow-black/10`
  - repos: `border-outline-variant/40 bg-surface-container-lowest/35 shadow-lg shadow-black/5`
  - conserver `backdrop-blur-md` dans les deux cas, et ajouter `transition-all duration-300 motion-reduce:transition-none`.
- Utiliser `group` / `focus-within:` de Tailwind quand cela évite un état React superflu.
- Aucune modification de la logique de chat, des intents, ni du backend.

## Vérification

Capture Playwright de `/journal/harnesses-graders-closed-loops` en mode clair et sombre: dock au repos, puis au survol, pour confirmer la lisibilité du champ et du bouton d'envoi dans les deux états.
