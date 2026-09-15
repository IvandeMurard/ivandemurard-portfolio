# Build-time pre-render of the content routes

Fill the per-route HTML files the build already writes with the real rendered page, instead of an empty shell. No framework change, no runtime cost, no visual change for a normal visitor.

## What exists today

The build already writes a separate HTML file per route (13 of them) with the correct title, description, canonical, social tags and structured data. What those files lack is the body: a crawler that does not run JavaScript sees about 5 KB with an empty container and zero headings.

## What this adds

After the build, open each content route in a headless browser against the local preview, wait for the page to settle, and save the rendered HTML into that route's file. The head tags stay exactly as the current step writes them; only the body is filled.

Routes in scope: home, the six case studies, the architecture page, the two field notes, the journal index, the atrium and the contact page. Same list the site already uses for its route metadata.

## The "time or theme dependent" caveat, answered

No monitoring process is needed, and none is proposed. The phrase means something narrower: whatever the page happened to show at build time is frozen into the saved file. Three concrete cases here, and how each is handled.

1. Light or dark mode. The saved HTML must be captured in the same default the site serves before the user's preference is read, otherwise a first paint in the wrong theme flashes. Capture runs with the site default forced.
2. Animated reveals and counters. Sections fade in on scroll and figures count up. The capture runs with reduced motion on, so everything is already in its final, visible state rather than frozen mid-animation or at zero.
3. Anything derived from the current date. There is nothing date-derived on these pages today, but if one were added later, it would show the build date until the next build. Worth knowing, not worth watching.

Once a real visitor loads the page, the app takes over within a fraction of a second and everything is live again. The frozen copy only ever serves the first paint and non-JavaScript crawlers.

## Guardrails

- If the capture fails for a route, the build keeps the current empty-shell file for that route rather than writing something broken.
- The existing machine-readability check gains two assertions: each content page's HTML contains its own first heading, and its byte size is above a floor. That is the check that catches a silent regression to empty shells, and it runs on demand against any URL.
- No article text, layout, typography, navigation, colours or components change.

## Technical notes

- New postbuild step `scripts/prerender-routes.ts`, running after the existing snapshot and markdown-route steps, so it inherits their head tags.
- Serve `dist` on a local port, drive Playwright (already available) headless at a desktop viewport, `prefers-reduced-motion: reduce`, wait for network idle plus a settle delay, then read `document.documentElement.outerHTML` and write it back over `dist/<route>/index.html`.
- Strip the dev-only injected markup before writing; keep the module script tags so hydration still boots.
- Route list comes from `SEO_ROUTES` in `scripts/seo-routes.ts`, no second source of truth.
- Extend `scripts/check-machine-readability.sh` with the heading and size assertions per content route.
- Expect build time to grow by roughly a minute.

## Out of scope

Server-side rendering, the TanStack migration, `?format=md`, and custom content types on static files. All four remain as reported.
