# Architecture note, reusable reading furniture, separator fix

## What I verified first

- `JournalToc` and `ReadingProgress` live in `src/components/journal/`; `HeadingAnchor` is a local, non-exported helper inside `src/pages/JournalEntry.tsx`. All three transfer as described.
- `CaseAnchors` + `src/content/systems.ts` exist with four entries and a "You are here" marker. Anima is absent, as you say.
- `SectionKey`, `AskRose`, `ShareRow`, and the Rose `rose:ask` event contract all exist and are reusable as is.
- Rose reads mirrors from `public/*.md` via a fixed slug list in `supabase/functions/_shared/rose-context.ts`. Adding `architecture` is a one-line change plus prompt text.
- `/journal/agent-boundaries-aetherix` exists, so the section 1 link resolves.

## One correction to point 3

The defect is real but not the one described. There is no `/` separator coloured with `outline-variant` at 60% anywhere in the codebase. The slash separators are in two places only:

- `src/components/SectionDivider.tsx`, coloured `text-on-surface-variant`, inside a wrapper that already carries `aria-hidden="true"` on the whole divider.
- `src/pages/Journeys.tsx` line 170, same colour, in a metadata line that is not aria-hidden.

So the screen-reader half of the complaint applies only to the `Journeys` occurrence, and the contrast figure of 1.32:1 does not match `on-surface-variant`, which is a body-text token. I will still do the right version of the fix: generate both separators in CSS via a `::before` on the label span so they leave the accessibility tree, keep them on a token that clears 3:1, and audit the whole tree for any `outline` / `outline-variant` token used as a text colour. I will measure the rendered result in both moods and report the actual figures rather than assert the ones in the brief. This needs a small utility class, which is the one exception I would ask for against the "nothing new in `index.css`" constraint; if you prefer, I use an inline `before:` Tailwind utility instead and touch no CSS file. Default: inline Tailwind utilities, no CSS file change.

## 1. Reusable reading furniture

New folder `src/components/reading/`:

- `ReadingProgress.tsx` moved unchanged.
- `JournalToc.tsx` moved, plus a new `useHeadingToc(containerRef)` hook that after mount collects `h2` elements in the container, assigns a slugified `id` where one is missing, and returns `{ id, text }[]`. Field Notes keep passing `items` explicitly.
- `HeadingAnchor.tsx` extracted from `JournalEntry.tsx` and exported.

`src/pages/JournalEntry.tsx` updates its imports only. No visible change on `/journal/*`; I will confirm the contents panel, anchors and progress bar render identically before moving on. Case studies are untouched in this change.

## 2. `/architecture`

- Route in `App.tsx`, page `src/pages/Architecture.tsx`, mirror `public/architecture.md`, entry in `SEO_ROUTES`.
- Not added to primary navigation. Linked from the top of `/journeys` and from `/aetherix`, `/tacet`, `/lore`.
- Content exactly as briefed: hero, adapted "Where this sits", then the eight sections, tables in section 3 and 5, existing mesh diagram under the section 3 table, the negative-search framing in section 6, the explicit Lore boundary paragraph in section 7, statuses and the meta-repository link in section 8.
- Section 2 carries an explicit "illustration, not a capability" note so nothing implies a check-in feature.
- Sections 4 and 5 each get a worked concrete case, since they currently argue in the abstract in the brief.

Reading contract applied: section key on every `h2` (one line + concrete case, no minutes), contents panel, anchors, progress bar, `AskRose` with section-aware prompts, `ShareRow` with copy link, email, markdown download and print. No open licence, no playable diagrams, no self-contained sections.

`CaseAnchors` gains two optional props rather than a parallel component: an `entries` override (to add Anima) and a `current` that may be omitted (no "You are here"). Anima is added to `src/content/systems.ts` as an entry with no page of its own, so it renders unlinked.

Rose: `architecture` added to her mirror slug list, plus a short "authoritative on the mesh, its nodes and their statuses" line in the base prompt, and `/architecture` prompts in `src/content/rosePrompts.ts`.

## 3. Cross-links

- Section 5 closing sentence links to `/journal/harnesses-graders-closed-loops`.
- The Field Note's three-arms section gains a link back to `/architecture`.
- The Field Note's closing section states the relationship once: it explains how a system earns the right to ship, `/architecture` explains what the systems are.
- Section 1's phrase "different failure modes" links to `/journal/agent-boundaries-aetherix`.

## Housekeeping

Mirror into `public/architecture.md`, add the page to `llms.txt` and `llms-full.txt`, regenerate the sitemap and SEO snapshots. Semantic tokens only. Tables keep `scope`, `<caption>`, and a focusable scroll wrapper. Verification with Playwright against the rendered DOM in day and dusk, including contrast measurement of the separators, with anything I could not achieve reported plainly.
