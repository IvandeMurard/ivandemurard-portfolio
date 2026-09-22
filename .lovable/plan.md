# Blueprint du Maillage, section 03 de la note d'architecture

Une gravure interactive des cinq agents, au trait fin, qui remplace le diagramme en cartes actuellement affiché dans « The five agents » (/architecture). Même facture que le banc de calibration du canari : traits 1px, encre chaude, aucune décoration gratuite.

## Ce que le lecteur verra

Un cadre large de la colonne de lecture, intitulé « FIG. 3.1 · THE MESH, AS WIRED ».

Au repos : cinq noms disposés autour d'un noyau central de persistance (PostgreSQL et mémoire partagée). Chaque agent est relié au noyau par un rayon d'un pixel. Un rayon plein signifie « construit », un rayon pointillé signifie « conçu, pas écrit ». Les statuts restent exactement ceux du tableau juste au-dessus : Aetherix et Tacet construits, Anima en prototype synthétique, Peritia et l'Orchestrateur en conception.

Au survol d'un agent : son rayon s'illumine et une impulsion parcourt le trait jusqu'au centre, puis revient. Rien d'autre ne bouge.

Au clic sur un agent : le panneau sous la figure se remplace par la fiche de ce nœud, reprise mot pour mot du tableau (statut, ce qu'il possède, ce qu'il ne possède pas), plus le lien vers sa page quand elle existe (Aetherix, Tacet, Anima). Un second clic, ou Échap, revient à la vue d'ensemble. Peritia et l'Orchestrateur n'ont pas de page : leur fiche le dit.

Au clavier : les cinq agents sont atteignables par tabulation, activables par Entrée ou Espace, avec le même rendu qu'au survol.

Mouvement réduit activé : la figure s'affiche directement dans son état final, les impulsions ne jouent pas, le clic fonctionne normalement.

## Ce que cela remplace

Le diagramme en cartes actuel de la section 03 fait doublon avec le tableau et parle depuis le point de vue d'Aetherix (« this node »). Il disparaît de /architecture. Il reste inchangé sur la page Aetherix, où ce point de vue est juste.

Le tableau des cinq agents reste en place, au-dessus de la figure : la figure montre le câblage, le tableau garde les mots.

## Contraintes tenues

Pas de défilement horizontal, en mobile comme en bureau : sous 768 px la figure passe en colonne, le noyau au centre, les rayons verticaux.
Pas de texte ajouté à l'article hormis une légende de deux lignes.
Aucune donnée nouvelle : tout vient de la table existante.
Contraste AA en clair comme en sombre.

## Détails techniques

- Nouveau composant `src/components/architecture/MeshBlueprint.tsx` : SVG unique, `viewBox` fixe, traits `stroke-width` 1 à 1.2, couleurs par jetons sémantiques (`--secondary` pour l'encre chaude, `--outline-variant` pour le repos), impulsions animées en CSS (`stroke-dasharray` / `stroke-dashoffset`) plutôt qu'en JS, coupées sous `prefers-reduced-motion`.
- Les cinq nœuds sont des `<g>` avec `role="button"`, `tabIndex=0`, `aria-pressed`, `aria-label` reprenant nom et statut. Le panneau de détail est une région `aria-live="polite"` en HTML hors SVG, pas du texte SVG, pour rester lisible et sélectionnable.
- Les données proviennent de `NODE_ROWS` dans `src/pages/Architecture.tsx`, extraites dans un module partagé pour que la figure et le tableau ne puissent pas diverger.
- Mise en page responsive par deux jeux de coordonnées (radial et vertical) choisis via un `matchMedia("(min-width: 768px)")` déjà utilisé ailleurs dans le projet.
- Dans `Architecture.tsx`, section `the-nodes` : `AetherixMeshDiagram` remplacé par `MeshBlueprint`. L'import devient inutile sur cette page.

## Vérification et synchronisation

- Playwright à 1280 et 375 : aucun débordement, survol, clic et tabulation vérifiés, console propre.
- Contrôle visuel en thème clair et sombre.
- Miroir `public/architecture.md` : une ligne décrivant la figure 3.1, sans changer la prose existante.
- `llms-full.txt` régénéré, puis les 13 copies statiques `prerendered/` régénérées.
- Rose et le serveur MCP ne changent pas : aucun fait nouveau n'est introduit.

## Ensuite, si validé

Le vernier d'anticipation sur /aetherix, puis le spectrogramme de conformité sur /lore. La question de remonter le blueprint sur la page d'accueil se tranchera une fois la figure vue en place.
