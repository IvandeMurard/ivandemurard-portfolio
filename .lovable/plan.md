# Recommendation line, signal vocabulary, and truth Field Note

Preview only, no publication or deployment. Work will be split into four approval checkpoints.

## Build message 1: signal vocabulary and shared figure

- Add `src/components/journal/SignalLamp.tsx`, `src/components/journal/RecommendationLine.tsx`, and `src/content/recoLine.ts`; add `--signal-go`, `--signal-warn`, and `--signal-stop` to `src/index.css` for both themes.
- Port the prototype’s data, flat strip, isometric train, controls, keyboard behavior, autoplay, ghost branches, readout, and reduced-motion behavior into React. Reuse existing semantic surface, outline, typography, figure, and button patterns. `SignalLamp` always includes the state word.
- One focused component test will verify state-to-lamp position and DARK behavior.
- Risk: the prototype’s wide SVG and five-station strip need responsive compression at 375 px without page overflow. The component will keep all facts in `recoLine.ts`, including the requested owner-verification comments for draft statuses used by FIG 1 and FIG 5.

## Build message 2: lighten the reference note

- Update `src/content/journalHarnesses.ts`, `src/content/journal.ts`, `src/pages/JournalEntry.tsx`; add only small reusable disclosure/table rendering support if required.
- Replace the section 2 figure, add lamps to the verdict rows, create section 8 definition disclosures, fold the specified section 13 passage, apply the two exact factual corrections, add the related link and sentence, prepend the update, and recalculate reading time from default-visible text.
- Reuse `RecommendationLine`, `SignalLamp`, `AskRose`, existing tables, and native disclosure behavior. The source retains every folded word for Markdown and MCP rendering.
- One targeted content/render test will check the exact corrections, disclosure boundaries, lamps, related link, and computed reading time.

## Build message 3: new Field Note

- Add `src/content/journalTruth.ts`; register it through `src/content/journal.ts` and any existing journal renderer types in `src/pages/JournalEntry.tsx`.
- Transcribe the attachment verbatim except the forbidden build notes and prototype links. Reuse `EntryOpening`, `SectionKey`, tables, `RecommendationLine`, `SignalLamp`, `AskRose`, FAQ, related links, licence, and updates furniture.
- One entry-level test will verify slug, section order, figure anchors/data, Rose prompts, empty updates, and omitted prototype material.
- Ambiguity: the current entry model and SEO require an ISO date, while the brief says leave it unset until publication. I will use an explicit draft-safe internal value/flag without displaying a false publication date, rather than inventing one.

## Build message 4: derived outputs and final alignment

- Update/regenerate `public/harnesses-graders-closed-loops.md`, the new Markdown mirror, `public/llms-full.txt`, `scripts/seo-routes.ts`, `public/sitemap.xml`, relevant `prerendered/journal__*.html`, and MCP source/rendering only where new block types require it. Generated function bundles remain untouched.
- Reuse the existing mirror, corpus, SEO, sitemap, MCP, and prerender pipelines.
- Run one final machine-readability/build verification covering both notes, anchors, tables, MCP output, no horizontal overflow contract, and unchanged existing numbers/prose. Report every changed file.
