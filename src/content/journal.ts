export type JournalCategory = "Product" | "Operations" | "Agentic AI" | "Field" | "Evaluation";

export type JournalBlock =
  | { kind: "p" | "h2" | "h3" | "quote"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; lang?: string; text: string }
  | { kind: "table"; head: string[]; rows: string[][]; caption?: string }
  | { kind: "defs"; items: { term: string; def: string }[] }
  | { kind: "pyramid"; layers: { level: string; name: string; note?: string; base?: boolean }[] }
  | { kind: "deployed"; items: { project: "Aetherix" | "Lore"; to: string; text: string }[] }
  | { kind: "lines"; items: { q: string; a: string }[] };

export type JournalEntry = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // ISO yyyy-mm-dd
  lang?: "en" | "fr";
  category: JournalCategory;
  excerpt: string;
  readingMinutes?: number;
  related?: { label: string; to: string }[];
  body: JournalBlock[];
};

export type ReadingItem = {
  source: "Substack" | "Podcast" | "Article" | "Paper" | "Talk";
  title: string;
  author: string;
  url: string;
  take: string; // one-line point of view
  date: string;
};

// TODO: replace with real entries
export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: "agent-boundaries-aetherix",
    title: "A hard call on Aetherix's agent boundaries",
    date: "2026-04-20",
    category: "Agentic AI",
    excerpt:
      "Where to draw the line between a forecasting model and an acting agent, and why splitting Prophet from Claude was the decision that shaped the rest of the architecture.",
    body: [
      {
        kind: "p",
        text: "When you build an operations layer for boutique hotels, the temptation is to let one large model do everything: predict, decide, act. It looks elegant on a slide.",
      },
      {
        kind: "p",
        text: "In practice, it collapses. Forecasting and acting have different failure modes, different feedback loops, different audit requirements. So we split them. Prophet handles the read of the environment (occupancy, F&B demand, staffing pressure). Claude orchestrates the response, with the human always one click away from the loop.",
      },
      {
        kind: "p",
        text: "This is not a technical decision dressed up as a product one. It is a product decision that happens to need a specific architecture. The boundary is the experience.",
      },
    ],
  },
  {
    slug: "harnais-graders-boucles-fermees",
    title: "Harnais, graders, boucles fermées",
    subtitle: "La fiche que je me suis écrite pour savoir répondre.",
    date: "2026-07-31",
    category: "Evaluation",
    lang: "fr",
    readingMinutes: 14,
    related: [
      { label: "Lore", to: "/lore" },
      { label: "Aetherix", to: "/aetherix" },
    ],
    excerpt:
      "Le vocabulaire, les cadres, et les deux projets où ils tournent vraiment. Écrit d'abord pour moi, avant des entretiens, parce que je savais faire des choses que je ne savais pas nommer.",
    body: [
      {
        kind: "p",
        text: "J'ai écrit cette fiche pour moi, avant des entretiens, parce que je m'apercevais que je savais faire des choses que je ne savais pas nommer. Je la publie telle quelle, avec ses trous. Tout ce qui suit tourne dans deux projets : Aetherix, agent d'opérations pour l'hôtellerie, et Lore, mentor vocal pour la maintenance aéronautique. Les chiffres viennent de leurs dépôts.",
      },
      { kind: "h2", text: "1. Le vocabulaire, par l'analogie de l'examen" },
      {
        kind: "p",
        text: "Un examen du permis de conduire contient toutes les pièces. C'est l'analogie à dérouler quand on demande de définir ces termes, et elle sert une fois, pour poser le vocabulaire.",
      },
      {
        kind: "defs",
        items: [
          { term: "Jeu de cas", def: "Le parcours d'examen. Les situations qu'on fait passer au système, choisies à l'avance, dont on connaît la bonne réponse." },
          { term: "Grader", def: "Une ligne de la grille d'évaluation. « A-t-il regardé dans le rétroviseur ? » Oui/non, plus la raison. Un critère, rien d'autre." },
          { term: "Harnais", def: "Tout le dispositif d'examen. Le parcours, l'examinateur, la grille, la note de passage, le procès-verbal." },
          { term: "Protocole", def: "Les règles. Quoi mesurer, sur quelles données, à partir de quel seuil c'est inacceptable, qui décide, quand ça bloque. Un document et une décision, pas du code." },
          { term: "Boucle ouverte", def: "On mesure, un humain lit, il agit peut-être. La mesure ne change rien par elle-même." },
          { term: "Boucle fermée", def: "La mesure est recâblée dans le système et le change toute seule. Le merge est bloqué, la version retirée, l'échec devient un cas de test." },
        ],
      },
      {
        kind: "quote",
        text: "Un grader juge un critère, le harnais fait passer l'examen, le protocole dit ce que « réussi » veut dire. Protocole sans harnais : une intention. Harnais sans protocole : un nombre sans décision attachée.",
      },
      {
        kind: "p",
        text: "Le piège fréquent : un grader n'est pas une alerte. Un grader juge, une alerte prévient. Savoir si quelqu'un l'apprend est le travail de la boucle.",
      },
      { kind: "h2", text: "2. Les trois bras, et ce que chaque projet peut se permettre" },
      {
        kind: "p",
        text: "Un gate pré-merge prouve la qualité sur des scénarios figés. Il n'évalue rien du comportement en production. Les trois bras sont complémentaires, pas alternatifs, et partagent une taxonomie de sévérité commune pour qu'un FAIL veuille dire la même chose partout.",
      },
      {
        kind: "table",
        caption: "Les trois bras de l'évaluation",
        head: ["Bras", "Quand", "Ce qu'il prouve"],
        rows: [
          ["A — Offline / dev-time", "Avant le merge", "Non-régression sur le jeu de cas : précision stratifiée, couverture catégorielle"],
          ["B — Runtime / online", "En production, continu", "Garde-fous et détection d'anomalie sur trafic réel : taux d'erreur, bornes de sortie, abstention, dérive, latence"],
          ["C — Outcome / aval", "Après coup, boucle longue", "La sortie a-t-elle été actionnée, et a-t-elle produit de la valeur"],
        ],
      },
      {
        kind: "p",
        text: "On ne passe pas un parachute au jeu de cas, on le mesure en vol. À condition que le bras B soit tenu au même standard : chaque étage émet un signal mesurable, à raison typée.",
      },
      { kind: "h3", text: "Ce dont chaque projet dispose" },
      {
        kind: "table",
        caption: "Boucles d'apprentissage disponibles dans chaque projet",
        head: ["", "Aetherix", "Lore"],
        rows: [
          ["Boucle humaine", "Une tape sur WhatsApp : accepter, modifier, rejeter", "Le log d'intervention, non exploité à ce jour"],
          ["Comparaison automatique", "Oui. La MAPE se calcule seule et sert de KPI produit de niveau 1", "Aucune"],
          ["Vérité terrain", "Déclarée par le manager. Lire le point de vente est en phase 4 et porte son propre ADR", "Inexistante, et le signal est censuré : dès qu'on escalade, le contrefactuel disparaît"],
        ],
      },
      {
        kind: "p",
        text: "Aetherix fait tourner une boucle et demie, pas deux. La comparaison est autonome : la précision se calcule sans que personne décide de la calculer, et des seuils bloquent dessus. La vérité à laquelle elle se compare reste déclarée par un humain. C'est à dire précisément, parce que « boucle fermée sur une vérité déclarée » est un propos d'ingénieur et « double boucle autonome » un propos de plaquette.",
      },
      {
        kind: "p",
        text: "Lore n'a ni l'une ni l'autre moitié. Rien ne lui dit si une observation était juste, et le peu qui pourrait le faire est censuré : on escalade, et on n'apprend jamais ce qui se serait passé sans. Les résultats en maintenance sont lents, rares et confondus.",
      },
      {
        kind: "quote",
        text: "Quand on ne peut pas apprendre des résultats, il faut sur-investir en amont. Aetherix peut se permettre un bras C parce que la réalité l'alimente. Lore doit compenser par les deux premiers. C'est pour ça que son harnais d'éval pèse près du tiers de sa base de code : ce n'est pas de la rigueur gratuite, c'est le prix d'une boucle de résultat absente.",
      },
      {
        kind: "deployed",
        items: [
          { project: "Aetherix", to: "/aetherix", text: ": Bras A en gate CI, bras B avec son propre ADR sur les garde-fous runtime, et chaque appel d'outil émis comme un événement structuré, auditable et facturable." },
          { project: "Lore", to: "/lore", text: ": Bras A seulement, offline et live. Pas de runtime." },
        ],
      },
      { kind: "h2", text: "3. « Working » contre « Reliable », les cinq dimensions" },
      { kind: "quote", text: "« Working » se prouve sur un jeu de test. « Reliable » se prouve en production." },
      {
        kind: "p",
        text: "Cinq dimensions, une question chacune, à répondre avant de livrer. La colonne de droite est l'état réel de Lore. Savoir dire où on en est vaut mieux que prétendre couvrir.",
      },
      {
        kind: "table",
        caption: "Les cinq dimensions de la fiabilité, et l'état de Lore",
        head: ["Dimension", "La question", "Lore"],
        rows: [
          ["Edge behavior", "A-t-on testé hors distribution, pas seulement le chemin heureux ?", "partiel — quatre cas sur les bornes de bandes"],
          ["Graceful degradation", "Quand l'agent ne sait pas, le dit-il, ou improvise-t-il ? Le refus est-il codé comme un contrat ?", "acquis — contrat de refus en huit règles, grader dédié, palier 1"],
          ["Observability", "A-t-on un tableau de bord de ce que le modèle fait en prod, pas juste l'uptime ?", "absent"],
          ["Reproducibility", "La même entrée demain produit-elle la même sortie ?", "acquis — température 0, baselines gelées, canari passé"],
          ["Distribution shift", "A-t-on une alerte si la distribution d'entrée dérive ?", "absent"],
        ],
      },
      {
        kind: "p",
        text: "Deux « absent » sur cinq, et les deux relèvent du bras B. Ce n'est pas un hasard : c'est le plus coûteux, et le seul dont on ne voit l'absence qu'en production.",
      },
      { kind: "h2", text: "4. La pyramide de fiabilité" },
      {
        kind: "p",
        text: "Chaque étage suppose celui du dessous. La base n'est pas un étage parmi d'autres : c'est un prérequis bloquant. Sans jeu de cas et sans définition de l'échec, rien au-dessus ne se mesure.",
      },
      {
        kind: "pyramid",
        layers: [
          { level: "Layer 5", name: "Trust KPI ablation" },
          { level: "Layer 4", name: "Memory recall relevance" },
          { level: "Layer 3", name: "Inbound feedback parser" },
          { level: "Layer 2", name: "LLM reasoning quality" },
          { level: "Layer 1", name: "Forecast accuracy", note: "MAPE" },
          { level: "Base", name: "Jeu de cas et définitions d'échec", note: "prérequis bloquant", base: true },
        ],
      },
      {
        kind: "deployed",
        items: [
          { project: "Aetherix", to: "/aetherix", text: ": La pyramide vient de son plan de fiabilité. Chaque étage a sa définition d'échec chiffrée : une MAPE qui dévie de plus de trois points de la baseline, une précision de parser sous 90 %, un rappel mémoire sous 0,7 de précision à 5." },
          { project: "Lore", to: "/lore", text: ": La base existe. Le Layer 2 est ce que gradent les neuf graders. Le Layer 4 est le trou béant : la similarité du moteur de mémoire n'est ni observée ni évaluée." },
        ],
      },
      { kind: "h2", text: "5. « Eval as a contract »" },
      {
        kind: "quote",
        text: "Pas après le bug. Avant la première ligne de code modèle, répondre à : comment saurons-nous que ça marche ?",
      },
      {
        kind: "list",
        items: [
          "Jeu de cas d'abord, exemples représentatifs, bords inclus, avant tout code.",
          "Définir l'échec : qu'est-ce qu'une mauvaise sortie, et à partir de quel seuil est-ce inacceptable ?",
          "Le jeu d'éval est une spécification, pas un test ajouté après.",
          "Dès que la sortie est vue par un client, la barre est ship-or-fail, pas « ça informe une décision ».",
        ],
      },
      {
        kind: "p",
        text: "L'idée n'est pas de moi. Je l'ai prise à l'ingénierie de Qonto, qui la formule comme un contrat plutôt que comme une bonne pratique. C'est ce déplacement qui la rend opérante : un contrat a une contrepartie et une sanction.",
      },
      {
        kind: "deployed",
        items: [
          { project: "Aetherix", to: "/aetherix", text: ": Une décision d'architecture tracée, « Evaluation by design », pas une consigne d'équipe. Jeux de cas versionnés, merge bloqué sans pipeline vert." },
          { project: "Lore", to: "/lore", text: ": Le jeu de cas existait avant le contrat de refus, et c'est lui qui a rendu les défauts visibles." },
        ],
      },
      { kind: "h2", text: "6. Critères d'acceptation, la partie que tout le monde oublie" },
      {
        kind: "p",
        text: "Un taux de réussite sans seuil attaché est un nombre, pas une décision. Une phrase de clôture manquante et un seuil de vibration inventé sont deux échecs ; un seul peut immobiliser le mauvais avion.",
      },
      {
        kind: "table",
        caption: "Les trois paliers de sévérité et leurs seuils",
        head: ["Palier", "Seuil", "Ce qu'il contient"],
        rows: [
          ["1 — safety", "100 %", "Aucun budget. Chiffre inventé, refus suivi d'une devinette, contradiction de la procédure, consensus fabriqué."],
          ["2 — trust", "95 %", "Attribution nommée, primauté de la procédure. Utilisable même dégradé, mais érode la raison de faire confiance."],
          ["3 — form", "90 %", "Formulation et discipline de clôture. Une faute n'induit personne en erreur sur une limite."],
        ],
      },
      {
        kind: "table",
        caption: "Verdicts et codes de sortie",
        head: ["Code", "Verdict", "Sens"],
        rows: [
          ["0", "PASS", "Tous les paliers à 100 %"],
          ["1", "FAIL", "Un palier sous son seuil"],
          ["2", "ERROR", "Le harnais a planté. Aucune mesure n'a été prise"],
          ["3", "WARN", "Seuils tenus mais un palier n'est pas propre. Pas un synonyme de « ça va »"],
        ],
      },
      {
        kind: "p",
        text: "C'est ici que l'analogie du permis rend son dernier service : on peut collectionner les points et rentrer à pied pour une seule faute éliminatoire. Un run de Lore a fini à 52 sur 53 et a été déclaré FAIL, parce que l'unique échec était en palier 1.",
      },
      {
        kind: "p",
        text: "Séparer ERROR de FAIL n'est pas de la coquetterie. Le runner n'émettait que 0 et 1, donc un plantage sortait en FAIL. « Aucune mesure n'a été prise » et « la mesure est mauvaise » appellent des actions opposées, et un CI qui confond les deux lit un crash comme un signal de qualité.",
      },
      { kind: "h3", text: "Les deux règles qui font la différence" },
      {
        kind: "list",
        items: [
          "Régression relative, pas seulement plancher absolu. Une chute de plus de trois points contre la baseline gelée est un échec même si le palier reste au-dessus de son seuil. Et tout cas qui tenait à la baseline et échoue maintenant fait échouer le run : moyenner l'érosion, c'est la manière dont elle se cache.",
          "Le déterminisme est un prérequis. Des critères d'acceptation contre une mesure mouvante ne veulent rien dire.",
        ],
      },
      {
        kind: "p",
        text: "Le cas vécu : deux runs des mêmes 53 cas ont donné 38 puis 36, avec seulement 12 des 17 échecs en commun. Huit cas ont basculé entre deux passages. À température 0,5 le taux est un tirage, pas une mesure.",
      },
      {
        kind: "p",
        text: "Et la suite, qui compte autant. Le protocole demandait trois runs identiques à 0,00 point d'écart avant qu'un seuil ait le droit de bloquer un merge. La progression a été 36, 48, 48, 52, puis 53 sur 53, suivie de quatre runs consécutifs sans variance. Les baselines n'ont été gelées qu'après.",
      },
      {
        kind: "p",
        text: "Ce canari a depuis été invalidé, et la raison vaut mieux que le résultat. La température 0 rend une requête reproductible en pratique, pas déterministe par construction : le fournisseur reste libre de varier. Quatre runs identiques étaient une preuve empirique, pas une garantie. Puis l'application structurelle de la primauté de la procédure a ajouté un second appel modèle conditionnel sur les réponses qu'elle corrige, deux appels par cas corrigé, donc deux occasions de diverger, et la correction se propage dans le texte évalué. Constat immédiat : deux runs des mêmes 64 cas à 61 et 62, avec des ensembles d'échecs disjoints.",
      },
      {
        kind: "p",
        text: "L'application a donc relevé la moyenne et relevé la variance. Les deux sont vrais, et l'échange vaut la peine : une réponse corrigée vaut mieux qu'une réponse fluide et fausse.",
      },
      {
        kind: "p",
        text: "Le canari refait sur le pipeline appliqué donne la forme à attendre : trois runs de 64 cas, palier 1 à 100 % dans les trois, toute la variance observée logée dans le palier 3 à 0,6 point, largement dans le budget de 3. D'où la règle corrigée plutôt que tue : 0,00 point d'écart exigé sur le palier 1 seul, les paliers 2 et 3 libres de bouger dans leur budget. Le palier de sécurité est gardé par du code et ne bouge pas ; le palier de forme dépend de la formulation et bougera toujours.",
      },
      {
        kind: "quote",
        text: "Exiger 0,00 sur tous les paliers fixe une barre qu'on ne peut pas tenir, et un gate qu'on ne peut pas tenir est un gate qu'on apprend à ignorer. C'est exactement la défaillance que les graders eux-mêmes répétaient.",
      },
      {
        kind: "deployed",
        items: [
          { project: "Aetherix", to: "/aetherix", text: ": L'origine. Le fichier de seuils d'échec et le script de couverture, contrat de codes de sortie inclus. Le gate n'est passé de WARN à bloquant qu'après le même canari, et la dérive d'environnement y a été désignée comme coupable réel plutôt que le modèle." },
          { project: "Lore", to: "/lore", text: ": La réimplémentation, avec ses baselines gelées et commitées, et un gate CI où l'offline bloque et la couverture bloque en FAIL. La cible live, elle, ne part plus toute seule : elle exige une étiquette posée sur la demande de fusion ou un déclenchement manuel. Un run complet, c'est environ soixante-dix appels modèle pour un quart d'euro, et un CI ne doit pas pouvoir dépenser de sa propre initiative. Le travail sauté est affiché comme sauté, pas comme réussi, et le job gratuit rappelle sur chaque demande qu'aucun modèle n'a été appelé." },
        ],
      },
      { kind: "h2", text: "7. L'indice de confiance, trois objets qu'on confond" },
      {
        kind: "defs",
        items: [
          { term: "Auto-déclarée", def: "Le modèle qui écrit une confiance de 0,85. C'est un token généré, pas une mesure : il produit le chiffre plausible dans le contexte, comme le reste de la phrase." },
          { term: "Par corroboration", def: "Combien de sources indépendantes, quelle fraîcheur, quelle cohérence. Fiable parce que comptée, pas devinée." },
          { term: "Calibration", def: "Quand le système annonce 80 %, est-ce vrai 80 % du temps ? Le seul sens strict. Exige des données de résultat, donc le bras C." },
        ],
      },
      {
        kind: "quote",
        text: "Un chiffre faux dans un produit de sécurité est pire que pas de chiffre, parce que le code en aval et les humains le croiront. L'absence est honnête ; 0,7 est un mensonge avec une décimale.",
      },
      {
        kind: "deployed",
        items: [
          { project: "Lore", to: "/lore", text: ": Ce n'est pas une figure de style. Il y avait une confiance de 0,7 en dur dans la branche de repli de la capture. Le défaut n'était pas la constante mais sa direction : cette branche s'exécute quand l'extraction a échoué, donc quand la confiance est au plus bas, et 0,7 est au-dessus du neutre. Retiré." },
        ],
      },
      { kind: "h2", text: "8. Humain dans la boucle : par conception ou par défaut" },
      {
        kind: "table",
        caption: "Humain dans la boucle, par conception contre par défaut",
        head: ["", "Par conception", "Par défaut"],
        rows: [
          ["Statut", "Un nœud de décision : entrées définies, décision définie, sortie enregistrée", "Personne n'a automatisé l'étape, donc quelqu'un doit s'en souvenir"],
          ["Trace", "L'approbation devient une donnée, chaque rejet un cas d'éval", "Aucune trace, aucun apprentissage"],
          ["Sous charge", "Tient", "Casse"],
        ],
      },
      {
        kind: "quote",
        text: "Garder un humain ne détruit pas la valeur. Laisser l'humain comme seul mécanisme, sans capturer sa décision, la détruit. Le correctif n'est pas de le retirer, c'est de transformer son jugement en artefact.",
      },
      {
        kind: "p",
        text: "Fermer la boucle de mesure, bloquer un merge, alerter sur une dérive, réinjecter les échecs dans le jeu de cas, est une décision purement architecturale. Fermer la boucle d'autorité, laisser le système agir sans humain, est une décision métier et réglementaire. En aéronautique elle est interdite : le technicien reste l'agent certificateur.",
      },
      { kind: "h2", text: "9. Signaux, ontologie, priors" },
      {
        kind: "defs",
        items: [
          { term: "Signaux", def: "Des émissions typées à chaque étage : raison de refus, score de récupération, événement d'abstention, latence. Sans signaux, le bras B est structurellement impossible. On ne surveille pas ce qui ne parle pas." },
          { term: "Ontologie", def: "Le vocabulaire partagé qui rend « la même situation » calculable. Sans elle, la distinction entre deux appareils n'est que des mots dans un prompt." },
          { term: "Priors", def: "Ce que le système croit avant de voir la preuve. « Je l'ai vu quatre fois en huit ans » est un prior. En prose c'est une anecdote, en poids c'est un prior." },
          { term: "Similarité", def: "Récupération plus ontologie. C'est le Layer 4 de la pyramide, et c'est le plus souvent non évalué." },
        ],
      },
      {
        kind: "deployed",
        items: [
          { project: "Lore", to: "/lore", text: ": La démonstration en creux. Interrogé sur un appareil sans historique, le modèle a répondu avec le dossier d'un autre. La séparation par immatriculation était un principe écrit dans la doc, et rien dans le code ne la rendait dure." },
          { project: "Aetherix", to: "/aetherix", text: ": L'inverse, fait exprès. L'identifiant client est résolu côté serveur à chaque couche et n'est jamais une entrée d'outil. Ce que le modèle ne peut pas nommer, il ne peut pas le franchir." },
        ],
      },
      { kind: "h2", text: "10. Le cas Lore, ce qu'un harnais trouve qu'aucun test unitaire ne voit" },
      {
        kind: "p",
        text: "Premier run live, 53 cas, 17 échecs. Trois défauts que la couverture de code n'aurait jamais révélés, parce que le code fonctionnait parfaitement.",
      },
      {
        kind: "list",
        items: [
          "Hallucination après un refus honnête. Le modèle dit que la procédure ne couvre pas le nombre d'aubes, puis en donne un. Mieux reconnaître le refus aurait fait passer la réponse.",
          "Fuite entre appareils. Interrogé sur un appareil sans historique, il répond avec l'historique d'un autre.",
          "Consensus fabriqué. À partir d'une seule note : « les autres techniciens familiers de cet appareil sont probablement d'accord ». Inventer l'accord fabrique l'autorité sur laquelle le lecteur pèse le conseil.",
        ],
      },
      { kind: "h3", text: "La leçon la moins confortable" },
      {
        kind: "p",
        text: "Sur ces 17 échecs, la répartition était presque également partagée entre de vrais défauts du modèle et des graders simplement trop stricts. Un grader qui crie au loup coûte de la sécurité : au troisième faux positif on arrête de lire le rapport, et c'est ce jour-là que le vrai défaut passe.",
      },
      {
        kind: "quote",
        text: "Une suite de régressions prouve que les graders rejettent du mauvais. Elle ne prouve jamais qu'ils acceptent du bon formulé autrement que par leur auteur. Il faut un run réel pour ça.",
      },
      { kind: "h3", text: "Et la partie que je préfère" },
      {
        kind: "p",
        text: "Onze cas plus durs ont été ajoutés : bornes de bandes, second expert qui contredit le premier, pression sociale du junior seul à deux heures du matin qui veut une autorisation. Les 64 cas sont passés du premier coup en live. C'était l'issue la moins informative possible, alors les réponses ont été lues au lieu d'être crues.",
      },
      {
        kind: "p",
        text: "La lecture a trouvé trois cas gradés trop faiblement pour échouer, dont un vrai défaut que le harnais avait laissé passer : à une consommation d'huile de 0,30 qt/h exactement, la réponse annonçait « NORMAL, aucune action requise ». C'est ELEVATED, la borne basse de la bande étant inclusive. Le motif requis acceptait la réponse parce que le mot « NORMAL » y figurait.",
      },
      {
        kind: "p",
        text: "Les trois cas échouent maintenant, ce qui est le but. Et la baseline n'a délibérément pas été re-gelée : le protocole dit de geler après trois runs stables, jamais pour faire passer un run rouge au vert.",
      },
      {
        kind: "quote",
        text: "Un jeu de cas qui passe intégralement a cessé d'être un instrument de découverte pour devenir un filet de sécurité. Les deux sont utiles ; ce ne sont pas le même objet.",
      },
      { kind: "h2", text: "11. Réponses courtes, prêtes à dire" },
      {
        kind: "lines",
        items: [
          { q: "« C'est quoi un grader ? »", a: "Une ligne de grille d'évaluation : un critère, oui/non, plus la raison. Déterministe, parce qu'un juge LLM échoue comme ce qu'il juge." },
          { q: "« Harnais ou protocole ? »", a: "Le protocole dit ce que « réussi » veut dire. Le harnais est la machine qui l'applique. L'un sans l'autre ne décide rien." },
          { q: "« Pourquoi pas juste des tests ? »", a: "Parce que le mode de défaillance est une réponse parfaitement formée qui donne le mauvais seuil. Le code marchait dans les quatre cas que j'ai trouvés." },
          { q: "« Boucle fermée, chez vous ? »", a: "Sur la mesure oui, sur l'autorité non, et c'est un choix réglementaire, pas technique. Le technicien reste l'agent certificateur." },
          { q: "« Comment évitez-vous les hallucinations ? »", a: "On ne les évite pas, on les rend visibles et bloquantes. Palier de sécurité à 100 %, aucun budget, et le refus codé comme un contrat plutôt qu'une consigne de style." },
          { q: "« Votre indice de confiance ? »", a: "Trois choses différentes : auto-déclarée sans valeur, par corroboration comptée donc utile, calibrée qui exige des données de résultat." },
        ],
      },
      { kind: "h2", text: "Note de fin" },
      {
        kind: "p",
        text: "Cadres repris de la décision d'architecture « Evaluation by design » et du plan de fiabilité d'Aetherix. La formulation « eval as a contract » vient de l'ingénierie de Qonto. Chiffres et exemples issus du harnais de Lore : 64 cas en 12 catégories, 9 graders, 21 réponses de référence, 17 régressions, 61 tests.",
      },
      { kind: "p", text: "Ce texte a des trous, et ils sont dans le tableau de la section 3." },
    ],
  },
];


// TODO: replace with real reading list
export const READING_LIST: ReadingItem[] = [];
