# ivandemurard.com

Portfolio of Ivan de Murard. Human pages, Markdown mirrors, llms files and a public read-only MCP server, all from the same sources (see `AGENTS.md`).

## Commands

- `npm run dev` : local dev server.
- `npm run build` : build, then generate SEO snapshots, `.md` routes and pre-rendered bodies. The prebuild step regenerates `/agents.md`, the journal mirrors, the sitemap and `llms-full.txt`.
- `npm run check:machine -- <url>` : checks that a deployed site still serves its content to machines (Markdown mirrors, content negotiation, canonical, pre-rendered HTML, llms.txt, sitemap).
- `npm run preflight` : run before every publish. Builds the site, then runs the machine-readability checks against the preview URL. Override the target with `PREFLIGHT_URL=https://… npm run preflight`. Query-string variants are a known static-hosting limit and are reported as warnings, not advertised anywhere.

## Agent entry point

`/agents` (and `/agents.md`) documents the MCP endpoint, its tools, the files and the guarantees.
