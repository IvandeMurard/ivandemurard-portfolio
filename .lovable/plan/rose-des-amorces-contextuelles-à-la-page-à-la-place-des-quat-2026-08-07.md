# Rose: des amorces contextuelles à la page, à la place des quatre intentions fixes

## Réponse courte

Oui, c'est possible et c'est pertinent. Les quatre libellés actuels (« Product expertise », « Technical profile », « Culture fit », « Just exploring ») parlent du recrutement en général, jamais de ce que la personne est en train de lire. Sur `/lore` ou sur une field note, une amorce du type « Pourquoi une donnée synthétique suffit ici ? » convertit bien mieux qu'un chip générique.

Réserve: il faut garder une porte d'entrée « intention » pour les pages sans contenu propre (accueil, contact, atrium), sinon on perd le tri recruteur qui existe aujourd'hui.

## Ce qui change

Les chips deviennent une pile de questions choisie selon la route courante:

- Case study (`/aetherix`, `/tacet`, `/lore`, `/sonor`): trois questions propres au système, tirées de sa tension centrale. Exemple Lore: « Qu'est-ce qui est réel et qu'est-ce qui est synthétique ? », « Comment le harnais bloque une release ? », « Pourquoi la voix plutôt qu'un formulaire ? ».
- Field note (`/journal/:slug`): trois questions dérivées de la note affichée, dont une définition (« Explique-moi un grader en une phrase »), une application (« Comment j'applique ça à mon équipe ? ») et un lien vers le produit qui l'illustre.
- Index (`/journal`, `/journeys`): une question d'orientation plus une question de comparaison entre projets.
- Accueil, atrium, contact, 404: on garde les chips d'intention actuels, inchangés.

Le dernier chip de chaque page reste une porte de sortie constante: « Book a call ».

Au repos le dock garde le voile de verre récemment mis en place, les chips suivent le même estompage.

## Détails techniques

- Nouveau fichier `src/content/rosePrompts.ts`: table `ROSE_PROMPTS` associant un motif de route (exact ou préfixe) à trois amorces `{ label, message, intent }`. Une entrée `default` reprend `INTENT_CHIPS`.
- Pour `/journal/:slug`, les amorces se composent à partir de l'entrée de `src/content/journal.ts` (titre, termes clés déjà présents dans les blocs) avec un repli générique si le slug est inconnu; pas de génération côté modèle, tout est écrit à la main pour rester exact.
- `RoseDock.tsx` lit `useLocation()` et résout la liste via une fonction `getRosePrompts(pathname)`. Le rendu des chips ne change pas, seule la source change. `INTENT_CHIPS` reste exporté pour le repli.
- Le `message` envoyé à Rose inclut le contexte de page (« Sur la page Lore: ... ») afin que la réponse reste ancrée; `detectedIntent` continue d'être posé quand l'amorce porte une intention recruteur.
- Aucune modification de l'edge function `rose-chat` ni du contexte serveur.
- Accessibilité: les chips gardent bordure pleine, contraste AA, `aria-label` explicite quand le libellé est elliptique.

## Vérification

Playwright: capture des chips sur `/`, `/lore` et `/journal/harnesses-graders-closed-loops`, puis un clic sur une amorce contextuelle pour confirmer que la réponse cite bien la page courante.
