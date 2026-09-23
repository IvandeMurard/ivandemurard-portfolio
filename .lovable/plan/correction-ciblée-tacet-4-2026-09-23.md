# Correction ciblée, Tacet §4

## Modification
- Dans `/tacet`, remplacer la phrase du point « Operational excellence » par : « When a heatwave overlaps with a transport strike, the orchestrator (Design) proposes F&B supply and staffing buffers before the day starts, for a manager to approve. »
- Appliquer la même formulation dans `public/tacet.md` afin que la page et son miroir restent alignés.
- Ne pas modifier le résumé Tacet du préambule de `llms-full.txt`, car il ne reprend pas la phrase concernée.

## Régénération et contrôle
- Régénérer `public/llms-full.txt` depuis ses sources.
- Régénérer les pages pré-rendues pour refléter la correction.
- Vérifier que « orchestration layer adjusts » n’apparaît plus dans les sources, le site pré-rendu ou `llms-full.txt`.
- Vérifier que la page compile correctement et que le point corrigé s’affiche sur `/tacet`.
