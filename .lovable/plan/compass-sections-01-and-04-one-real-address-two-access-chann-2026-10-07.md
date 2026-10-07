# Compass sections 01 and 04: one real address, two access channels

## Verified current state

- Compass copy and block order are centralized in `src/content/compass.ts`, rendered by `src/pages/Compass.tsx`, mirrored by `scripts/generate-compass-mirror.ts` into `public/compass.md`, and then included in `public/llms-full.txt`.
- Sec. 01 still contains the florist, Rue d'Argout, goodwill-median, and illustrative horizontal timeline material. Its current anchor is `one-address-three-questions`.
- Sec. 04 already uses the title `Built for people and AI agents`, retains the anchor `one-core-two-readers`, has the approved status chip, diagram, six-tool table, parity sentence, and copyable command. It does not yet show the real `trace_premise` response excerpt, and `trace_premise` still says “What traded at this address”.
- The shared figure wrapper in `src/components/anima/AnimaFigure.tsx` supports an optional caption. The existing Sec. 04 diagram already uses the approved fallback `The same core serves both.`
- The existing tooltip is `src/components/ui/tooltip.tsx`. I will reuse its Radix `Tooltip`, `TooltipTrigger`, and `TooltipContent`, including the existing `animate-in`, fade, zoom, slide, and matching exit animation classes. `src/App.tsx` already provides `TooltipProvider`, so no tooltip component or animation will be added.
- Rose’s authored knowledge rules and reference loader live in `supabase/functions/_shared/rose-context.ts`. Its Compass reference is the fetched public mirror at `/compass.md`, listed as the `compass` reference slug. Earlier Compass passes did update both paths: the file declares the Compass block authoritative, describes Compass as standalone and agent-ready, and includes `compass` in the fetched references.
- The portfolio MCP source lives in `src/lib/mcp/`. `src/lib/mcp/index.ts` contains the Compass narrative guidance, while `src/lib/mcp/tools/get-case-study.ts` already returns `/compass.md`. The deployed bundle under `supabase/functions/mcp/` is generated and will not be edited or deployed.
- The requested forbidden-item audit found current matches in these places:
  - `A florist in 2017...`: `src/content/compass.ts`, `public/compass.md`, `public/llms-full.txt`, and `prerendered/compass.html`.
  - `Rue d'Argout turned over half its shops in three years...`, including the phrase `turned over`: the same four files.
  - `77%`, `56%`, `Les Halles`, `quartier du Mail`, and any `still trading` percentage: no current match in the Compass page source, mirror, LLM summaries/full corpus, portfolio MCP source, Rose knowledge, or Compass pre-render.
- A current clean preview build cannot be asserted from this turn: `/tmp/observability/build-errors.log`, `runtime-errors.log`, and `console-logs.log` are presently absent. The last completed Compass pass reported a clean build, but implementation validation will run the current build and check the newly produced preview signal before completion.

## Implementation

1. **Replace Sec. 01 with the supplied real-address narrative**
   - Rename it to `One address, read in context`, retaining `id: "one-address-three-questions"` so existing links keep working.
   - Use the supplied bold opening line verbatim, then add the three h3 subsections `The address`, `The surroundings`, and `Against another address` within the existing subsection pattern.
   - Remove the florist, Rue d'Argout, goodwill-median, and illustrative timeline content completely.
   - Store the nine timeline records, four confidence definitions, comparison values, notes, source caption, and surroundings wording in the canonical Compass content. No names or values beyond the brief will be introduced.

2. **Rebuild Fig. 1.1 as the vertical evidence timeline**
   - Replace the existing horizontal `CompassTimeline` internals with a theme-aware HTML/SVG vertical timeline using the existing figure frame, typography, semantic tokens, and `Fig. 1.1` numbering.
   - Render every row in the supplied order with its exact date, event, amount where supplied, and confidence badge.
   - Give the two withheld census rows a deliberately muted, dashed or hatched treatment, while preserving legibility in both themes.
   - Wrap every confidence badge with the existing shared tooltip primitives. The badge trigger will be keyboard-focusable and each tooltip will contain the corresponding verbatim server definition.
   - Keep the complete four-row confidence legend visible directly below the two explanatory lines, with a stable anchor for the Sec. 05 backlink.
   - After the legend, add the supplied paragraph explaining that six-year survival by trade is measured but withheld until the 2017 census licence is cleared. Do not expose a survival value, neighbourhood result, or derived rate.
   - Render the surroundings lead and note exactly as supplied, then the three-column comparison table and its exact closing explanation.
   - Directly below the comparison table, add the supplied emphasized road-noise interpretation before the six-axes explanation. Keep `Road noise exposure (modelled) | 51 | 100` unchanged and identify the 500 m major-road model as a model, not a measurement.
   - Never call the 20th-arrondissement comparison point `quiet` or `calm`.

3. **Make Sec. 04 concrete without letting it overtake Sec. 01**
   - Preserve `Built for people and AI agents`, `id: "one-core-two-readers"`, the opening line, status chip, and existing sources-to-core-to-map/MCP diagram.
   - Keep the figure caption as `The same core serves both.`
   - Update only the `trace_premise` answer to `What happened at this address, year by year`; keep the remaining five rows as supplied and tool names monospace.
   - Add the small label `What an agent receives`, then one read-only JSON code block containing the supplied response exactly, including French strings, punctuation, date, amount, confidence, and confidence reason.
   - Place the supplied caption beneath that code block, followed by the parity sentence and the existing `Try it` label plus copyable command.
   - Keep the section visibly and editorially shorter than Sec. 01. No additional example, interpretation, business name, or output will be added.

4. **Add the Sec. 05 cross-reference only**
   - Leave Sec. 05 copy and figure unchanged except for one short link back to the visible confidence legend in Sec. 01.
   - Use a direct in-page anchor so the link works for keyboard and pointer readers without duplicating the definitions.

5. **Synchronize human and agent-readable versions**
   - Extend the Compass block model and Markdown generator narrowly for the real timeline, legend, labelled JSON excerpt with caption, and internal legend link.
   - Regenerate `public/compass.md` with all supplied facts and hierarchy represented in text, including the withheld rows, confidence definitions, comparison table, JSON excerpt, and source captions.
   - Update the Sec. 01 title and relevant Compass summary references in `public/llms.txt`, `scripts/llms-full-preamble.txt`, `src/lib/mcp/index.ts`, and Rose’s inline Compass guidance. Keep `agent-ready`; reject `AI-native` and `AI-powered` everywhere Compass is summarized.
   - Regenerate `public/llms-full.txt`. The portfolio MCP detail tool and Rose will inherit the complete synchronized case study from `/compass.md`.
   - Refresh only the Compass pre-rendered page. Do not publish, deploy, or regenerate the plugin-owned MCP bundle.

6. **Enforce the page-wide 2017/2020 withholding rule**
   - Remove every current occurrence of the florist history, Rue d'Argout turnover claim, and their generated copies.
   - Ensure no figure, rate, comparison, or claim derived from the 2017 or 2020 census appears in `/compass`, `/compass.md`, the LLM corpus, portfolio MCP source, Rose’s inline knowledge, or Rose’s fetched Compass reference.
   - Explicitly check that `77%`, `56%`, `Les Halles`, `quartier du Mail`, any turnover percentage, and any still-trading percentage are absent.
   - Preserve only the allowed material: the 85,418-unit corpus size, 2023 census facts, BODACC sales/prices/insolvency notices, the 51/6/37/6 confidence split, and the explicit withheld statements supplied in this brief.

7. **Validate the exactness and interaction**
   - Check every date, amount, score, source, licence, French string, confidence label, and definition against the brief, with no rounding or added claims.
   - Search all synchronized Compass sources for the removed florist, Rue d'Argout, goodwill-median, illustrative caption, old Sec. 04 sentences, forbidden 2017/2020-derived items, `quiet`, `calm`, `this shop`, `this business`, `AI-native`, and `AI-powered` wording.
   - Verify `/compass` on desktop and mobile, in both themes and reduced-motion mode: vertical timeline alignment, withheld treatment, table/code overflow, visible touch legend, and Sec. 04 remaining clearly shorter than Sec. 01.
   - Verify every badge tooltip opens on hover and keyboard focus using the existing animation, closes correctly, and does not replace the visible legend.
   - Verify both preserved section anchors and the new Sec. 05 legend link, run the normal build and Compass pre-render, then confirm the latest preview build signal is clean. Do not publish or deploy.

## Files to change

**Authored sources**
- `src/content/compass.ts`
- `src/pages/Compass.tsx`
- `src/components/compass/CompassFigures.tsx`
- `scripts/generate-compass-mirror.ts`
- `public/llms.txt`
- `scripts/llms-full-preamble.txt`
- `src/lib/mcp/index.ts`
- `supabase/functions/_shared/rose-context.ts`

**Generated outputs**
- `public/compass.md`
- `public/llms-full.txt`
- `prerendered/compass.html`

`src/components/ui/tooltip.tsx`, `src/components/anima/AnimaFigure.tsx`, `src/components/compass/CompassCommand.tsx`, `src/lib/mcp/tools/get-case-study.ts`, `src/lib/mcp/tools/list-case-studies.ts`, and `supabase/functions/mcp/index.ts` do not need edits.

## Template fit and conflicts

- There is no conflict with the case-study template: it already supports nested h3 subsections, the Sec. 04 status chip, semantic tables, figure numbering, captions, heading anchors, and the existing copyable command.
- The current Compass block model assumes every code block is the shell command and the current timeline is hard-coded. Both need narrow extensions for a literal JSON response and structured timeline data, without changing the other sections or pages.
- The visible four-row legend is intentionally additional to the tooltips, which matches the brief and touch accessibility needs.
- The survival-by-trade paragraph is compatible with the page-wide withholding rule because it states the capability and the withholding reason without publishing any derived figure or rate.
- The instruction “nothing else on the page changes” is compatible with the explicit Sec. 05 backlink: Sec. 02, Sec. 03, the rest of Sec. 05, Sec. 06, the header, navigation, and footer remain unchanged.
- Keeping the old Sec. 01 and Sec. 04 IDs avoids redirects and preserves incoming links while displaying the new titles.