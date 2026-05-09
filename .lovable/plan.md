## Aetherix case study, three corrections

### 1. Project Info first, after hero

Today the hero block embeds the "How Aetherix Works" pipeline diagram, so Project Info appears below that pipeline. Move the pipeline out of the hero into its own section that lives **after** Project Info, so the order becomes:

1. Hero (headline + intro paragraph + "Scroll to Explore")
2. Project Info
3. How Aetherix Works (pipeline strip)
4. The Vision
5. Synergy
6. Intelligent Anticipation
7. ... rest unchanged

### 2. GitHub repository in Project Info

Mirror the Tacet pattern: add a `Repository` row with a clickable link and the `open_in_new` icon. Use the URL provided:
`https://github.com/IvandeMurard/Hospitality-Operations-Agentic-AI-B2B/tree/main`

Also update the JSON-LD `codeRepository` field on the page (currently points to the old `aetherix-hospitality-ai` repo) so the structured data stays accurate.

The Project Info row renderer will be extended to support an optional `href` (same shape as Tacet's `PROJECT_INFO`), so links render with the underline + external icon affordance.

### 3. Internal vs external context, fixed in the architecture diagram

In `AetherixArchitectureDiagram`, the leftmost column is currently captioned "External signals" and groups Apaleo PMS with Weather and Events. That's incorrect: PMS / POS / occupancy data are **internal** context. Weather, Events, and Social sentiment are **external** context.

Restructure that column into two clearly labelled sub-stacks within the same first column:

```text
Caption: "Context inputs"

  Internal context
    • Apaleo PMS  (OAuth, MCP read)

  External context
    • Weather          (Open Meteo)
    • Events           (PredictHQ)
    • Social sentiment (web + reviews)
```

The two middle/right column captions ("Fat backend, FastAPI", "Intelligence layers") stay as they are. Visually, each sub-group gets a small uppercase label above its cards so the distinction is obvious without adding a fourth column.

Also tighten the body copy of the **Intelligent Anticipation** intro and the **Synergy** card so the wording is consistent with this split (Aetherix = internal context truth + selected external signals; Tacet = deeper external/environmental context). One-line edits, no structural change.

### Files touched

- `src/pages/Atherix.tsx` — reorder sections (move pipeline out of hero into its own section after Project Info), add `Repository` entry to `PROJECT_INFO` with `href`, render link variant in the Project Info grid, update `codeRepository` in JSON-LD, minor copy tweak in Synergy/Anticipation intros.
- `src/components/atherix/AetherixArchitectureDiagram.tsx` — split the first column into "Internal context" and "External context" sub-groups, add Social sentiment, update the column caption.
- `public/aetherix.md` — update repo URL to the new GitHub link so the markdown source of truth matches.

### Out of scope

No design-token, layout-grid, or animation changes beyond the small label additions in the diagram. No new images.
