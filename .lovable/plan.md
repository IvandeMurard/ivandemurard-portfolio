## Delight: signature gildée au survol du nom

Cible unique : le `TransitionLink` "Ivan de Murard" dans `src/components/layout/AtriumHeader.tsx` (ligne 38-43). Aucun autre fichier modifié.

### Comportement au hover

Trois éléments orchestrés sur le groupe :

1. **Couleur du texte** : transition lente du `text-primary` (navy Picasso) vers `text-secondary` (or terni), durée 700ms, easing `cubic-bezier(0.22, 1, 0.36, 1)` (déjà utilisé dans le site).

2. **Point d'or** : un petit point (`•` ou un `<span>` rond de 4px) apparaît juste après "Murard". Au repos : `opacity-0 scale-0`. Au hover : `opacity-100 scale-100`, transition 500ms. Couleur `bg-secondary`. Lecture : point final d'une signature manuscrite.

3. **Double trait à l'encre** : deux `<span>` absolus en bas du nom.
   - Trait 1 : 1px, `bg-secondary`, largeur 0 → 100% en 700ms.
   - Trait 2 : 1px, `bg-secondary/30`, largeur 0 → 100% en 1000ms avec `delay-150`. Positionné 2px sous le premier.
   
   Lecture : trace d'une plume qui repasse légèrement.

### Implémentation technique

Structure proposée :

```text
<TransitionLink to="/" className="group relative inline-flex items-baseline ...">
  <span className="transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-secondary">
    Ivan de Murard
  </span>
  <span className="ml-1 h-1 w-1 rounded-full bg-secondary opacity-0 scale-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100" />
  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-secondary transition-all duration-700 group-hover:w-full" />
  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-secondary/30 transition-all duration-1000 delay-150 group-hover:w-full" />
</TransitionLink>
```

### Détails

- Retirer l'actuel `hover:opacity-80 transition-opacity duration-500`.
- Garder `text-xl md:text-2xl font-headline italic text-primary tracking-wide`.
- `aria-hidden="true"` sur les 3 spans décoratifs (point + 2 traits).
- Respect implicite de `prefers-reduced-motion` : pas de transform, uniquement opacity/color/width, donc acceptable. Pas de keyframes nécessaires.
- Fonctionne en mode Day comme en Dusk (l'or `--secondary` est défini dans les deux moods).

### Hors scope

- Pas de changement sur les autres liens de la nav.
- Pas de nouveaux tokens dans `index.css`.
- Pas de modification du composant `TransitionLink`.

Prêt à implémenter.