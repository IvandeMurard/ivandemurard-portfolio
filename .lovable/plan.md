## Refonte hero + structure /aetherix (V2 turnover + hybride)

Mise à jour de `src/pages/Atherix.tsx` et de quelques composants Aetherix pour intégrer l'angle "persistent operational cognition / turnover" en hero hybride, déplacer le Mesh dans How it works, remplacer Problem par la V2, et purger tous les em-dashes restants sur le site. Aucune nouvelle couleur, font, lib. DS inchangé.

## Décisions appliquées

1. Hero hybride: punchline turnover + cycle 4 lignes + triptyque final. Détails (exemples, cycle développé) déplacés dans une nouvelle section "How the memory compounds" juste après le hero.
2. "Hospitality" reste nommée frontalement sur cette page (exception assumée à la règle Core "hospitality is felt, never named", scoped /aetherix uniquement).
3. Honnêteté factuelle: on garde la copy proposée par l'utilisateur ET on ajoute une ligne de prudence courte aux endroits sensibles (peers anonymisés cold-start, ROI synthétique vs cible mesurée en pilote).
4. Mesh: retiré de la section 02. Déplacé à l'intérieur de "How it works", au-dessus du pipeline push-first. Badges techniques restent dans le Hero (composant `AetherixHeroBadges` inchangé).
5. Problem (01): remplacé entièrement par la V2 turnover ("greatest asset walks out the door"). L'ancien angle "bottleneck isn't data, it's synthesis" est conservé en une phrase de transition vers How it works, pas perdu.
6. Em-dashes: scan global du repo (src/ + public/*.md + public/llms-full.txt + public/sitemap.xml) et remplacement par virgules, deux-points ou parenthèses selon le contexte. Mémoire Core déjà en place, on rend le code conforme.

## Nouveau plan de page

```text
Hero
  Title:    Aetherix, Persistent Operational Cognition for Hospitality
  Sub:      Turning scattered local experience into durable organizational intelligence.
  Lede:     Most hotels lose critical knowledge every time a manager leaves.
            Aetherix builds persistent operational memory that survives turnover
            and grows stronger over time.
  Cycle 4 lignes (Memory, Prediction, Action, Learning), format chips ou liste compacte
  Triptyque final: Understands like a human. Measures like a machine. Remembers like an institution.
  AetherixHeroBadges (inchangé)

Project Info (inchangé)

01 Problem            → V2 turnover (greatest asset walks out the door + 4 bullets pains)
                        + 1 ligne pont: "Traditional systems store data. Aetherix builds living memory."

02 How the memory compounds  (NOUVEAU — détails déplacés du hero)
   - Cycle développé (Memory recall, Prediction calibrated, Action one-tap, Learning from reply)
   - Mini exemple narratif "day-7 vs day-90 receipt"
   - Caveat: HiveMemory = anonymized aggregates, cold-start across peer properties

03 What it does       → 3 promesses (covers, staffing, waste) — inchangé

04 What you see       → Daily Receipt mockup — inchangé

05 How it works       → AetherixMeshDiagram (déplacé ici, au-dessus du pipeline)
                        + AetherixArchitectureDiagram + AetherixStackChips

06 Built to be trusted → 3 piliers — inchangé

07 Performance        → 3 metric cards + ajout caveat "synthetic backtest, real-world starts Phase 3"

08 Roadmap            → Phase timeline 0 to 5 — inchangé

09 Recent milestone   → Anima PoC — inchangé

10 Role and model     → Solo builder + pricing + CTAs — inchangé
```

## Fichiers touchés

- `src/pages/Atherix.tsx`: nouveau Hero copy, nouvelle section 02 "How the memory compounds", Problem (01) remplacé par V2, Mesh déplacé dans How it works (05), Seo title/description mis à jour, JSON-LD `description` et `keywords` actualisés (turnover, operational memory, hospitality).
- `src/components/atherix/AetherixMeshDiagram.tsx`: aucun changement de markup, juste vérifier que la phrase de bas "Aetherix executes. It does not orchestrate." reste cohérente dans le nouveau contexte.
- `public/aetherix.md`: sync verbatim de la nouvelle copy (hero, problem V2, section memory compounds, caveats).
- `public/llms-full.txt`: section Aetherix resynchronisée.
- `public/sitemap.xml`: `lastmod` à la date du jour pour `/aetherix`.
- Em-dashes: balayage `rg "\u2014" src public` et remplacements ciblés (virgules, deux-points, parenthèses). Aucun reflow visuel, juste la ponctuation.

## SEO / GEO

- Title: "Aetherix, Persistent Operational Cognition for Hospitality"
- Description: "Hotels lose critical knowledge every time a manager leaves. Aetherix builds persistent operational memory that survives turnover, anticipates F&B demand, and delivers one-tap decisions on WhatsApp."
- JSON-LD `CreativeWork.description` aligné; `keywords` ajoute: operational memory, organizational intelligence, turnover, hospitality cognition.
- JSON-LD `FAQPage`: une question ajoutée "How does Aetherix handle manager turnover?" avec réponse honnête (memory layer survit, HiveMemory cold-start anonymisé, pas de magie, gains mesurés à partir du pilote).

## Honnêteté factuelle, formulations ajoutées

- Hero / Memory section: remplacer "thousands of similar situations" par "anonymized patterns from peer properties (cold-start, opt-in)".
- Performance: ligne déjà présente "synthetic backtest, real-world measurement begins Phase 3" conservée et rendue visible (caveat sous chaque metric card sensible).
- Roadmap / Phase 4 HiveMemory federated: marquer "planned, DPIA-gated" comme pour Anima.

## Vérification

- Build OK, route `/aetherix` rendue sans erreur.
- `rg "\u2014" src public` retourne 0 résultat.
- Playwright screenshots 375px + 1280px de `/aetherix` (hero, section 02, section 05 avec Mesh, Performance).
- Vérif console clean, dark/light mode lisibles, tous les caveats présents.
