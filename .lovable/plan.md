# Aetherix case study, eight-section evidence-led rewrite

## Verified current state

- `/aetherix` currently has 11 navigation entries, 12 visible dividers, a separate Anima block, and several blocks that this brief removes. The hero, SEO data, FAQ schema, and most page copy live in `src/pages/Atherix.tsx`.
- The preview currently responds successfully at `/aetherix`. The current preview diagnostics show no build or runtime error.
- The shared `Term` definition interaction lives in `src/components/Term.tsx`, with entries in `src/content/glossary.ts`. It opens on hover or keyboard focus after 120 ms and on tap. I will reuse it for `PMS` and `covers`, not create another tooltip.
- Closed technical notes can reuse the existing Radix primitive in `src/components/ui/collapsible.tsx`. I will give each trigger an accessible expanded state and keep it closed initially.
- Rose has two reference layers in `supabase/functions/_shared/rose-context.ts`: a hand-written Aetherix guardrail in `ROSE_BASE_PROMPT`, and runtime reference blocks fetched from the published `/aetherix.md` and other Markdown pages with a five-minute cache. The earlier Compass work updated both the relevant guardrail copy and its Markdown reference source. For this pass I will update the Aetherix guardrail and `public/aetherix.md`. Because deployment is excluded, the live Rose function and the published Markdown it fetches will remain unchanged until a later publish.

## 1. Page structure and hero

Rebuild `src/pages/Atherix.tsx` around the eight supplied sections, with `ATHERIX_SECTIONS` and dividers numbered `Sec. 01` through `Sec. 08`:

1. In one minute
2. The problem
3. Product strategy
4. How it works
5. What it does today
6. Where it stands
7. Under the hood
8. Talk about a pilot

Each section will use the supplied plain title for both its divider label and its `h2`, without a separate eyebrow or slogan. Each will begin with the supplied bold takeaway, followed by the specified table, short list, figure, or closed technical note. The hero will use the three supplied levels in order: identity, subhead plus links, compact metadata plus the existing `EntryActions` row.

Remove from the rendered page: hero badges, scroll prompt, Project Info grid, video placeholder, trust placeholders, forecast console, anticipation vernier and synthetic baseline, the separate Thesis and five-agent Vision sections, the Anima spotlight section, and the duplicate architecture button. Move the existing `CaseAnchors` block to immediately after Sec. 07.

## 2. Eight sections and reused components

- **Sec. 01 and Sec. 02:** render the supplied two-column summary table, problem takeaway, four existing pain bullets, and closing line. Apply `Term` to `F&B`, `covers`, and `PMS` where those terms first need definition.
- **Sec. 03:** render the five supplied decisions and three supplied unproven points. Add one focused, theme-aware HTML/SVG figure for the four relationships around Aetherix, using existing semantic tokens and case-study figure styling.
- **Sec. 04:** simplify `AetherixLoopCards` to the four supplied stages and remove all Day 7/Day 90 material. Update `AetherixDailyReceipt` to the exact mock receipt and caption, retaining its three reply controls.
- **Sec. 05:** retain the five existing “Already working” bullets verbatim and the existing sandbox label. Replace the promise cards with the supplied two-column outputs table and remove the target-design note.
- **Sec. 06:** add the supplied evidence table and a closed “The numbers” note. Update `AetherixPhaseTimeline` only for the supplied Phase 3 line. Place the supplied HiveMemory product vision and `Research, not built` chip directly below the roadmap. Remove the shared-learning pitch everywhere else on `/aetherix`, while leaving all other pages’ HiveMemory prose untouched.
- **Sec. 07:** retain `AetherixMeshDiagram`, the Anima link, the existing pipeline sentence, `AetherixArchitectureDiagram`, `AetherixStackChips`, the three existing trust cards, `AetherixWhatRemainsPrivate`, the Lore comparison, and the Field Note link in the exact requested hierarchy. Put pipeline/stack under “Pipeline and stack” and private/Lore/Field Note material under “More”, both closed by default.
- **Sec. 08:** use the supplied pilot copy and the three specified actions, with only “Book a call” primary.

No placeholder, empty frame, invented scenario, extra metric, or additional product claim will be introduced.

## 3. Files to change

### Page and reusable presentation

- `src/pages/Atherix.tsx`, replace the hero, local content arrays, section navigation, eight sections, SEO, JSON-LD, FAQ, and links.
- `src/content/glossary.ts`, add the exact `PMS` and `covers` definitions.
- `src/components/atherix/AetherixLoopCards.tsx`, replace the four loop cards and remove Day 7/Day 90.
- `src/components/atherix/AetherixDailyReceipt.tsx`, replace the receipt and caption content.
- `src/components/atherix/AetherixPhaseTimeline.tsx`, replace only the Phase 3 wording.
- `src/components/atherix/AetherixMeshDiagram.tsx`, align its Aetherix status while preserving the five-agent figure.
- Add one small Aetherix relationship-figure component for Sec. 03 and one small disclosure wrapper around the existing collapsible primitive if the page would otherwise duplicate trigger/accessibility markup.

### Components removed because they are Aetherix-only and the brief removes their only use

- `src/components/atherix/AetherixHeroBadges.tsx`
- `src/components/atherix/AetherixVideoPlaceholder.tsx`
- `src/components/atherix/AetherixTrustFrames.tsx`
- `src/components/atherix/AetherixForecastConsole.tsx`
- `src/components/atherix/AetherixAnticipationVernier.tsx`
- `src/components/atherix/AetherixMetricCards.tsx`, already unused but still carrying prohibited Aetherix claims
- `src/components/atherix/AetherixAnimaSpotlight.tsx`

### Quoted status and tagline sources outside the page

- `src/content/systems.ts`, replace both Aetherix definitions and statuses.
- `src/content/meshNodes.ts`, replace the Aetherix architecture status.
- `src/content/site.ts`, align the shared Aetherix project tagline consumed by listings.
- `src/pages/Journeys.tsx`, replace the Aetherix mesh status and case-card body only.
- `public/architecture.md`, replace only the two quoted Aetherix status/definition lines.
- `src/lib/mcp/tools/list-case-studies.ts`, replace the Aetherix tagline.
- `src/lib/mcp/tools/get-case-study.ts`, keep its Aetherix Markdown route aligned if its source metadata needs wording changes.
- `src/lib/mcp/index.ts`, replace the Aetherix server instruction/status wording.
- `.lovable/mcp/manifest.json` and `supabase/functions/mcp/index.ts` are generated from `src/lib/mcp`; they will be regenerated through the existing plugin, not edited directly.

### SEO, Markdown, LLM, and Rose sources

- `scripts/seo-routes.ts`, apply the supplied title, description, JSON-LD description, and modified date to generated head snapshots.
- `public/aetherix.md`, rewrite the mirror to the same eight-section narrative and supplied facts.
- `public/llms.txt`, replace only the Aetherix case-study entry.
- `scripts/llms-full-preamble.txt`, replace its Aetherix summary and Q&A references with the approved copy.
- `supabase/functions/_shared/rose-context.ts`, replace the hard-coded Aetherix guardrail and remove prohibited wording.

### Generated outputs to refresh, not hand-author

- `public/llms-full.txt`
- `prerendered/aetherix.html`, `prerendered/architecture.html`, and `prerendered/journeys.html`, plus any other pre-rendered page that includes the shared Aetherix anchor/status
- generated SEO snapshots and Markdown route copies in the build output

No Field Note prose or unrelated case-study prose will be rewritten. Historical plan files are not product content and will remain unchanged.

## 4. Current forbidden-phrase inventory

The audit found these occurrences in current Aetherix sources:

- `September`: `src/pages/Atherix.tsx`, `AetherixHeroBadges.tsx`, `AetherixPhaseTimeline.tsx`, `public/aetherix.md`, `scripts/llms-full-preamble.txt`, the generated full corpus, MCP bundle, and pre-render.
- `15.09`: `AetherixAnticipationVernier.tsx`, `public/aetherix.md`, the generated full corpus, and pre-render.
- `22% gate`: `AetherixAnticipationVernier.tsx` as its 22 threshold, `public/aetherix.md` as prose, the generated full corpus, and pre-render.
- `MAPE 2.5%` and `confidence 88%`: `AetherixDailyReceipt.tsx`, `public/aetherix.md`, the generated full corpus, and pre-render.
- `we win when you win` and `Results-as-a-Service`: `src/pages/Atherix.tsx`, `public/aetherix.md`, the generated full corpus, and pre-render.
- `0 real users`: `src/pages/Atherix.tsx`, `src/content/systems.ts`, `src/content/meshNodes.ts`, `AetherixMetricCards.tsx`, `public/aetherix.md`, `public/architecture.md`, Rose’s base prompt, the LLM sources/corpus, and shared pre-renders that quote the Aetherix status.
- `shadow mode`: the same status sources, plus `src/pages/Journeys.tsx`, `src/lib/mcp/index.ts`, the generated MCP bundle, and affected pre-renders.
- `coming soon`: `AetherixVideoPlaceholder.tsx` and the Aetherix pre-render. A generic unrelated portrait placeholder also uses the phrase and is outside scope.
- `Screenshot coming`: `AetherixTrustFrames.tsx` and the Aetherix pre-render.
- `−3% to −8%`: `AetherixMetricCards.tsx`, `public/aetherix.md`, the generated full corpus, and pre-render.
- `reduces food waste and operational costs`: the Aetherix card in the generated Journeys pre-render, sourced from the current listing copy.
- `moat`: the Aetherix FAQ in `src/pages/Atherix.tsx` and its generated pre-render/schema.
- `Tomorrow’s covers` currently leads the promise language in `src/pages/Atherix.tsx`, `public/aetherix.md`, the LLM preamble/corpus, `src/content/site.ts`, `src/lib/mcp/tools/list-case-studies.ts`, and the generated MCP/pre-render outputs. The words remain where the new brief explicitly requires them, but no longer as the first promise. Field Notes that independently discuss Aetherix are outside this removal rule and will not be rewritten.

After implementation, a scoped repository audit will verify that the prohibited claims no longer occur in the Aetherix page, its schema and SEO, quoted status/tagline sources, Markdown, MCP responses, Rose source, corpus, or relevant pre-renders.

## 5. Template fit and explicit constraints

- The existing case-study template supports numbered dividers, semantic tables, figures, chips, `EntryActions`, `CaseAnchors`, and the requested three-level hero. No new page template is needed.
- The divider and `h2` are two visible pieces of the existing furniture. Following the brief, both will carry the same single section title, while old eyebrow and slogan variants disappear.
- The current Compass hero places metadata before links, while this brief explicitly places links in level 2 and metadata in level 3. The Aetherix-specific order in the brief will take precedence.
- An exact three-line limit cannot be guaranteed at every viewport because lines reflow. The supplied prose will remain intact, use the existing readable widths, and avoid adding long paragraphs.
- The current page uses rounded cards more heavily than Compass. Reusing `AetherixLoopCards`, the receipt, diagrams, and trust cards preserves established Aetherix furniture; new material will use tables, lists, disclosures, and the one requested figure rather than adding decorative cards.
- “Built to be trusted” asks for three existing cards unchanged. Their content can remain unchanged while their former placeholder proof frames are removed.
- The live Rose answer cannot change without deployment because Rose runs as a deployed function and fetches the published Markdown. This pass will make its source and references ready and internally consistent, but will not deploy them.

## 6. Verification after approval

- Run the focused tests and the normal build pipeline, regenerate the LLM corpus, MCP bundle, SEO snapshots, Markdown route outputs, and pre-rendered bodies.
- Audit all supplied prohibited phrases across authored and generated Aetherix surfaces, while exempting unrelated Field Notes and historical plan files.
- Exercise `/aetherix` end to end in desktop and mobile widths, day and dusk modes. Check all eight navigation targets, closed disclosures, `PMS` and `covers` Term interactions by hover/focus/tap behavior, receipt controls, links, tables, SVG figure, and the moved `CaseAnchors` block.
- Confirm `/architecture` and `/journeys` show only the supplied Aetherix status/definition changes and no other prose changes.
- Do not publish or deploy. Finish with the requested file list, build status, verification result, and any item that remains blocked by the no-deploy constraint.
