# Anima, the guest node

A new case study page at `/anima`, in the attestation register (same reading contract as `/architecture`), built around one constraint: this is the node that is not allowed to simply accumulate.

## What gets built

**Page `src/pages/Anima.tsx`**, hero plus eight sections, each with a `SectionKey` (one line and its concrete case, no minutes) and a concrete example in the body:

1. The questions it exists to answer, opened as four questions a GM cannot answer today.
2. The lineage, from modelling buildings to modelling relationships. Kept at full length: the human-centered digital twin research (cited as a 141-employee adoption-intent study, not a deployed system), the asymmetry that a guest cannot meaningfully consent during a two-night stay, and the concierge whose recall left when they did, linked to `/lore`.
3. Four memory layers with different lifetimes, as a table (working, episodic, semantic, segment) with the decaf-at-11pm example.
4. Claims carry confidence and confidence decays, with the honesty rule linked to the confidence section of `/journal/harnesses-graders-closed-loops`.
5. Remembering is not neutral, grounded in Edmondo Grassi, *The Remains of the Stay*, Hotel Yearbook 2026 Technology Edition, and answered in the data model rather than in a values statement.
6. Scope-gated, and it never decides.
7. Where it stands, honestly: synthetic proof of concept, never run on a real guest, production gated behind a data-protection assessment, prototype shipped at an Anthropic hackathon in June 2026.
8. Where it sits in the mesh, short, linking to `/architecture` and `/aetherix`.

Hero: title, the two-line standfirst, and the badge `Synthetic proof of concept · production gated behind a data-protection assessment`.

**Reading furniture adopted**: `CaseAnchors` (marked "You are here"), contents panel, heading anchors, reading progress bar, `AskRose` with section-aware prompts, `ShareRow`. Not adopted: open licence, playable diagrams, self-contained sections. Ordinary copyright.

**Journeys preview image**: a generated abstract asset in the site's visual language, no faces and no guests, used for the hover preview in the `/journeys` grid.

## Wiring

- `src/App.tsx`: route `/anima`.
- `src/content/systems.ts`: Anima gains `to: "/anima"` in `MESH_ANCHORS` and joins the default `SYSTEM_ANCHORS` set, so every case study now shows five nodes. `/architecture` keeps its existing no-current-marker override.
- `src/content/site.ts`: an `anima` entry in `PROJECTS`; `/journeys` gains a fifth card.
- `scripts/seo-routes.ts`: `/anima` entry with title, description and `CreativeWork` JSON-LD; sitemap and SEO snapshots regenerated.
- Mirrors: `public/anima.md`, plus entries in `public/llms.txt` and `public/llms-full.txt`.
- MCP: `anima` added to `list_case_studies` and to the `get_case_study` slug enum, with both prose tool descriptions updated to enumerate five slugs.
- Rose: `anima` added to the mirror slug list in `supabase/functions/_shared/rose-context.ts`, plus one line in the base prompt making her authoritative on the guest node and its privacy posture; page-aware chips in `src/content/rosePrompts.ts`.

## Constraints respected

Existing semantic tokens only, no hard-coded colours, no changes to `index.css` or `tailwind.config.ts`. Tables keep `scope`, a `<caption>` and a focusable scroll wrapper. No em-dashes. Hospitality never named as a positioning word.

## Verification

Render `/anima` in a headless browser in both light and dusk moods, check the contents panel, anchors, progress bar and table focus wrapper against the real DOM, and report anything that could not be done rather than declaring success.
