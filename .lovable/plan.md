# Glossaire contextuel pour les études de cas

Un composant unique `<Term>` qui rend les jargons explicables sans alourdir la lecture. Hover + focus + tap ouvrent un aperçu court; un lien "En savoir plus" dans le popover déroule un paragraphe complet. Déployé d'abord sur Sonor, Aetherix, Tacet.

## Principes

1. **Une annotation par terme par page**, à sa première occurrence. Les répétitions restent en texte simple.
2. **Affordance discrète:** underline pointillé fin, teinté gold/secondary à 60% d'opacité. Le terme reste lisible en flux normal.
3. **Un seul composant pour toutes les entrées:** hover desktop, focus clavier, tap mobile. Pas d'interaction parallèle qui se contredise.
4. **Source unique** dans `src/content/glossary.ts`. Réutilisable, traduisible, auditable.
5. **Respect direction artistique:** pas d'em-dash dans les définitions, ton calme, hospitalité jamais nommée, agentic présenté comme un outil.

## Composant `<Term>`

Fichier: `src/components/Term.tsx`

API:
```tsx
<Term id="rms">RMS</Term>
// children = libellé affiché (peut différer de la clé)
// id = clé dans le glossaire
```

Comportement:
- Rend un `<button type="button">` avec `aria-describedby` pointant le popover.
- Underline pointillé via classe Tailwind: `border-b border-dotted border-secondary/60 hover:border-secondary cursor-help`.
- Sur desktop: Radix `HoverCard` (hover + focus). Délai d'ouverture 120ms, fermeture 80ms.
- Sur tactile (`matchMedia('(hover: none)')`): bascule en Radix `Popover` (tap).
- Radix gère collision et flip, donc pas de chevauchement ni de contenu masqué.
- Le popover contient:
  - **Niveau 1:** le terme en `font-headline italic text-primary`, puis 1 à 2 phrases (12 à 30 mots) en `font-body text-sm`.
  - **Niveau 2:** un bouton `En savoir plus` discret en bas. Au clic, le popover s'agrandit (height auto, transition 220ms) et révèle un paragraphe de 40 à 80 mots, plus éventuellement un lien externe ou interne (`/journal/...`, doc, source).
- Le second niveau est mémorisé côté composant uniquement (state local), pas de persistance.
- Largeur popover: `w-72` (288px) niveau 1, `w-80` (320px) niveau 2. Cap sur mobile à `max-w-[calc(100vw-2rem)]`.

Style du popover (cohérent avec `TacetPipelineDiagram` et le reste):
- `bg-surface-container-high` avec `backdrop-blur-sm`
- `border border-outline-variant`
- `rounded-xl shadow-md`
- Padding `p-4`
- Petit halo gold optionnel en fond, opacity 0.2, comme signature visuelle

Accessibilité:
- `role="button"`, `tabIndex={0}`, déclenche au clavier (Enter/Space)
- `aria-expanded` reflète l'état niveau 2
- `prefers-reduced-motion: reduce` retire la transition d'agrandissement
- Contraste vérifié sur surface-container-high (clair) et sur le mode actif du site

## Glossaire

Fichier: `src/content/glossary.ts`

```ts
export type GlossaryEntry = {
  id: string;
  term: string;          // forme canonique pour affichage
  brief: string;         // niveau 1, 12 à 30 mots
  detail: string;        // niveau 2, 40 à 80 mots
  link?: { label: string; href: string; external?: boolean };
};

export const GLOSSARY: Record<string, GlossaryEntry> = {
  rms: { ... },
  pms: { ... },
  agentic: { ... },
  // etc.
};
```

Termes candidats initiaux (à confirmer en relisant les pages):

- **Sonor:** open data, B2G, SaaS, cartographie acoustique, MVP
- **Aetherix:** agentic AI, agent, orchestration, F&B, RevPAR, anticipation, Prophet, Claude, human-in-the-loop
- **Tacet:** synthetic acoustic twin, headless, RMS (Revenue Management System), PMS (Property Management System), JSON alerts, API-first, proxy data, OpenStreetMap, line of sight, yield

Je consoliderai la liste finale en relisant les trois pages avant rédaction.

## Déploiement sur les pages

Édits ciblés dans:
- `src/pages/Sonor.tsx`
- `src/pages/Atherix.tsx`
- `src/pages/Tacet.tsx`

Règle d'application: première occurrence d'un terme dans le flux narratif uniquement. Les diagrammes (ex: `TacetPipelineDiagram`) gardent leurs libellés tels quels pour préserver la composition visuelle; ils ne sont pas annotés.

## Section technique

- Dépendances déjà présentes: `@radix-ui/react-hover-card`, `@radix-ui/react-popover`. Zéro install.
- Détection tactile: hook léger `useIsTouch()` basé sur `matchMedia('(hover: none) and (pointer: coarse)')`, avec listener pour les changements (ex: passage tablette/clavier).
- View transitions déjà en place: le popover monte dans un portail, donc indépendant du flux de transition, pas de conflit.
- Pas de changement à `tailwind.config.ts` ni au design system; on utilise les tokens existants (`secondary`, `outline-variant`, `surface-container-high`, `primary`, `font-headline`, `font-body`, `font-label`).
- Pas d'em-dash dans les définitions (règle Core de la mémoire projet).

## Fichiers créés ou édités

Nouveau:
- `src/components/Term.tsx`
- `src/content/glossary.ts`
- `src/hooks/useIsTouch.ts`

Édités:
- `src/pages/Sonor.tsx`
- `src/pages/Atherix.tsx`
- `src/pages/Tacet.tsx`

Aucun changement aux routes, au layout, au header/footer, ni aux diagrammes.

## Hors périmètre (pour plus tard si validé)

- Field Notes, About, accueil
- Page glossaire dédiée (`/glossary`)
- Recherche dans le glossaire
- Traduction FR/EN des définitions
