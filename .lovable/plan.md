# Reprise de la présence MCP

## Objectif
Faire du MCP une preuve discrète mais immédiatement compréhensible du profil builder, sans créer une carte technique isolée ni perturber le parcours principal de la page d’accueil.

## Changements

### 1. Recomposer le bloc de la page d’accueil
- Supprimer l’encadré actuel et sa présentation en « terminal dans une carte ».
- L’intégrer comme une courte transition éditoriale dans la continuité de la page, avec le même alignement, les mêmes séparateurs et le même rythme que les autres sections.
- Afficher clairement le nom **MCP** et sa fonction : cinq outils publics, en lecture seule, donnent accès aux case studies, aux Field Notes et au profil.
- Remplacer « not just readable as pages » par une formulation factuelle centrée sur l’usage et la valeur.
- Garder une seule action principale : **Copy MCP command**.
- Afficher l’endpoint comme information secondaire sélectionnable, sans second bouton concurrent.

### 2. Corriger la commande et l’affichage mobile
- Supprimer la barre de défilement horizontale visible.
- Présenter la commande sur plusieurs lignes ou dans un champ qui s’adapte à la largeur disponible.
- Garantir que le bouton, le texte et la commande restent lisibles sans débordement sur mobile et desktop.
- Conserver un retour explicite après copie et une navigation clavier complète.

### 3. Ajouter le signal MCP au pied de page universel
- Ajouter au pied de page une ligne compacte et clairement nommée, par exemple **MCP · 5 read-only tools**.
- Cette ligne ouvrira ou révélera la commande copiable, plutôt que de répéter le grand bloc sur chaque page.
- Garder cette présence secondaire par rapport aux liens de contact, mais visible sur toutes les pages.

### 4. Adapter les usages selon la page
- **Accueil** : preuve builder concise, avec valeur et commande.
- **Architecture et note d’évaluation** : conserver une version contextualisée, intégrée au flux éditorial et non présentée comme un encart générique.
- Éviter toute répétition entre le signal du pied de page et le contenu développé de la page.

### 5. Vérification et synchronisation
- Vérifier l’accueil, Architecture, la note d’évaluation et le pied de page en mode jour et nuit.
- Vérifier desktop et mobile, notamment l’absence de débordement et la compréhension de l’action principale.
- Régénérer les copies statiques après validation visuelle.
- Aucun changement au contenu des articles, aux données MCP, à Rose ou aux miroirs Markdown n’est nécessaire, car cette passe change uniquement leur présentation et leur découvrabilité.

## Fichiers concernés
- `src/components/McpEndpoint.tsx`
- `src/components/layout/Footer.tsx`
- `src/pages/Index.tsx`
- `src/pages/Architecture.tsx` et le rendu des blocs MCP de la note, seulement si leur composition doit être adaptée
- copies statiques dans `prerendered/`
