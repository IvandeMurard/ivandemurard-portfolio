# Footer MCP et réponses pédagogiques de Rose

## Objectif
Rendre le rappel MCP du pied de page immédiatement utile, sans panneau intermédiaire, et permettre à Rose d'expliquer clairement le MCP présent sur ce site.

## Changements prévus

1. **Copie directe depuis le footer**
   - Remplacer le contrôle dépliable actuel par une action unique et compacte.
   - Au clic sur la ligne MCP, copier directement la commande Claude dans le presse-papiers.
   - Afficher un retour bref et accessible, par exemple « MCP command copied », puis revenir au libellé initial.
   - Supprimer le chevron, les états « Show/Hide command » et le panneau contenant la commande.
   - Conserver la mention factuelle « MCP · 5 public read-only tools for agents » pour que la destination du clic reste compréhensible.
   - Prévoir un message accessible annonçant le résultat de la copie et conserver un comportement propre si le presse-papiers est indisponible.

2. **Connaissance MCP de Rose**
   - Ajouter au contexte autoritatif de Rose trois réponses distinctes :
     - ce qu'est MCP, en langage simple ;
     - pourquoi ce portfolio en propose un, accès structuré aux case studies, Field Notes et profil depuis l'environnement de travail d'un agent ;
     - comment l'utiliser, avec la commande exacte déjà affichée sur le site et une explication courte de ce qu'elle installe.
   - Demander à Rose de rester concise, de distinguer ce MCP public du MCP propre à certains produits présentés, et de ne pas promettre d'accès en écriture.
   - Pour ces questions pédagogiques, répondre directement avant toute qualification commerciale et orienter vers `/architecture` seulement si le lecteur veut approfondir.

3. **Validation**
   - Tester le clic du footer sur desktop et mobile : aucune ouverture, commande exacte copiée, confirmation visible et annoncée.
   - Interroger Rose avec les trois formulations demandées et vérifier la précision, la concision et l'absence de confusion avec les MCP d'Aetherix, Tacet ou Paris Compass.
   - Vérifier les modes jour et nuit, le clavier et l'absence de débordement.
   - Régénérer les 13 copies statiques après validation et contrôler que le site compile sans erreur.

## Périmètre
Aucun changement de contenu éditorial, de données, de périmètre des cinq outils MCP, de mise en page générale ou de miroirs Markdown. Le contexte interne de Rose est mis à jour, pas le corpus public.
