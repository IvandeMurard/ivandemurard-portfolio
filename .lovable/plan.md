# Corrections ciblées Anima, Aetherix, Tacet et corpus LLM

## Portée
Corriger uniquement les formulations listées, synchroniser les miroirs Markdown, puis régénérer le corpus et les pages pré-rendues.

## Modifications

1. **Anima**
   - Ajouter dans `public/anima.md`, sous la Fig. 4.1, la mention exacte : « Illustrative values, nothing here is measured. »
   - Ne pas modifier la figure HTML, où cette mention est déjà présente.

2. **Aetherix**
   - Dans « What it already does », remettre la phrase factuelle demandée sur l’override du manager.
   - Sortir la règle de rôle de cette liste et l’afficher séparément comme cible : « Target (Design): overrides recorded with the responder's role and reason, not a named person. »
   - Renommer « The loop that learns » en « The loop that records outcomes ».
   - Remplacer la métaphore du grain par : « adds one more record: recommendation, manager reply, measured outcome ».
   - Simplifier la thèse en « federated priors: Research ».
   - Retirer toute formulation de « predictive twin » dans l’échange Tacet → Aetherix.
   - Aligner `public/aetherix.md` mot pour mot sur ces changements.

3. **Tacet**
   - Remplacer « orchestration agent like Aetherix » par « The orchestrator (Design) » dans la page et le miroir.
   - Qualifier chaque mention visible de Hive Mind avec « Research: no network to aggregate yet », y compris le pilier, le schéma, le glossaire, les métadonnées et les résumés publics concernés.
   - Dans la section Tacet et Aetherix, retirer la formulation de « predictive twin » et ajouter l’exception directe exacte : « Until the orchestrator is built (Design), this exchange is direct: the one documented exception, non-personal, read-only, logged. »
   - Aligner `public/tacet.md` sur la page.

4. **Source des résumés de `llms-full.txt`**
   - Corriger `scripts/llms-full-preamble.txt`, confirmé comme source des résumés non issus des pages.
   - Remplacer « a real operating layer for boutique hotels » par « built, running on staging, pilot about to start ».
   - Aligner le résumé Aetherix sur les nouveaux textes d’override, de boucle et de fédération.
   - Aligner le résumé d’architecture : statut Tacet « Built · maintenance mode since July 2026 », statut Orchestrator « Design · proto-stub », cible via l’Orchestrator et échange direct jusqu’à sa construction.
   - Retirer « predictive twin » du résumé Tacet et y qualifier Hive Mind comme Research.
   - Mettre à jour `public/llms.txt` uniquement là où les mêmes formulations listées apparaissent.

## Régénération et contrôle

- Régénérer `public/llms-full.txt` depuis son générateur.
- Relancer la génération des pages pré-rendues puisque le contenu visible change.
- Vérifier que les pages et leurs miroirs racontent la même chose.
- Contrôler l’absence dans `public/llms-full.txt` de : « predictive twin », « Phase 3 stub », « grain of calibrated », « real operating layer », « orchestration agent like Aetherix », « loop that learns ».
- Contrôler dans toutes les sources visibles que chaque « Hive Mind » est immédiatement qualifié Research.
- Contrôler que la règle sur le rôle du répondant n’apparaît que sous la forme « Target (Design) ».
- Vérifier le résultat rendu sur `/anima`, `/aetherix` et `/tacet`, sans autre changement visuel ou fonctionnel.
