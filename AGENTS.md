# Project rules

- Compass uses the existing case-study reading furniture and semantic tokens; its approved narrative is centralized in `src/content/compass.ts` so the page and Markdown mirror stay aligned.
- Register new case studies in the route, SEO/Markdown, listing and MCP sources, then regenerate derived corpus and pre-rendered bodies; this keeps human and agent readers on the same content.
- The MCP function and manifest are plugin-generated from `src/lib/mcp`; edit their source tools rather than taking ownership of generated bundles.