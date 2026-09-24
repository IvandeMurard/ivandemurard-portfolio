# Deux instruments éditoriaux : Aetherix et Lore

## Direction commune

Créer deux figures de précision dans le langage déjà établi par le blueprint de l’Architecture et le banc du canari : cadre gravé, traits fins, graduations, repères de plaque, encre chaude, peu de texte. Elles doivent ressembler à des instruments construits pour examiner une preuve, pas à des tableaux de bord.

Les animations sont déclenchées par un bouton explicite, rejouables, utilisables au clavier et remplacées par l’état final sous `prefers-reduced-motion`. Jour et nuit conservent le contraste AA. Aucun chiffre ni résultat nouveau ne sera inventé.

## 1. Aetherix, vernier d’anticipation

Dans la section 09 « Performance », remplacer les trois cartes de métriques par une large plaque instrumentale intitulée « FIG. 9.1 · ANTICIPATION VERNIER ».

Le vernier met en tension deux lectures :

- l’échelle principale porte la prévision J+1 et son baseline synthétique, MAPE 15.09 % ;
- le curseur secondaire matérialise le seuil de gate à 22 % ;
- une aiguille part de la zone de calibration, se cale sur 15.09 %, puis le verrou du gate passe à « PASS » ;
- les mentions « Synthetic backtest », « 0 real users » et « Real-world measurement begins with the pilot » restent visibles dans la plaque afin que la démonstration ne transforme jamais le baseline en résultat réel ;
- le statut du projet et les 14/14 security gates restent présents sous forme de repères secondaires, sans conserver trois cartes séparées.

Le bouton « Calibrate » lance une lecture courte : balayage de l’échelle, arrêt de l’aiguille, alignement du vernier, verrou final. Le mouvement reste mécanique, sans halo décoratif. La légende sous la figure reprend seulement le caveat existant.

## 2. Lore, spectrogramme de conformité

Dans la section 07 « How we know it holds », remplacer la table des tiers par une large plaque intitulée « FIG. 7.1 · COMPLIANCE SPECTROGRAM ».

Le spectrogramme donne une présence visuelle aux neuf graders :

- neuf bandes horizontales, regroupées visuellement sous les tiers Safety, Trust et Form ;
- chaque bande représente un contrôle déterministe et s’allume quand la lecture la traverse ;
- les seuils 100 % / no budget, 95 % et 90 % restent les trois lignes de référence ;
- un défaut de Form reste visible comme écart toléré, tandis qu’un défaut Safety coupe immédiatement la lecture et ferme le gate ;
- les nombres existants restent explicites : 64 cas, 12 catégories, 9 graders, et le précédent 52/53 refusé pour une seule faute en tier 1.

Le bouton « Scan suite » fait parcourir les bandes par une tête de lecture fine, puis affiche le verdict. L’actuelle console d’évaluation reste sous la figure : elle donne le détail textuel du replay, tandis que le spectrogramme montre la hiérarchie des contraintes. Les noms précis des neuf graders seront repris uniquement s’ils existent déjà dans les sources du projet ; sinon les bandes resteront numérotées et groupées, sans taxonomie inventée.

## 3. Intégration et synchronisation

- Créer `AetherixAnticipationVernier.tsx` et `LoreComplianceSpectrogram.tsx` comme composants autonomes.
- Retirer de leurs pages les représentations qu’ils remplacent, sans toucher aux autres sections.
- Ajouter uniquement les styles d’animation nécessaires dans les styles globaux, avec arrêt complet en mouvement réduit.
- Mettre `public/aetherix.md` et `public/lore.md` en phase avec les légendes et les informations visibles, sans tenter de traduire l’animation en prose longue.
- Régénérer `public/llms-full.txt` et les 13 pages pré-rendues.

## Vérification

- Lecture complète des deux séquences, replay, clavier et mouvement réduit.
- Contrôle à 1280 px et 375 px, en jour et en nuit : aucun chevauchement ni défilement horizontal.
- Vérifier que tous les chiffres sont sourcés par le contenu existant et que les caveats restent immédiatement visibles.
- Contrôle final des miroirs Markdown, du corpus LLM et des pages pré-rendues.
