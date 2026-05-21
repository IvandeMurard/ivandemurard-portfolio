# Mise à jour Case Study Aetherix — Hospitality Agentic Mesh

Repositionner Aetherix : non plus un framework standalone, mais le **F&B Execution Node** d'un Mesh d'agents (Aetherix, Tacet, Orchestrator, Anima) communiquant via MCP. Ton produit/business, pas technique.

## Fichiers modifiés

**1. `src/pages/Atherix.tsx`** (page principale)

- `PROJECT_INFO` : nouvelle URL repo (`aetherix-hospitality-ai`), statut mai 2026 ("MCP Server v0 shipped · Staging live on Fly.io Paris · design partner pilot starting"), remplacer ligne "Companion" par "Mesh" listant les 4 nœuds.
- Hero subtitle : "Aetherix is the F&B Execution Node of the Hospitality Agentic Mesh…"
- **Nouvelle section "Part of a Mesh"** insérée après le bloc Architecture (`AetherixLayerStack`) et avant `SectionDivider label="The Vision" index="02"`. Précédée d'un `SectionDivider label="The Mesh"`. Contient 4 cartes : Aetherix (Live), Tacet (Phase 3), Orchestrator (Phase 3), Anima (Phase 4, opacité réduite). Réindexer les `SectionDivider` suivants si nécessaire pour garder une numérotation cohérente.
- Section "Aetherix and Tacet" : titre devient "Aetherix ↔ Tacet", paragraphe reformulé avec scénario Orchestrator (roadworks 65dB → ajustement staffing breakfast). Cartes conservées.
- Section "Intelligent Anticipation" : retirer Qdrant et "495+ patterns", introduire pgvector + HiveMemory + fallback Gemini/GPT via `LLMProvider`.
- Carte "Proactive Messaging" : "MCP Server v0 is live — three atomic tools, multi-tenant…" remplace "outbound MCP server in progress". Caption : "Apaleo MCP · MCP Server v0 live · WhatsApp delivery · Fly.io Paris".
- Constante `FAQ` : 6 entrées (stage actuel, pas encore en prod, rôle humain, intégration, qu'est-ce que le Mesh, relation avec Tacet). Pas de claim MAPE.
- Lien GitHub "Explore the Platform" → `https://github.com/IvandeMurard/aetherix-hospitality-ai`.

**2. `src/components/atherix/AetherixArchitectureDiagram.tsx`**

- Retirer toute référence à Qdrant et "495+ patterns" (déjà présentes dans le composant actuel).
- Remplacer par pgvector (mémoire propre) + HiveMemory (patterns anonymisés de pairs).
- Bloc LLM : "Claude Sonnet (primary) · Gemini / GPT (fallback)" via `LLMProvider`.
- Mention "Fly.io · Paris" en caption (parallélisme avec le README).
- Statut "Outbound MCP server" : passer de "In progress" à "Live · v0".

**3. Fichiers miroirs (synchronisation factuelle, pas de JSX)**

- `public/atherix.md` : repo URL, statut, stack (retirer Qdrant, ajouter HiveMemory et fallback LLM), section Mesh, MCP Server v0 live.
- `public/llms-full.txt` : même mise à jour dans le paragraphe Aetherix (architecture, statut, positionnement Mesh).

**4. `scripts/seo-routes.ts`** (vérification)

- Confirmer que la description SEO `/aetherix` reflète le positionnement Mesh. Ajuster si elle parle encore de "agentic framework".

## Checklist de validation

- [ ] PROJECT_INFO : repo URL, statut Phase 3, ligne Mesh
- [ ] Hero mentionne "F&B Execution Node of the Mesh"
- [ ] Nouvelle section "Part of a Mesh" avec 4 cartes visible
- [ ] Section Tacet reframée avec scénario Orchestrator
- [ ] Qdrant et "495+" supprimés partout (page + diagramme)
- [ ] HiveMemory + fallback Gemini/GPT mentionnés
- [ ] "MCP Server v0 live" partout (caption, FAQ, diagramme)
- [ ] FAQ : 6 questions incluant Mesh
- [ ] Lien GitHub → `aetherix-hospitality-ai`
- [ ] `public/atherix.md` et `public/llms-full.txt` synchronisés
- [ ] Aucun claim MAPE
