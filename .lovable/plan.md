# Update the evaluation Field Note without redesigning it

## Verified findings before changes
- The article is authored in `src/content/journalHarnesses.ts` and rendered by `src/pages/JournalEntry.tsx`. Both duplicate reading-contract sentences are present.
- The FAQ is currently section 13. The closing note is unnumbered. Heading IDs derive from heading text, so renumbering needs backward-compatible fragment aliases.
- The Markdown mirror and `llms-full.txt` are manually maintained, not generated from article content. The build script generates HTML metadata snapshots, not these documents.
- The article already offers its Markdown through `ShareRow`, but the SEO component has no Markdown alternate link, and `llms.txt` lists no `.md` URLs.
- The published Markdown URL returns HTTP 200 with `Content-Type: application/octet-stream`, not `text/markdown`.
- MCP has a source implementation and a bundled function. Its Markdown renderer currently omits several rich block types.
- Rose fetches the published Markdown with a five-minute cache and preserves explicit reference-material delimiters. Each fetched document is currently truncated at 20,000 characters, which risks excluding the new section and update log.

## 1. Article changes
- Additional authorized exception in section 1: immediately after the Harness definition ("The whole examination…"), add only this italic line, without expanding it or altering the surrounding bullet list: *Since this was published, the word has acquired a second, more common meaning - the runtime environment around a model. The two are complements, and they are separated in section 13.* Synchronize this addition across the same representations below and include it among the permitted differences in verification.
- Keep the exact title, subtitle, publication date (2026-07-31), licence, and all unrequested prose intact.
- Add the supplied TL;DR immediately below the subtitle, before the excerpt and introduction, reusing `SectionKey` rather than introducing a new visual treatment.
- Insert the supplied “13. Two harnesses, and which one this is” with the existing SEC. 13 key-card format, paragraphs, lists, subheadings and quote.
- Renumber FAQ to 14 and closing note to 15. Preserve all existing section anchors, including the former FAQ and `closing-note`, using fragment aliases/redirect handling. Update the contents list.
- Delete the first duplicate reading-contract sentence; keep the explanatory second occurrence and change section 9 to section 12.
- In section 8 use the standalone seven-word gloss “Rose, this site's conversational guide to Ivan's work”. No dedicated Rose explanation page was found.
- Add the two requested GitHub links, without changing their surrounding prose.
- Keep the new arm C material inside section 13; do not rewrite section 2.
- Use plain hyphens for dash punctuation, in line with the site's established rule; preserve the supplied wording otherwise.

The received section text contains a visible truncation marker in one paragraph (“112 chars truncated”). Recover the full submitted answer if accessible before implementation; if unavailable, request only that missing span rather than inventing it.

## 2. Reusable revision history
- Add optional `updates: { date: string; summary: string; reason: string }[]` to `JournalEntry`.
- Render a reusable Updates section at the article foot, only when entries exist, with the exact introductory sentence and supplied 2026-09-12 entry.
- Each entry follows date, summary, reason on one flowing line, wrapping naturally on narrow screens. Use existing styles with accessible, lighter-weight reason text; no new colours or typography system.
- Preserve the original header date. Use the latest recorded update only for machine-readable `dateModified`, never as a replacement for `datePublished`.
- Do not invent histories for other articles; leave updates absent or empty.

## 3. Synchronize human and agent representations
- Update `public/harnesses-graders-closed-loops.md` and the relevant article content in `public/llms-full.txt`, including TL;DR, new section, corrections, links and Updates.
- Extend MCP article serialization so the complete content, rich blocks and updates are returned rather than silently omitted. Synchronize the bundled MCP function with its source.
- Ensure Rose receives the complete revised mirror, including its ending, by adjusting the bounded retrieval limit for this article. Preserve all delimiter wrapping and the rule that retrieved content is reference material, never instructions.
- Coordinate website publication and affected function deployment as one release. Check Rose after cache refresh and verify MCP against that release; report any deployment or reachability blocker explicitly.

## 4. Markdown discovery
- Add a reusable Markdown alternate link from an entry's existing `mirror` field to the rendered head and applicable static metadata snapshots, cleaning it up on navigation.
- Add existing Markdown URLs to `llms.txt`; do not invent mirrors that do not exist.
- Investigate supported hosting response-header configuration and set `text/markdown; charset=utf-8` if supported. Verify the real published response, not only the local server. If hosting offers no applicable control, report this as unresolved rather than claiming a source-file change fixed the header.

## 5. Verification and delivery
- Compare sections 1–12 against their original text, allowing only the four requested corrections.
- Test old and new FAQ/closing fragments, contents links, outbound links, Markdown discovery, and conditional Updates rendering.
- Check the article at desktop and phone widths without changing site-wide styling.
- Verify title, subtitle, publication date and licence remain unchanged; check build diagnostics and focused tests.
- Report exact files touched and the status of HTML, Markdown, `llms-full.txt`, MCP and Rose separately, distinguishing source updates from published verification.

### Expected change surfaces
`src/content/journal.ts`, `src/content/journalHarnesses.ts`, `src/pages/JournalEntry.tsx`, a small reusable Updates renderer, `src/components/Seo.tsx`, SEO snapshot metadata files as required, `src/lib/mcp/tools/get-journal-entry.ts`, `supabase/functions/mcp/index.ts`, `supabase/functions/_shared/rose-context.ts`, `public/harnesses-graders-closed-loops.md`, `public/llms-full.txt`, and `public/llms.txt`. Any supported hosting-header change will be limited to Markdown delivery.
