## Diagnostic

### Ce que dit la Search Console (et comment l'interpréter)

Tu as inspecté `https://www.ivandemurard.com/`. Test live:

- `www` → **HTTP 302** redirige vers `https://ivandemurard.com/` (apex)
- apex → **HTTP 200** OK
- canonique déclarée = apex
- canonique choisie par Google = apex (= identique)

Donc le message "Page non indexée: Page avec redirection" sur `www` est **normal et attendu**. Google ne doit pas indexer la version `www` puisqu'elle redirige vers l'apex (qui, lui, est la version à indexer). Ce n'est pas un bug.

Deux petits points à régler côté GSC, sans code:

1. Inspecter directement `https://ivandemurard.com/` (apex) pour voir le vrai statut d'indexation de la page canonique.
2. Soumettre le sitemap dans GSC: Sitemaps → ajouter `sitemap.xml`. Le fichier est bien servi (`https://ivandemurard.com/sitemap.xml` → 200).

### Le vrai bug d'indexation (caché)

En testant les routes en prod, je vois que **toutes les routes servent le même `<head>` que la racine**:

```
GET /journeys
<title>Ivan de Murard, Product Builder in Paris</title>   ← titre racine
<link rel="canonical" href="https://ivandemurard.com/" /> ← canonique racine
<meta property="og:url" content="https://ivandemurard.com/" />
```

Cause: le script postbuild `scripts/generate-seo-snapshots.ts` écrit bien `dist/journeys/index.html`, `dist/atrium/index.html`, etc., mais le SPA fallback de l'hébergement Lovable sert `dist/index.html` pour toute route sans extension, **sans regarder les sous-dossiers**. Les snapshots ne sont donc jamais servis aux crawlers.

Conséquence directe: pour Google, `/`, `/atrium`, `/journeys`, `/aetherix`, `/sonor`, `/tacet`, `/journal`, `/contact` ont **le même titre, la même description, et tous une canonique pointant vers `/`**. Résultat: Google ne garde que `/` à l'index et marque les autres comme "Page en double, Google a choisi une autre canonique" ou "Page avec redirection". Exactement le motif qu'on voit dans la console.

Le composant `Seo.tsx` existe (mutation du `<head>` côté client via `useEffect`) mais n'est utilisé que dans `NotFound.tsx`. Aucune autre page ne l'appelle.

### Synthèse GEO/SEO

Très propre par ailleurs: JSON-LD Person/Article/SoftwareApplication, `llms.txt` + `llms-full.txt`, `robots.txt` autorise GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, sitemap à jour, OG/Twitter en place. Une fois la canonique par route corrigée, le reste est solide.

## Plan

### 1. Brancher `<Seo>` sur chaque page (correctif principal)

Googlebot exécute le JS et lit le `<head>` après hydratation. Le composant `Seo` (`useEffect` + `upsertMeta`/`upsertLink`) écrase déjà titre, description, canonique, OG, Twitter et JSON-LD. On l'ajoute en haut de chaque page avec les mêmes valeurs que `scripts/seo-routes.ts` (source de vérité unique côté snapshots et sitemap).

Pages à équiper:
- `src/pages/Index.tsx` → home
- `src/pages/Atrium.tsx` → `/atrium`
- `src/pages/Journeys.tsx` → `/journeys`
- `src/pages/Atherix.tsx` → `/aetherix`
- `src/pages/Sonor.tsx` → `/sonor`
- `src/pages/Tacet.tsx` → `/tacet`
- `src/pages/Journal.tsx` → `/journal`
- `src/pages/JournalEntry.tsx` → `/journal/<slug>` (lit le slug depuis l'URL)
- `src/pages/Contact.tsx` → `/contact`

Refactor léger: exporter une map `path → SeoRoute` depuis `scripts/seo-routes.ts` (ou déplacer la liste vers `src/content/seoRoutes.ts` importable des deux côtés) pour éviter la duplication entre snapshots build-time et `Seo` runtime.

### 2. Nettoyer le `<head>` statique de `index.html`

- Retirer `<link rel="canonical">` de `index.html`. Sinon, sur la home, la canonique statique et celle de `Seo` cohabitent (le doc head-meta interne dit explicitement: "Remove `<link rel="canonical">` from `index.html`. Each route owns its own canonical via Helmet.").
- Garder les OG sitewide en fallback pour les crawlers sociaux non-JS (LinkedIn, Slack), comme aujourd'hui.
- Garder le titre + meta description par défaut (Google les remplace par ceux de `Seo` après JS).

### 3. Vérifications post-déploiement

- `curl https://ivandemurard.com/journeys` doit toujours servir le HTML racine (normal sans SSR), mais après publication, demander un nouveau test live dans GSC: Googlebot rend le JS et verra le bon `<title>` / canonical par page.
- Inspecter `https://ivandemurard.com/` (apex) dans GSC pour confirmer son indexation propre.
- Ajouter le sitemap dans GSC (action utilisateur, pas de code).

### 4. Optionnel, hors-périmètre code

- Ajouter aussi la propriété GSC `https://www.ivandemurard.com/` (Domain property couvrirait les deux d'un coup si tu préfères passer en "domain property" via vérification DNS).
- 302 vs 301 sur `www` → apex: dépend de l'infra Lovable, on ne peut pas le changer dans le code. Pas bloquant pour l'indexation tant que la canonique apex est explicite (ce que la fix #1 garantit).

## Détails techniques

- `Seo.tsx` est déjà idempotent: `upsertMeta`/`upsertLink` font un `querySelector` + `setAttribute`, donc safe à appeler à chaque navigation client.
- `SiteLayout.tsx` re-scrolle à 0 sur changement de route, donc l'ordre `<SiteLayout>` → page avec `<Seo>` au top n'a pas de race.
- `jsonLd` passé à `Seo` doit être stable (mémoïsé ou défini hors composant) sinon `useEffect` réécrit le `<script>` à chaque render. Les valeurs viennent de `seoRoutes.ts` (constantes), donc OK.
- `JournalEntry` lit le slug via `useParams`, construit titre/description/JSON-LD Article à partir de l'entrée `journal.ts` correspondante (réutilise la logique existante).

## Pas dans ce plan

- Pas de migration vers `react-helmet-async` (le `Seo` maison fait exactement le même job sans dépendance).
- Pas de SSR/prerender. La perte côté crawlers sociaux non-JS reste limitée car les OG par défaut de `index.html` restent valides.
- Pas de retrait du script `generate-seo-snapshots.ts`: il ne nuit pas et reste utile si un jour l'hébergement sert les sous-dossiers.
