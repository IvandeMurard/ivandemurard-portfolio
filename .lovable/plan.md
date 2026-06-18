
# Refonte /aetherix : contenu Livrable 1 + composants visuels

Mise à jour du contenu de la case study Aetherix (route `/aetherix`) avec la copie verbatim du Livrable 1 et 6 nouveaux composants visuels, en gardant 100% du design system (tokens, typo, cards, SectionDivider, rythme) déjà utilisé sur `/sonor` et `/tacet`.

## Contraintes design (non-négociables)

- Aucune nouvelle couleur, font, shadow. Réutilise: `bg-surface-container-*`, `border-outline-variant/*`, `text-primary`/`secondary`/`on-surface-variant`, `font-headline italic`, `font-label uppercase tracking-[0.2em]`.
- Même pattern que `/sonor` et `/tacet`: hero, bloc Project Info encadré, `<SectionDivider index label>` entre sections, `<Reveal>` sur entrées, spacing `mb-12 md:mb-16`.
- Pas d'em-dashes (règle mémoire). Conserver chaque caveat ("synthetic backtest", "target", "illustrative", "PoC").
- Animation `<Term>` sur les termes techniques (MCP, F&B, Agentic, MAPE, RLS, etc.).
- Mobile-first, dark/light auto via tokens.

## Nouveau plan de page

```text
Hero (titre + sous-titre + badges row)
Project Info (bloc existant, mis à jour)
SectionDivider 01 / Problem            → "Why it exists"
SectionDivider 02 / The Mesh           → diagramme nodes + tableau bounded contexts
SectionDivider 03 / What it does       → 3 promesses (covers, staffing, waste)
SectionDivider 04 / What you see       → Daily Receipt mockup + chips ✅ ✏️ ❌
SectionDivider 05 / How it works       → Pipeline push-first + stack chips
SectionDivider 06 / Built to be trusted→ 3 piliers (Eval contract, Observability, Multi-tenant security)
SectionDivider 07 / Performance        → 3 metric cards
SectionDivider 08 / Roadmap            → Phase timeline 0→5
SectionDivider 09 / Recent milestone   → Anima PoC
SectionDivider 10 / Role & model       → Solo builder + pricing + CTAs
```

## Composants à créer (réutilisent primitives existantes)

Tous sous `src/components/atherix/`, stylés via tokens DS, zéro nouvelle dépendance:

1. **`AetherixHeroBadges.tsx`** — rangée de pills `font-label uppercase tracking-[0.2em] text-[10px]` sur fond `bg-surface-container-low border border-outline-variant/30 rounded-full`. Contenu: Phase 3 · Pilot · Staging Live · MCP-Native · Claude Sonnet · Python 3.12 · FastAPI · Fly.io (Paris).

2. **`AetherixMeshDiagram.tsx`** — graphe horizontal (flex + bordures, pas de lib):
   - Gauche: 2 cards empilées (Tacet, Orchestrator) → flèche
   - Centre: card Aetherix **emphasized** (border `secondary/60`, fond `surface-container-high`, label "this node")
   - Droite: flèche → card Manager (WhatsApp, icône Material `chat`)
   - HiveMemory en side-input pointillé (border dashed) vers Aetherix
   
   Sous le diagramme, le tableau sémantique verbatim:
   
   | Node | Role | Status |
   |---|---|---|
   | 🍽️ Aetherix | F&B execution: forecast, staffing, memory, receipts | ✅ Live (staging) |
   | 🌦️ Tacet | Sensory: weather, noise, open data → risk | Phase 3 |
   | 🎛️ Orchestrator | Supervisory: MCP routing, business rules, stub P3, dedicated repo P4 | Phase 3 |
   | 🧡 Anima | Guest Cognition Layer | Shipped (Anthropic hackathon, Jun 2026) |
   
   Stylé via `<Table>` shadcn existant, bordures `outline-variant/30`, statut "Live" en pill `secondary`.

3. **`AetherixMetricCards.tsx`** — grille 3-up `grid-cols-1 md:grid-cols-3 gap-6`. Chaque carte `bg-surface-container-low border rounded-2xl p-6`: gros chiffre `font-headline italic text-4xl text-primary`, label, caveat en `text-xs text-on-surface-variant`.
   - "15.09% MAPE" — J+1 covers, synthetic backtest, 22% gate PASS
   - "−3% to −8%" — target labor cost variance, 90d live (target)
   - "14/14" — security gates passing

4. **`AetherixDailyReceipt.tsx`** — carte type chat-bubble (`bg-surface-container-high rounded-2xl p-6 md:p-8`), entête WhatsApp-like minimaliste (icône + "Aetherix · today 18:42"), corps en `font-mono text-sm` reprenant le bloc verbatim (Breakfast 84 covers · conf 88% (illustrative), driver, Last week MAPE 2.5%). Trois chips `✅ accept / ✏️ modify / ❌ reject` stylés en `Button variant="outline" size="sm"`.

5. **`AetherixPhaseTimeline.tsx`** — stepper horizontal scroll-x sur mobile, flex sur desktop. Chaque étape: numéro, label, icône d'état (✅ done / 🔨 current / 📋 planned via Material Icons `check_circle`, `construction`, `event`). Phase 3 highlight (border `secondary`, fond `surface-container-high`).
   - Phase 0 Validation ✅
   - Phase 1 Observability ✅
   - Phase 2 Receipts ✅
   - Phase 3 Pilot 🔨 (current)
   - Phase 4 Scale 📋 (Mews, POS, Federated HiveMemory, Context Graph, Anima)
   - Phase 5 Vision 📋 (Revenue Orchestrator)

6. **`AetherixStackChips.tsx`** — rangée wrap de chips secondaires: FastAPI · Python 3.12 · Prophet · pgvector (Mistral 1024d, HNSW) · Claude Sonnet (Gemini/GPT fallback) · Redis (Upstash) · Supabase (PostgreSQL, RLS, EU) · Fly.io (Paris).

`AetherixArchitectureDiagram` existant est réemployé tel quel dans "How it works" pour la pipeline push-first.

## Composants existants retirés du flow

`AetherixLayerStack`, `AetherixHiveStanzas`, `AnticipationCeiling`, `AetherixHorizonIllustration` ne sont plus utilisés dans le nouveau plan. Les fichiers restent en place (pas de `rm`).

## Copy verbatim à intégrer

Le texte Livrable 1 (Hero, Problem, What it does, Daily Receipt, How it works, Built to be trusted, Performance, Roadmap, Anima milestone, Role & model + CTA) est intégré tel quel section par section, sans aucune reformulation.

## SEO / GEO

- `<Seo>` (déjà en place): mise à jour
  - `title`: "Aetherix, F&B Execution Node of the Hospitality Agentic Mesh"
  - `description`: "Tells boutique hotel managers how many covers to expect, how to staff, how to cut food waste. MCP-native, delivered via WhatsApp. Phase 3 pilot."
- JSON-LD `CreativeWork`: `description` mise à jour, ajout `keywords` (Agentic AI, MCP, Apaleo, Hospitality, F&B forecasting, Prophet, pgvector), `dateModified: "2026-06-18"`.
- JSON-LD `FAQPage`: questions Livrable 1 (phase actuelle, pilote, sécurité multi-tenant, MCP, intégration Apaleo, MAPE backtest vs réel, Anima PoC).
- Mise à jour cohérente de `public/aetherix.md` et `public/llms-full.txt` (source of truth multi-fichiers, comme le commentaire en tête de `Atherix.tsx` l'exige).
- `public/sitemap.xml` `lastmod` mis à jour à 2026-06-18 pour `/aetherix`.

## Fichiers touchés

- `src/pages/Atherix.tsx` — refonte body, nouveau Seo, nouvelles constantes copy
- `src/components/atherix/AetherixHeroBadges.tsx` (nouveau)
- `src/components/atherix/AetherixMeshDiagram.tsx` (nouveau)
- `src/components/atherix/AetherixMetricCards.tsx` (nouveau)
- `src/components/atherix/AetherixDailyReceipt.tsx` (nouveau)
- `src/components/atherix/AetherixPhaseTimeline.tsx` (nouveau)
- `src/components/atherix/AetherixStackChips.tsx` (nouveau)
- `public/aetherix.md` — sync copy Livrable 1
- `public/llms-full.txt` — sync section Aetherix
- `public/sitemap.xml` — `lastmod`

## Vérification

- Build OK, route `/aetherix` rendue sans erreur.
- Playwright screenshots mobile (375px) + desktop (1280px) pour vérifier rythme et lisibilité.
- Console clean, pas de warning React.
- Vérif manuelle: aucun em-dash, tous les caveats présents, badges et chips cohérents avec le DS, dark/light mode lisible.
