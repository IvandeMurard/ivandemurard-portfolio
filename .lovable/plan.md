# Fix: navigation bar links non functional on the home page

## Symptom

Reproduit via le navigateur depuis `/` :

- Clic sur "Case Studies", "About", "Field Notes", "Contact" dans la barre du haut → URL ne change pas, aucun log console.
- Clic sur les CTA hero "Step inside" / "View the Journeys" → navigation vers `/journeys` OK.
- Clic sur "Explore all stories" (TransitionLink) → OK.

Donc le routeur, `useViewTransitionNavigate`, et le composant `TransitionLink` fonctionnent. Seuls les `NavLink` du centre de `AtriumHeader` échouent.

## Cause

Dans `src/components/layout/AtriumHeader.tsx`, le centre de la nav utilise `NavLink` de react-router avec un `onClick` custom qui fait `e.preventDefault()` puis appelle `tnav(to)`. Ce pattern de chaînage avec le handler interne de `NavLink` casse la navigation dans ce contexte (le `preventDefault` neutralise la navigation native du Link mais la View Transition lancée juste après ne déclenche pas la navigation react-router attendue). Le pattern n'est utilisé que dans `AtriumHeader`, ce qui explique que seul ce composant soit cassé. `TransitionLink` (utilisé partout ailleurs) gère ce chaînage correctement et fonctionne.

## Correction

**Fichier modifié : `src/components/layout/AtriumHeader.tsx`**

1. Supprimer le helper `handleNavClick` et l'import `useViewTransitionNavigate`.
2. Remplacer les deux `NavLink` (centre desktop + overlay mobile) par `TransitionLink`, déjà importé dans le fichier.
3. Calculer l'état actif manuellement à partir de `useLocation` :
   - Pour `to === "/"` : actif si `pathname === "/"` (équivalent du `end` prop).
   - Sinon : actif si `pathname === to` ou commence par `to + "/"`.
4. Conserver toutes les classes existantes (idle, actif, hover, text-shadow gold) pour préserver l'esthétique.
5. Garder l'import `NavLink` uniquement s'il reste utilisé ailleurs dans le fichier, sinon le retirer.

## Validation

- Recharger `/`, cliquer sur chaque lien de la nav centrale (Case Studies, About, Field Notes, Contact) → URL change et la page transitionne.
- Depuis `/journeys`, cliquer "Home" puis revenir → toujours OK.
- Vérifier que l'état actif (souligné doré + text-shadow) s'affiche bien sur la page courante.
- Vérifier le menu mobile (hamburger ouvert) : mêmes liens cliquables, ferme le menu après navigation grâce au `useEffect` existant sur `location.pathname`.
- Aucun changement d'apparence : seul le mécanisme de clic est remplacé.
