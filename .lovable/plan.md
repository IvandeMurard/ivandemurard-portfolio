# Five agents, one architecture: structure and honesty pass

Copy and structure only, on three pages plus the machine-readable mirrors. No redesign, no new page, no new component. The cinematic acts, scroll behaviour and reveal timing on `/journeys` stay exactly as they are.

## The problem

Three surfaces give three different counts: `/journeys` numbers five case studies 01 to 05 and says "how three of these fit together", `/architecture` says "four nodes" while naming Peritia in its own text, and the public repository says five agents. The repository is right: Aetherix, Anima, Tacet, Peritia, Orchestrator. Lore and Sonor are not agents.

## 1. `/journeys`, group instead of number

- Remove the global 01 to 05 numbering from the index list and from the act sections. That sequence is what asserts a single family.
- Insert a group header before the mesh acts: "The Hospitality Mesh", with the line "Five specialised agents, one architecture. Each owns a strict bounded context and reaches the others only through MCP."
- Under it, a compact agent strip (Agent, Owns, Status) reusing the existing status chip and table treatment from the case study pages:
  - Aetherix, food and beverage: covers, staffing, waste, Built
  - Anima, guest memory across stays, Synthetic PoC
  - Tacet, environmental signal: street, weather, events, Built
  - Peritia, house knowledge, what the people who work here know, Not started
  - Orchestrator, supervisory routing, holds the decision, Design
  - Aetherix, Anima and Tacet link to their pages. Peritia and Orchestrator render unlinked.
  - Closing line links to `/architecture`.
- Reorder the acts: Aetherix, Tacet, Anima contiguous under the mesh group.
- Second group header after them: "Standalone systems / Not part of the mesh", followed by the Lore and Sonor acts, each with a clarifying line inside the act (Lore: aviation maintenance, the same memory architecture under a stricter regime, deliberately outside the mesh; Sonor: urban noise mapping 2020 to 2022, co-founded B2G SaaS, unrelated to the mesh).
- Replace the hero line "How three of these fit together" with wording that points to the five-agent architecture note.
- Update the page meta description and the CollectionPage JSON-LD ordering so it no longer implies one flat family.

## 2. `/architecture`, five agents and Peritia named

- "Four nodes" becomes "Five agents" everywhere, including hero copy, section key lines, the table caption and the closing status section.
- Add a Peritia row to the node table and to the "Where this sits" block, status "Not started", owning house knowledge, with the note that nothing exists yet, the contract admits it, and Lore is the working proof of the pattern in another industry.
- Section 4 rule 5 becomes: "A fifth agent is an addition, not a redesign. The contract that governs exchanges between agents was designed to admit staff knowledge, what the people who work in a property know, which no agent captures today. That agent has a name, Peritia, and no code."
- Aetherix row status becomes "Built and instrumented, pilot partner in recruitment".
- Keep the section 2 point that guest experience is not a separate node, reworded so it does not collide with the new count.

## 3. `/aetherix`, pilot claims and position

Several of these phrasings were already corrected in an earlier pass; this pass sweeps the whole page plus meta description and JSON-LD so none of the four survive anywhere:

- "Tomorrow's covers, Shipped, in pilot" becomes "Running daily against real data. Operator delivery begins with the pilot."
- Hero badge becomes "Phase 3 · Pilot partner in recruitment, go-live September".
- "Design partner pilot starting" becomes "Pilot design partner in recruitment. Go-live targeted end of September."
- "Real-world measurement begins now" becomes "Real-world measurement begins with the pilot."
- No justifying clause after any of them.

Also:

- Confirm the "What it already does" block sits above the three promises with the five behaviours and the closing "Sandbox data, real mechanics, deterministic reruns." Behaviours only, no counts or ratios.
- The vision section currently says "Four nodes, honest status". It becomes five agents, with Peritia added at "Not started".
- Add one line under the hero: "Aetherix is the food and beverage agent of a five-agent mesh." linking to `/architecture`.
- Do not touch the MAPE figure or the mesh node status labels.

## 4. Mirrors and corpus

- `public/aetherix.md` and `public/architecture.md` mirror every change above, including the five-agent count and Peritia.
- `public/llms.txt` and `public/llms-full.txt`: remove the remaining "four nodes" phrasing and any stale pilot claim, and make clear Lore and Sonor sit outside the mesh.
- `scripts/seo-routes.ts`: update the `/journeys`, `/architecture` and `/aetherix` descriptions accordingly, then regenerate the SEO snapshots and sitemap.

## Technical notes

- New copy lives in the existing data arrays (`ACTS` in `src/pages/Journeys.tsx`, the node table and section content in `src/pages/Architecture.tsx`, the promise and status constants in `src/pages/Atherix.tsx`).
- The agent strip on `/journeys` reuses the existing table and status chip markup patterns; no new files, no changes to `index.css` or `tailwind.config.ts`, semantic tokens only.
- Group headers are added inside the existing `journey-stage` flow, outside the snap acts, so scroll snapping and reveal timing are untouched.

## Verification

Playwright against the rendered DOM in day and dusk moods:

- no page states a count other than five agents,
- Peritia appears on `/journeys` and `/architecture` with status "Not started" and no link,
- Lore and Sonor render under "Standalone systems", after the three mesh acts,
- none of the four pilot phrasings appears anywhere, including meta descriptions and JSON-LD,
- build passes and the regenerated snapshots contain the corrected copy.
