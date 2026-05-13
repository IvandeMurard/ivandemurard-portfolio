# Fix Google Search Console redirect errors

## Diagnosis

Live HTTP checks confirm the root cause:

```text
https://www.ivandemurard.com/         -> 302 -> https://ivandemurard.com/
https://www.ivandemurard.com/aetherix -> 302 -> https://ivandemurard.com/aetherix
https://www.ivandemurard.com/sonor    -> 302 -> https://ivandemurard.com/sonor
https://ivandemurard.com/             -> 200 OK
```

The site is served from the **apex** `ivandemurard.com`, but every canonical, OG URL, sitemap entry, JSON-LD `url`, and `llms.txt` link points to **`www.ivandemurard.com`**, which 302-redirects to the apex. Google therefore reports:

- "Page avec redirection" for `/` (the canonical URL it was given is the one that redirects)
- "Erreur liée à des redirections" for `/aetherix`, `/journeys`, `/journal`, `/tacet`, `/sonor`
- "Détectée, actuellement non indexée" for the rest, because the sitemap advertises non-canonical (redirecting) URLs

A secondary issue: `sitemap.xml` lists three `.md` files (`/aetherix.md`, `/sonor.md`, `/tacet.md`). These are not HTML pages and don't belong in the sitemap; they pollute indexing and dilute crawl budget.

## Fix

Pick the apex as the single canonical host (matches the 200 responses) and align everything to it. Code-level only, no infra changes required.

### 1. Switch canonical host from `www.` to apex

Update every hardcoded `https://www.ivandemurard.com` to `https://ivandemurard.com` in:

- `src/components/Seo.tsx` — `SITE_URL` constant (drives canonical, og:url, twitter:url for every page)
- `index.html` — `<link rel="canonical">` and `<meta property="og:url">`
- `src/pages/Atherix.tsx` — JSON-LD `url`, creator `url`, `relatedLink`
- `src/pages/Sonor.tsx` — JSON-LD `url`, creator `url`
- `src/pages/Tacet.tsx` — JSON-LD `url`, creator `url`
- `src/pages/Journeys.tsx` — JSON-LD `url`, all `CreativeWork` URLs
- `src/pages/Contact.tsx` — JSON-LD `url`
- `src/pages/JournalEntry.tsx` — JSON-LD author `url` and entry `url`

### 2. Update sitemap and robots

- `public/sitemap.xml` — rewrite all `<loc>` to apex; remove the three `.md` entries (not HTML, shouldn't be in a sitemap)
- `public/robots.txt` — point `Sitemap:` to `https://ivandemurard.com/sitemap.xml`

### 3. Update LLM/markdown surfaces for consistency

- `public/llms.txt` — site URL and three case study URLs to apex
- `public/llms-full.txt` — all `ivandemurard.com` URLs to apex
- `public/aetherix.md`, `public/sonor.md`, `public/tacet.md` — the `URL:` and any internal cross-links to apex

### 4. After deploy, in Google Search Console

(User action, not code.) Set the apex as the preferred property if not already, and request re-indexing of the affected URLs. The 302 from `www` to apex is fine to keep; once Google's canonical signal is the apex, those redirect errors disappear. Upgrading the redirect from 302 to 301 in Cloudflare/hosting would be ideal long-term but is not required to clear the indexing errors.

## Out of scope

- No design changes, no route changes, no content changes
- No change to where the site is actually hosted
- No change to the cal.com, mailto, LinkedIn, or GitHub URLs (those legitimately use `www.linkedin.com` etc.)
