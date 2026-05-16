## Aperçu live au survol du toggle ambiance

Quand l'utilisateur survole (ou focus clavier) le toggle Day/Dusk dans le header, le site entier bascule visuellement dans l'autre ambiance pendant le hover. Quand il quitte le bouton sans cliquer, l'ambiance d'origine revient. Au clic, le choix est confirmé et persisté comme aujourd'hui.

C'est cohérent avec l'esprit du site: l'affordance n'est pas un mot, c'est la sensation. On voit ce qu'on s'apprête à choisir.

## Comportement

- **Survol / focus**: applique l'ambiance opposée à tout le document, sans toucher au state stocké, sans écrire dans `localStorage`.
- **Sortie / blur** sans clic: rétablit l'ambiance d'origine.
- **Clic**: comportement actuel, `toggle()` met à jour le state et la persistance. L'aperçu se résout naturellement puisque l'état réel rattrape l'aperçu.
- **Désactivé**: si `prefers-reduced-motion: reduce` est actif, on retire la transition CSS mais on garde l'aperçu (le swap reste utile, juste sans fondu).
- **Tactile**: aucun aperçu (pas de hover fiable). On garde le tap = toggle.
- **Effet visuel pendant l'aperçu**: léger halo du knob (déjà présent au hover) + très subtile pulsation 1s sur la track pour signaler que c'est un aperçu, pas le choix définitif. Optionnel, à valider.

## Implémentation

1. **`MoodProvider`**: exposer une API d'aperçu sans toucher au state persistant.
   - Ajouter `preview: Mood | null`, `setPreview(m: Mood | null)`.
   - Dans l'effet qui synchronise `document.documentElement.dataset.mood`, utiliser `preview ?? mood`.
   - Ne JAMAIS écrire `preview` dans `localStorage`. Le `useEffect` de persistance écrit uniquement `mood`.

2. **`MoodToggle`**: brancher les events sur le `<button>`.
   - `onMouseEnter` / `onFocus` (uniquement non-touch): `setPreview(isDusk ? "day" : "dusk")`.
   - `onMouseLeave` / `onBlur`: `setPreview(null)`.
   - `onClick`: `setPreview(null)` puis `toggle()` (sinon le preview écraserait brièvement le nouveau mood).
   - Détection tactile via le hook `useIsTouch` existant.

3. **Pas de changement de CSS**: les variables de thème basculent déjà via `[data-mood="dusk"]`. Les transitions CSS globales sur `background`, `color`, `border` (déjà présentes dans `index.css`) assurent un fondu naturel.

## Risques et garde-fous

- **Flicker au clic**: résolu en posant `setPreview(null)` avant `toggle()`.
- **Hover bloqué sur mobile pseudo-hover** (iPad clavier-souris): `useIsTouch` se base sur `(hover: none) and (pointer: coarse)`, donc un iPad avec souris déclenche l'aperçu. Acceptable.
- **Performance**: un seul `data-attribute` change, pas de re-render React global, juste un repaint CSS.
- **Coût visuel**: si le swap entier semble trop fort à l'usage, on peut limiter l'aperçu au header + premier viewport via une classe sur `<html>`. À garder en plan B, pas en V1.

## Fichiers touchés

- `src/components/MoodProvider.tsx` (ajout `preview` + `setPreview`)
- `src/components/MoodToggle.tsx` (handlers hover/focus)

Aucun autre fichier impacté. Pas de nouvelle dépendance.