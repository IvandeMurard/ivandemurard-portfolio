## Analyse réalisée

- Les URLs publiques testées répondent bien en `200`: `/`, `/atherix`, `/atrium`, `/contact`, `/journal/agent-boundaries-aetherix`, `/journeys`, `/sonor`, `/tacet`, `robots.txt`, `sitemap.xml`.
- `robots.txt` autorise Google et référence bien `https://ivandemurard.com/sitemap.xml`.
- Le sitemap est accessible, mais Search Console indique: 10 URLs soumises, 0 indexées via sitemap.
- Le HTML initial servi pour toutes les routes est identique: même `<title>`, même description, même `og:url`, surtout même canonical: `https://ivandemurard.com/`.
- Les métadonnées par page existent dans React via `Seo`, mais elles sont injectées après hydratation. Google découvre donc d’abord une SPA dont toutes les routes semblent canoniser vers la homepage.
- Le sitemap contient `/atherix`, alias historique de `/aetherix`, ce qui crée un signal de duplication inutile.
- Le site n’a pas de `noindex`, le problème n’est donc pas un blocage volontaire, mais un manque de signaux statiques fiables pour Google.

## Diagnostic principal

Google voit plusieurs URLs distinctes, mais leur HTML initial dit toutes: même page, même canonical racine. C’est probablement la cause majeure de “Détectée, actuellement non indexée”, et peut aussi contribuer au “Soft 404” ou à une indexation partielle.

## Plan d’application

1. **Créer une source SEO unique pour toutes les routes indexables**
   - Ajouter un registre central des pages publiques: chemin, titre, description, canonical, priorité sitemap, fréquence, type, JSON-LD léger.
   - Inclure seulement les URLs à indexer: `/`, `/atrium`, `/journeys`, `/aetherix`, `/sonor`, `/tacet`, `/journal`, `/journal/agent-boundaries-aetherix`, `/contact`.
   - Retirer `/atherix` du sitemap, le garder uniquement comme alias de compatibilité.

2. **Corriger les balises statiques servies à Google**
   - Supprimer le canonical global `https://ivandemurard.com/` de `index.html`, qui pollue toutes les routes.
   - Garder un fallback propre pour la homepage.
   - Générer, au build, des fichiers HTML statiques par route avec le bon `<title>`, `<meta name="description">`, `<link rel="canonical">`, `og:url`, `og:title`, `og:description`, `twitter:*`, et JSON-LD.
   - Résultat attendu: `curl https://ivandemurard.com/tacet` devra montrer directement le canonical `/tacet`, sans attendre le JavaScript.

3. **Automatiser sitemap et HTML SEO**
   - Ajouter un script de génération qui produit `public/sitemap.xml` depuis le registre SEO.
   - Ajouter un script post-build qui écrit les snapshots HTML par route dans `dist/`.
   - Brancher les scripts dans `package.json` avec `predev`, `prebuild` et `postbuild`, sans remplacer le mécanisme de routing existant.

4. **Traiter l’alias `/atherix`**
   - Retirer `/atherix` du sitemap.
   - Transformer la route React `/atherix` en redirection vers `/aetherix`.
   - Ne pas encourager Google à indexer cette variante.

5. **Renforcer la page 404 côté SEO**
   - Ajouter la capacité `robots: noindex, follow` au composant SEO.
   - L’appliquer à la page NotFound pour éviter qu’une URL invalide découverte par Google soit considérée comme une page indexable.

6. **Vérifier après application**
   - Vérifier localement que le sitemap ne liste plus `/atherix`.
   - Vérifier que chaque route a un canonical statique unique.
   - Vérifier que `robots.txt` reste ouvert.
   - Vérifier que la navigation React continue à fonctionner.

## Après publication

- Resoumettre `https://ivandemurard.com/sitemap.xml` dans Search Console.
- Demander une validation de correction pour “Détectée, actuellement non indexée” et “Soft 404”.
- Inspecter en priorité: `/tacet`, `/aetherix`, `/sonor`, `/atrium`, `/journeys`, `/contact`.
- L’indexation peut rester différée quelques jours même après correction, mais les signaux envoyés à Google seront cohérents.