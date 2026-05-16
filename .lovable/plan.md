# Plan : Refonte éditoriale du case study Tacet (V3)

## Intention

Passer du récit "Synthetic Acoustic Twin" au récit V3 actuel : **Environmental Risk & Comfort Twin** exposé via **MCP**, avec quatre piliers d'architecture (Spatial Physics, Dual Memory, HITL, Conversational Explainability) et un volet ESG. Conserver la direction artistique : `SectionDivider` numéroté, rythme `mb-12 md:mb-16`, italiques `font-headline`, eyebrows `font-label`, pas d'em-dash, hospitalité ressentie et non nommée, agentic comme outil.

## Périmètre

Fichiers touchés :
- `src/pages/Tacet.tsx` (réécriture de contenu + 4 nouvelles sections + maj du Hero/Project Info/Pipeline)
- `src/components/tacet/TacetPipelineDiagram.tsx` (renommage des nœuds)
- `src/content/glossary.ts` (4 nouvelles entrées)
- `public/tacet.md` (synchronisation totale)
- `public/llms.txt`, `public/llms-full.txt` (pitch et résumé V3)
- `src/components/Seo.tsx` non touché, mais `<Seo>` de Tacet : title + description + JSON-LD mis à jour

## 1. Hero et Project Info

- **Sous-titre Hero** : remplacer « proactive headless intelligence layer that predicts the impact of the external acoustic environment » par une formulation V3 : *"A headless Environmental Twin that turns street, weather and crowd signals into yield rules your RMS can act on."* (Term sur `headless` + nouveau Term `environmentalTwin`).
- **Titre Hero** : conserver « Tacet: The Synthetic Acoustic Twin. » ou basculer vers « Tacet: The Environmental Twin. » Décision par défaut dans ce plan : garder le titre actuel, le sous-titre fait le travail de repositionnement. À confirmer à l'implémentation si besoin.
- **PROJECT_INFO** : 
  - Stack mis à jour : *"Python 3.12, FastAPI, Anthropic MCP SDK, OSMnx and Shapely ray-tracing, SQLAlchemy dual-memory store, Mews and Apaleo connectors."*
  - Contexte : *"Headless Environmental Twin for hospitality, exposed via MCP, complement to Aetherix."*
  - Durée : *"2026, ongoing (V3, MCP server and Dual Memory)"*

## 2. Section Problem

Reformulation autour du couple "physical + contextual blindness" du RMS/PMS, sans nommer "hospitalité de luxe" explicitement. Garder le centrage et le ton. Une seule phrase pivot type *"RMS and PMS run on history. The street, the sky and the crowd are not in the data."*

## 3. Section Solution (existante)

- Titre : « An Environmental Twin, exposed via MCP. »
- Pitch court : Tacet n'envoie plus uniquement des "JSON alerts", il publie des **règles de yield** et des **observations contextuelles** sur un serveur **MCP** que les agents (Aetherix, RMS) consomment.
- Cartes `HOW` réorganisées en 3 étapes V3 :
  1. **Sense** : ingestion proxy (permits, traffic, weather, events).
  2. **Reason** : ray-tracing 3D OSM + atténuation distance + Dual Memory.
  3. **Expose** : MCP server + JSON Chain of Thought, RMS/PMS via webhooks et OAuth2.
- Pull-quote workflow : remplacer par un exemple V3 plus parlant (heatwave + grève transport) avec mention du modificateur de prix HITL : *"Heatwave forecast plus rail strike on June 13. Tacet suggests -15% on street-facing suites and a staffing buffer for breakfast service. Awaiting Revenue Manager approval."*

## 4. Architecture : pipeline diagram

Mettre à jour `TacetPipelineDiagram.tsx` :
- Colonne 2 (engine) : remplacer "Synthetic Acoustic Model + OpenStreetMap 3D" par **"Ray-tracing Physics Engine"** et **"Dual Memory store"** (Idiosyncratic + Hive).
- Bloc de sortie : remplacer "Proactive JSON alerts" par **"MCP server: rules + Chain of Thought"**, sous-titre *"Consumed by RMS, PMS and orchestration agents"*.
- Caption finale : *"Proxy signals · Ray-traced physics · Dual memory · MCP rules"*.

## 5. NOUVELLES sections : les 4 piliers

Insérées après le pipeline, avant Synergy. Rythme `SectionDivider` numéroté (réindexer : Overview 01, Problem 02, Solution 03, Architecture 04, Pillars 05, Synergy 06, Horizon 07).

Layout : grille 2x2 sur md+ (un pilier = une carte `lift-card` sur `bg-surface-container-low`, icône, lettre A/B/C/D en eyebrow, titre italique, paragraphe). Une intro centrée au-dessus : *"Four pillars give Tacet its edge."*

- **A. Spatial Physics Engine** — icône `view_in_ar`. Ray-tracing 3D entre événement et hôtel, building shielding via polygones urbains, élimine les faux positifs.
- **B. Dual Memory** — icône `memory`. Idiosyncratic (apprentissage par hôtel, GPS-bound) + Hive Mind (calibrage statistique cross-réseau).
- **C. Human-in-the-Loop Guardrail** — icône `verified_user`. Jamais d'action autonome destructrice : Tacet propose une "Price Modifier Rule", l'humain valide. Term `humanInTheLoop`.
- **D. Conversational Explainability** — icône `forum`. Chain of Thought mathématique embarqué dans chaque payload MCP (Base Noise → Distance → Ray-tracing → Final Impact), pour que l'agent orchestrateur explique en langage naturel. Term à créer : `chainOfThought`.

## 6. NOUVELLE section ESG & Impact

Insérée entre Pillars et Synergy. Trois bullets visuels (chiffres muets, formulations qualitatives, pas de KPI inventé) :
- **Yield protection** : moins de refunds post-séjour sur chambres bruyantes.
- **Operational excellence** : F&B et staffing ajustés en amont d'un pic météo ou social.
- **Sustainability** : moins de gaspillage énergétique (HVAC proactif), bruit urbain mieux absorbé pour le bien-être client.

Layout : 3 colonnes avec eyebrow + chiffre/icône, ton mesuré, pas de "luxe" ni "hospitality" nommés.

## 7. Synergy, Horizon, FAQ, CTA

- **Synergy** : maj du paragraphe pour mentionner explicitement la connexion **MCP** entre Tacet et Aetherix (Tacet expose, Aetherix consomme via MCP).
- **Horizon** : reformuler vers la roadmap V3 : élargir le catalogue de signaux (mobilité, qualité air, événements culturels), agents orchestrateurs additionnels via MCP, et "Quiet Certification" devient un effet de bord plutôt que l'objectif central.
- **FAQ** : 4 questions au lieu de 3, ajouter :
  - *"Why MCP and not a custom REST contract?"* → standardise l'intégration agent, futur-proof.
  - Maj de *"How accurate is software-only?"* pour parler de ray-tracing et calibration.
- **CTA** : conserver le bloc pilote + lien GitHub. Pas de changement de copy.

## 8. Glossaire (`src/content/glossary.ts`)

Ajouter / mettre à jour :
- `environmentalTwin` : nouvelle entrée, modèle logiciel qui simule l'impact de l'environnement externe (acoustique, météo, mobilité) sur des chambres précises.
- `mcp` : déjà présent, vérifier la formulation et confirmer usage par Tacet.
- `chainOfThought` : nouvelle entrée, trace mathématique embarquée dans la réponse JSON pour que l'agent client explique le calcul en langage naturel.
- `dualMemory` : nouvelle entrée, mémoire idiosyncratique par hôtel + Hive Mind statistique cross-réseau.
- `rayTracing` : nouvelle entrée, technique géométrique 3D pour calculer ligne de vue et atténuation entre source sonore et façade.
- Mise à jour `syntheticAcousticTwin` pour préciser le ray-tracing.

Toutes les définitions : 20-45 mots, ton calme, business-first, anglais, pas d'em-dash.

## 9. SEO / GEO / Markdown

- **`<Seo>` de Tacet** :
  - title : *"Tacet, Environmental Twin for Hospitality"*
  - description : *"Headless MCP server that turns street, weather and crowd signals into yield rules and Chain of Thought payloads for RMS, PMS and orchestration agents."*
  - JSON-LD `SoftwareApplication.applicationSubCategory` : ajouter `"MCP server"`, `featureList` : ray-tracing, dual memory, HITL, MCP.
  - FAQPage maj automatiquement (basé sur `FAQ`).
- **`public/tacet.md`** : réécriture complète alignée sur CASE_STUDY_V3 (sections 1-6 mises à jour + nouvelle section "Architectural Pillars" + "Impact & ESG" + bloc "Technical Stack" exhaustif).
- **`public/llms.txt`** : reformuler le bullet Tacet (1 phrase) autour de "Environmental Twin via MCP server".
- **`public/llms-full.txt`** : maj du paragraphe Tacet (section `## Tacet`) avec les 4 piliers, MCP, ESG, et la liste "Tacet:" en bas de fichier.

## Technique

- Pas de nouveau composant React lourd (les piliers et l'ESG sont du markup réutilisant `lift-card`/`SectionDivider`/`Icon` existants).
- Le diagramme reste structurellement identique : seuls les labels et icônes changent (`memory`, `route` ou `polyline` pour ray-tracing).
- Réindexation des `SectionDivider index="..."` cohérente sur toute la page.
- Vérifier `TACET_SECTIONS` (navigation latérale `SiteLayout`) : ajouter `{ id: "pillars", label: "Pillars" }` et `{ id: "impact", label: "Impact" }` ; mettre à jour les `id` HTML correspondants.

## Hors scope

- Pas d'ajout de routes ni de pages.
- Pas de modification des assets (`acousticTwinImg` reste utilisé).
- Pas de changement de typographie ou de palette.
- Pas de mise à jour des autres pages (Aetherix, Sonor) même si Synergy les évoque.
