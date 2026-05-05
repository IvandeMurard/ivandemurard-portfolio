## Goal

Make the Aetherix case study visually specific to the actual repo (github.com/IvandeMurard/aetherix-hospitality-ai), not generic stock-feeling imagery. Replace two image slots with custom illustrations that reflect the real architecture, and wire in the real portraits for Toni Stoeckl and Avi Brosh.

## What changes on /atherix

### 1. "Intelligent Anticipation" section
Currently shows a generic golden-hour dining-room photo (`opsImage`). Replace the large left card with a **custom architecture illustration** rendered as an inline SVG React component (`AetherixArchitectureDiagram.tsx`), based on the real mermaid graph from the repo README:

```text
External signals          Fat Backend (FastAPI)         Intelligence
────────────────          ─────────────────────         ────────────
Apaleo PMS  ──┐                                      ┌── Supabase PG
Weather     ──┼──►  Sync ─► Semantic ─► Claude  ─────┼── Qdrant (495+ patterns)
Events      ──┘             Reasoning   Sonnet       └── pgvector memory
                                  │
                                  ▼
                       WhatsApp / SMS  +  Next.js dashboard
```

Style: thin gold/secondary lines on cream `surface-container-lowest`, small Material icon nodes (matching the existing pipeline strip), `font-label` uppercase node titles, italic `font-headline` layer captions ("Numerical · Semantic · Cognitive · Reasoning"). Animated with the existing `.divider-fall` for connecting lines and staggered `data-reveal-child` fades for nodes (no new motion primitives). Rendered via `<Reveal>` so it plays when scrolled into view.

The right-side "Proactive Messaging" card stays, with copy tightened to mention Apaleo + MCP-callable explicitly.

Delete `src/assets/atherix-dashboard.jpg`.

### 2. "The Horizon" section
Currently text-only. Add a **custom illustration** above the heading: an inline SVG `AetherixHorizonIllustration.tsx` showing a minimalist horizon line with three concentric arcs labelled "Phase 1 Sandbox · Phase 2 Pilot · Phase 3 Hive Memory", a small Aetherix node anchored at the center, and faint orbiting dots representing other agents in the "agentic operations mesh". Same gold-on-cream palette, `.halo-drift` on the outer arc for slow ambient motion, `.divider-fall` on the horizon line.

### 3. Real portraits for the two quotes
Replace the empty grey `w-12 h-12 rounded-full bg-surface-container-highest` circles with the actual portraits:

- Copy `user-uploads://toni_stoeckl.webp` → `src/assets/toni-stoeckl.webp`
- Copy `user-uploads://avi_brosh.webp` → `src/assets/avi-brosh.webp`
- Import and render in the two quote blocks at `w-12 h-12 rounded-full object-cover` (with `loading="lazy"` and proper alt text)

### 4. Hero image
Keep `atherix-hero-lobby.jpg` (it reads as boutique-hotel context, which matches the repo's domain). No change.

### 5. Copy tightening (specificity to the real repo)
Small edits so the page reflects what's actually in the README, no fluff:
- Pipeline diagram already correct (Apaleo, Prophet, Claude Sonnet, MCP, WhatsApp), keep as is.
- "Intelligent Anticipation" intro: mention the four layers explicitly (Numerical forecast via Prophet, Semantic patterns via Qdrant, Cognitive memory via pgvector, Reasoning via Claude Sonnet).
- "Current Status" project-info row: update to "End-to-end pipeline operational in sandbox, Apaleo OAuth + MCP read access live, outbound MCP server in progress".
- Remove the lone French paragraph in "The Vision" (mixes languages, the rest of the page is English). Replace with an English equivalent that keeps the same sentiment, no em-dashes.

## Files touched

- `src/pages/Atherix.tsx` (edits, ~30 lines changed)
- `src/components/atherix/AetherixArchitectureDiagram.tsx` (new)
- `src/components/atherix/AetherixHorizonIllustration.tsx` (new)
- `src/assets/toni-stoeckl.webp` (copied from upload)
- `src/assets/avi-brosh.webp` (copied from upload)
- `src/assets/atherix-dashboard.jpg` (deleted)

## Out of scope

- No new motion primitives (reuse `.divider-fall`, `.halo-drift`, `<Reveal>`).
- No backend/database changes.
- Other case study pages (Sonor, Tacet) untouched.

Reply "go" to implement.