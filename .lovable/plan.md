# Compass section 04: agent access made concrete

## Verified current state

- The section is sourced from `src/content/compass.ts`, rendered by `src/pages/Compass.tsx`, and mirrored by `scripts/generate-compass-mirror.ts` into `public/compass.md`.
- Its current title and anchor are `One core, two readers` and `one-core-two-readers`. The two sentences to remove and the repeated figure caption are still present in the source and Markdown mirror.
- The existing content model already renders a section-level status chip and an ordered block list. This lets the future side-by-side example be inserted between the tool table and closing sentence without restructuring the section now.
- The shared figure wrapper requires a caption, so the approved fallback `The same core serves both.` will be used.
- Rose lives in `supabase/functions/_shared/rose-context.ts`. The previous Compass pass did update it: Compass is included in its fetched reference slugs, `/compass.md` is declared authoritative, and inline rules classify Compass as a standalone data product. Its live reference content is fetched from the Markdown mirror.
- The portfolio MCP source lives in `src/lib/mcp/`, principally `index.ts` and `tools/get-case-study.ts`. `get_case_study` already serves `/compass.md`, so updating the canonical mirror updates the full returned case study.
- A fresh build cannot be run in plan mode. The current observability files contain no build, runtime, or console error entries, but I will only confirm a clean build after the implementation validation.

## Implementation

1. **Replace only section 04 in the canonical Compass content**
   - Rename it to `Built for people and AI agents` while retaining `id: "one-core-two-readers"`, so existing links continue to work without a redirect.
   - Add the bold opening line and the approved `Agent-ready · MCP server published · six tools · read-only` status chip.
   - Keep Fig. 4.1 in its current position and visual language, changing only its caption to `The same core serves both.`
   - Add the six-row `Tool` / `What it answers` table exactly as supplied.
   - Follow it with the approved parity sentence, then a small `Try it` label and the existing copyable command.
   - Remove the two superseded sentences.

2. **Extend the existing renderer minimally**
   - Add content metadata for a monospace first table column, used only by this tool table.
   - Let the existing command block carry the small `Try it` label.
   - Keep the block sequence flat and composable, leaving a clean insertion point after the table for the later `Same question, two readers` block. No placeholder or example output will be added.

3. **Synchronize machine-readable references**
   - Regenerate `public/compass.md` from the canonical content, including the new heading, chip text, figure caption, complete tool table, parity sentence, and `Try it` command label.
   - Update the Compass section-title references and summary wording in `public/llms.txt` and `scripts/llms-full-preamble.txt`, using `agent-ready` and never `AI-native` or `AI-powered`.
   - Update the portfolio MCP instructions/source where it summarizes Compass, while leaving `get_case_study` to continue serving the synchronized Markdown mirror.
   - Update Rose's inline Compass guidance with the new section title and agent-ready distinction; its fetched `/compass.md` reference will carry the full content.
   - Regenerate `public/llms-full.txt` from its sources.

4. **Validate without publishing**
   - Confirm `/compass` renders the new order on desktop and mobile, in both visual themes, with no awkward tool-name wrapping or overflow.
   - Check the old title, old caption, and two removed sentences no longer occur in Compass source, mirror, LLM corpus, MCP source, or Rose reference guidance.
   - Check `AI-native` and `AI-powered` are absent from all Compass references, and `agent-ready` is used consistently.
   - Run the normal build and refresh the local pre-rendered Compass page, then confirm the latest preview build reports no errors. Do not publish or deploy.

## Files to change

**Authored sources**
- `src/content/compass.ts`
- `src/pages/Compass.tsx`
- `scripts/generate-compass-mirror.ts`
- `public/llms.txt`
- `scripts/llms-full-preamble.txt`
- `src/lib/mcp/index.ts`
- `supabase/functions/_shared/rose-context.ts`

**Generated outputs**
- `public/compass.md`
- `public/llms-full.txt`
- `prerendered/compass.html`

`src/components/compass/CompassFigures.tsx`, `src/lib/mcp/tools/get-case-study.ts`, and `src/lib/mcp/tools/list-case-studies.ts` do not need edits based on the verified code: the figure already accepts the new caption, the detail tool reads the Markdown mirror, and the listing contains no obsolete section wording.

## Template fit

There is no substantive conflict with the existing template. The shared status chip already matches `Where AI sits`, the shared figure can use the required non-repetitive caption, and the current table and command patterns can be extended with two narrow presentation options: monospace tool names and a small command label. Section numbering, spacing, typography, figure numbering, TOC behavior, and every other Compass section remain unchanged.