# Machine-readable content: what is possible on this stack, and what is not

One measurement changes the shape of this work, so it comes first.

## The markdown you measured is not produced by this project

`Accept: text/markdown` is answered by the hosting layer, not by any code in this
repository. It converts the rendered page to markdown on the fly. Evidence: the
response for the journal article is 38,003 bytes and opens with the skip link, the
site navigation, the light-switch label and the footer links, with several link
URLs percent-mangled (`[Home](...)%20[Case%20Studies](/journeys)`). The same
endpoint works for `/aetherix` (17,766 bytes) even though nothing in the build
emits markdown for it.

Consequences:

- There is no existing code path to reuse. "Same bytes as the negotiated response"
  is not achievable from the project side, because the negotiated bytes are
  generated outside the project and include site chrome we do not control.
- This repo already has a second, better markdown surface: hand-authored mirrors
  in `public/` (`harnesses-graders-closed-loops.md`, `aetherix.md`, `anima.md`,
  `architecture.md`, `lore.md`, `sonor.md`, `tacet.md`) that are clean article
  text with no navigation. These are the right bytes to serve at a `.md` URL.
- Static files cannot carry a custom `Content-Type` here. The existing
  `/harnesses-graders-closed-loops.md` returns `application/octet-stream`, and the
  hosting layer does not expose header configuration. Any `.md` file we emit will
  do the same.

So the plan serves the curated mirror at the `.md` URL, and the test asserts what
this stack can actually guarantee.

## Fix 1 — `/journal/<slug>.md` and `/<case-study>.md`

Add `scripts/generate-markdown-routes.ts`, run in `postbuild` next to the existing
snapshot step. It copies each existing `public/*.md` mirror to its route-shaped
path in `dist`:

```text
public/harnesses-graders-closed-loops.md -> dist/journal/harnesses-graders-closed-loops.md
public/aetherix.md                       -> dist/aetherix.md   (already at that path)
public/anima.md, architecture.md, lore.md, sonor.md, tacet.md -> same
```

The mapping is derived from `scripts/seo-routes.ts`, so a route without a mirror
emits nothing and its `.md` URL stays a 404. No `.markdown`, no `.txt`, no
`/index.md`. Existing `public/*.md` paths keep working unchanged.

Limit to report up front: these will be served `application/octet-stream`, same as
today's mirrors. Content is correct, the header is not settable from here.

## Fix 2 — announce the variant in the head

`scripts/generate-seo-snapshots.ts` already emits the alternate link for one route,
hand-written. Generalise: for any route with a markdown mirror, emit

```html
<link rel="alternate" type="text/markdown" href="https://ivandemurard.com/journal/<slug>.md" />
```

built from the same route registry, plus `<link rel="canonical">` pointing at the
HTML URL of that route. The snapshot generator currently omits canonical on
purpose (an old SPA-fallback concern); with per-route snapshot files now written to
`dist/<path>/index.html`, each snapshot can carry its own correct canonical.
`src/components/Seo.tsx` keeps setting the same values at runtime, and gains the
markdown link for every page that has one.

## Fix 3 — `?format=md`

Not fixable on this stack, and I will not pretend otherwise. The site is static
files behind a CDN: query strings are not routable, so `/journal/x?format=md`
returns the same HTML document as `/journal/x`, with 200. Returning 406 requires a
server or an edge worker on this domain; neither is available here.

What the plan does instead: the test in fix 7 records this as a known failure
rather than a pass, so it is visible rather than forgotten. If you want it truly
fixed, that is the same infrastructure decision as fix 6 below.

## Fix 4 — `.md` URLs in `llms.txt`

Append ` (markdown: <url>)` to each entry that has a mirror, in the case-study and
field-note lists. Structure, titles, dates and summaries untouched. The existing
"Markdown representations" block at the bottom is updated to the new route-shaped
URLs.

## Fix 5 — `llms-full.txt`

Taking the preferred outcome: regenerate it from the same mirrors as fix 1,
concatenating full text per document with a `--- BEGIN/END DOCUMENT: <slug> ---`
delimiter and a heading per document. Expected size roughly 130-160 KB, exact
figure reported after the build. No rename, no redirect.

## Fix 6 — pre-rendering options, priced not built

Delivered as a written answer in chat, covering: static generation of the content
routes at build (extending the existing snapshot script to inject real body HTML),
an SSR migration to the TanStack Start template, a headless pre-render step, and a
crawler-only branch. For each: build impact, breakage risk, effort. With a
recommendation. No implementation in this pass.

## Fix 7 — the test

`scripts/check-machine-readability.sh <base-url>`, added as `npm run check:machine`,
run against one journal entry and one case study. Checks:

1. `.md` URL returns 200 and a non-HTML body starting with markdown
2. `Accept: text/markdown` on the HTML URL returns 200 `text/markdown`
3. The article body of 1 is contained in the body of 2 (the drift check, adapted:
   byte equality is impossible because 2 includes host-generated site chrome)
4. `?format=md` is markdown or non-2xx, otherwise reported as a known platform
   failure with a non-zero exit unless `ALLOW_KNOWN_FAILURES=1`
5. HTML contains `rel="alternate"` and `type="text/markdown"`, plus a canonical
6. `llms.txt` contains at least one `.md` URL
7. Every journal slug in `sitemap.xml` resolves to a 200 `.md`

Content-type assertions in checks 1 and 7 are relaxed to "not HTML" for the reason
stated above. This project has no deploy hook available to me, so it lands as an
npm script.

## Files touched

- new `scripts/generate-markdown-routes.ts`
- `scripts/generate-seo-snapshots.ts`, `scripts/seo-routes.ts`
- `src/components/Seo.tsx`
- `public/llms.txt`, `public/llms-full.txt`
- new `scripts/check-machine-readability.sh`, `package.json` scripts

No article text, layout, typography, navigation, `robots.txt` or sitemap entries
are modified.
