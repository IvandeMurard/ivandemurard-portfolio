# Prompt Claude Code : branche `mcp/server-side-tracking`

Repo : `IvandeMurard/ivandemurard-portfolio`. Crée la branche `mcp/server-side-tracking` depuis `main`.

## Objectif

Rétablir le comptage des appels au serveur MCP, avec deux garanties :

- personne ne peut écrire dans le compteur depuis l'extérieur ;
- chaque chiffre publié dit ce qu'il compte et depuis quand.

## Contexte à lire d'abord

- `AGENTS.md`, règle « MCP call tracking is disabled… » (commit f57a448).
- `src/content/agents.ts`, `public/agents.md` et le roadmap item du même commit.
- `src/lib/mcp/` : les sources des outils. `supabase/functions/mcp/index.ts` est AUTO-GÉNÉRÉ par `@lovable.dev/mcp-js`, ne pas l'éditer à la main.
- L'ancien mécanisme de tracking et pourquoi il était faillible : écriture possible via la clé publique (anon). Retrouve-le dans l'historique Git (`git log -S` sur le nom de la table).
- Le modèle à suivre : `logEmptyRetry` et `logHistoryRejected` dans `supabase/functions/rose-chat/index.ts`. Ils écrivent avec `SUPABASE_SERVICE_ROLE_KEY`, sans contenu, en `waitUntil`, et ne bloquent jamais la réponse.

## À faire

1. **Table.** Crée `mcp_calls` par migration, avec ces colonnes : `id`, `created_at` (default now), `tool` (texte borné, liste blanche des 5 outils), `outline_only` (bool), `section` (bool, présence seulement, jamais le texte), `ok` (bool).
   - Rien d'autre : pas d'IP, pas d'user-agent brut, pas d'arguments.
   - RLS activée, aucune policy pour `anon` ni `authenticated`. Seul le service role écrit et lit.
   - L'ancienne table : révoque l'insert pour anon ; ne la supprime pas.
2. **Écriture.** Une ligne par appel d'outil, écrite côté serveur avec le service role.
   - Fire-and-forget (`waitUntil`). Une erreur d'écriture ne change jamais la réponse MCP.
   - Point d'insertion : dans le handler des outils sous `src/lib/mcp/`, ou via un hook de `@lovable.dev/mcp-js` s'il en existe un. Vérifie que le code survit à la régénération du bundle.
   - Si le comptage ne peut vivre que dans le fichier généré, arrête-toi et explique-moi les options.
3. **Anti-abus raisonnable.** Plafonne à N lignes par minute et par instance, par exemple 60. Au-delà, n'écris plus rien et ne fais pas échouer l'appel. Documente la limite.
4. **Date de début.** Stocke une constante `MCP_TRACKING_SINCE` (date ISO du déploiement) dans `src/content/agents.ts`.
5. **Copie.** Mets à jour `src/content/agents.ts` / `public/agents.md` :
   - « Application-level MCP call tracking resumed on <date>, server-side only. Each call records the tool used and the time, no content. Calls, not agents: one script can make many. Earlier counters are unverified and are not used. »
   - Garde la phrase sur les `.md` et `llms.txt` non comptés.
   - Ajoute la mention de `outline_only` et `section` dans la liste des outils, qui est obsolète aujourd'hui.
6. **AGENTS.md.** Remplace la règle « tracking is disabled » par : « MCP calls are counted server-side since <date>. Present them only with their start date and as calls, never as agents or users. Pre-<date> counters remain unusable. »
7. **Tests.**
   - Un test vérifie qu'un client anon ne peut ni insérer ni lire `mcp_calls`. Si ce n'est pas faisable en CI, une vérification SQL documentée.
   - Un test unitaire vérifie que l'échec d'écriture n'altère pas la réponse.
   - `npm test`, `check:journeys` et le test `mcpBundleFreshness` passent, ou tu expliques pourquoi celui-ci attend la régénération par Lovable.
8. **Pas d'affichage public du chiffre dans cette PR.** On affichera le compteur plus tard, une fois des données réelles accumulées.

## Contraintes

- Pas de tirets cadratins dans la copie. Noms canoniques. Aucun chiffre inventé.
- Ne lis ni n'imprime `.env`. Aucune clé dans les fichiers.
- Ne déploie rien. Ne publie rien. Ouvre la PR et donne-moi : la migration, le point d'insertion choisi, et les commandes PowerShell pour vérifier en local.
