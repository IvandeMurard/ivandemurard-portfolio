# Project rules
- Rose lab participation uses the existing rose:open event without submitting a prompt; keep its desktop margin outside the centered dock footprint and enable sticky positioning only with sufficient viewport height, preserving visitor-led continuity.
- Rose design-lab historical comparisons use one local period state for compass, starters and explanation, so visual evidence cannot contradict the selected period; the lab stays outside public content generation.
- Rose product measurement stays in the existing private admin page, with server-authorized full-window aggregates and tab-local request lifecycle callbacks, so remounts never count restored conversations as new outcomes. Never join general click sessions to Rose sessions.

- Compass uses the existing case-study reading furniture and semantic tokens; its approved narrative is centralized in `src/content/compass.ts` so the page and Markdown mirror stay aligned.
- Compass subsections live in the shared content tree and retain their heading IDs; its TOC lists top-level sections only because the shared TOC has no nesting support.
- Register new case studies in the route, SEO/Markdown, listing and MCP sources, then regenerate derived corpus and pre-rendered bodies; this keeps human and agent readers on the same content.
- The MCP function and manifest are plugin-generated from `src/lib/mcp`; edit their source tools rather than taking ownership of generated bundles.
- Aetherix uses an eight-section evidence-led case-study structure; keep its human page, Markdown mirror, status references, MCP summary and Rose guardrail factually aligned.
- The CV content is centralized in `src/content/cv.ts`; keep the human page, downloadable Markdown, MCP profile and Rose reference factually aligned so experience claims have one maintained source.- /agents is a raw-document page outside SiteLayout; its copy lives in src/content/agents.ts and its Sonor excerpt plus /agents.md are generated in prebuild by scripts/generate-agents.ts, so the example always matches the real MCP output.
- Project statuses live in src/content/statuses.ts (asset-free), shared by site.ts and the MCP tools, so pages and agents quote the same status.
- The raw agents page owns its local palette and bypasses route view transitions; this isolates its appearance without mutating the persisted site mood.
- Article AI reading actions copy prompts with canonical public URLs, not provider prefill links or preview URLs, so external readers receive accessible sources.
- Rose loads Field Notes on demand (current article or one named in the question) via selectNotes in rose-context.ts, from published /journal/<slug>.md; keeps the prompt bounded and missing notes are flagged, not invented.
- Interactive diagram layers rendered as <button> must not contain glossary Terms or other interactive content; nested interactive markup breaks pre-rendered HTML parsing (guarded by src/test/prerenderDomIntegrity.test.ts).
- Rose renders answers with Streamdown via src/components/rose/roseMarkdown.tsx (safe links, no raw HTML) and runs one model step with UI-only tools; this prevents repeated answers and markup injection.
- When a Rose booking card exists, roseAnswer removes model-generated calendar destinations from its answer, so the card remains the single booking action even if prompt guidance is ignored.
- Rose generated prose, follow-ups and card reasons share roseAnswer text normalization; preserve code and destinations so punctuation cleanup cannot corrupt technical material.
- Rose's conversation is a module-level Chat singleton in src/components/rose/roseSession.ts, persisted to sessionStorage only (versioned, 60-min idle expiry, bounded); it survives route remounts without any server transcript store.
