## Reframe Aetherix around one thesis: living operational memory

Aetherix is repositioned from "forecasting framework" to **persistent operational cognition** (memory that compounds), delivered on WhatsApp, as the F&B node of the Hospitality Agentic Mesh. Keep existing DA/UI/UX (SectionDivider rhythm, editorial typography, no em-dashes, hospitality felt not named).

### 1. Repo & naming conventions

- **Meta-repo (public)**: `github.com/IvandeMurard/hospitality-agentic-mesh` — used for CTA "Explore the Mesh", Anima link, and any Mesh-level reference.
- **Aetherix repo (private)**: `github.com/IvandeMurard/aetherix-hospitality-ai` — used in the Aetherix "Repository" line, with a discreet tooltip on hover: *"Private repository, access upon request"*.
- **File naming**: standardize on **Aetherix** everywhere (page kept as `src/pages/Atherix.tsx` since route is `/aetherix`, but visible strings, mirrors, and new components use `Aetherix`). Rename `public/atherix.md` → `public/aetherix.md` (already exists as `aetherix.md`, verify and drop the old one if present).

### 2. New section order (in `src/pages/Atherix.tsx`)

```text
1. Hero (thesis rewritten)
2. Video placeholder ("Closed-loop demo, coming soon")
3. The loop that learns (Memory → Prediction → Action → Learning) — promoted, #1 narrative
4. What it does (three promises: covers, staffing, waste)
5. The Daily Receipt (existing component, kept)
6. Real-data + Closed-loop (numbers reframed, no MAPE claim)
7. Evaluation by design (one line, Qonto-inspired eval-as-contract)
8. Trust engineering, visible (3 screenshot placeholders)
9. Architecture / Anticipation (Qdrant removed, HiveMemory + fallback added)
10. The Mesh (4 nodes, honest statuses) — Aetherix, Tacet, Orchestrator, Anima
11. Aetherix ↔ Tacet (MCP handshake, orchestrator scenario)
12. Anima spotlight (promoted — see §6)
13. Vision / Roadmap
14. FAQ (6 questions incl. Mesh)
15. CTA (Explore the Mesh → meta-repo)
```

Each section separated by `<SectionDivider index="0X" label="..." />` per project rhythm rule.

### 3. Content changes, section by section

**Hero** — rewrite headline and subhead around: *Persistent operational cognition for hospitality. Turning scattered local experience into durable organizational intelligence.* Keep `AetherixHeroBadges` (already includes Phase 3 · Pilot, MCP-Native).

**The loop that learns** — new or promoted section: 4 cards Memory / Prediction / Action / Learning, each with the day-7 vs day-90 compounding note. Uses existing card styling (`bg-surface-container-low`, `border-outline-variant/25`, `rounded-2xl`).

**Real-data + Closed-loop** — **remove 15.09% MAPE claim from headline metric**. Replace `AetherixMetricCards.tsx`:
- Card 1: "Phase 3 · Pilot" / "Design partner starting" / caveat about real-world measurement beginning now.
- Card 2: "Target −3% to −8%" labor cost variance / 90 days / target, not measured.
- Card 3: "14/14" security gates passing / multi-tenant RLS.
- MAPE moved to a smaller "Synthetic baseline" line inside the Anticipation section, honestly labeled.

**Trust engineering, visible** — new section with 3 placeholder frames (`bg-surface-container-low border border-outline-variant/25 aspect-video rounded-2xl` + caption + small "Screenshot coming" label). Captions: (a) Eval pipeline CI gate, (b) MCP tool-call observability event, (c) Multi-tenant hotel_id scoping.

**Architecture / Anticipation** — audit `AetherixArchitectureDiagram.tsx` and `AnticipationCeiling.tsx`: **remove any Qdrant / Semantic Layer references**, ensure pipeline reads: Apaleo (OAuth2 + MCP read) + Open-Meteo + PredictHQ → Prophet → pgvector (OperationalMemory + HiveMemory cold-start) → Claude Sonnet (Gemini/GPT fallback) → WhatsApp / Email.

**The Mesh** — update `AetherixMeshDiagram.tsx` to 4 nodes with honest statuses:
| Node | Role | Status |
|---|---|---|
| Aetherix | F&B execution | Live (staging) |
| Tacet | Sensory | Phase 3 |
| Orchestrator | Supervisory (MCP routing) | Phase 3, stub |
| Anima | Guest Cognition Layer | Shipped (Anthropic hackathon, Jun 2026) |

**Aetherix ↔ Tacet** — reframe as MCP handshake: Aetherix owns internal context (occupancy, F&B, staffing), Tacet owns external (noise, weather, events). Short scenario paragraph showing the Orchestrator calling both.

**Anima spotlight (promoted)** — dedicated block (not a footnote): dark editorial card with the 4-layer temporal memory (working / episodic / semantic / segment), "Shipped at Anthropic hackathon, Jun 2026", link to meta-repo. Visually more present than a paragraph — a horizontal 4-layer stack similar to `AetherixLayerStack` styling.

**Video placeholder** — a `aspect-video` frame with centered label *"Closed-loop demo, coming soon"* in `font-label uppercase tracking-[0.25em] text-secondary`.

**MCP mentions** — replace any "MCP server in progress" with *"MCP Server v0 is live"*.

**FAQ** — 6 questions, add one about the Mesh:
1. What is Aetherix in one sentence?
2. Why memory, not just forecasting?
3. How does the closed loop work?
4. How is Aetherix part of a Mesh?
5. What about data security and multi-tenancy?
6. How do I pilot Aetherix?

**CTA** — primary button: "Explore the Mesh" → `github.com/IvandeMurard/hospitality-agentic-mesh`. Secondary: `cal.com/ivandemurard/30min`.

### 4. Repository line with tooltip

In the PROJECT_INFO / meta grid, add hover tooltip on the Aetherix repo link using the project's existing pattern (title attribute or lightweight tooltip). Text: *"Private repository, access upon request"*. Icon `lock` optional, kept discreet.

### 5. Mirror files to sync

- `public/aetherix.md` — rewrite to match the new page (loop-first, no MAPE headline, Mesh table with 4 nodes incl. Anima honest status, MCP Server v0 live, repos split correctly).
- `public/llms-full.txt` — same edits in the Aetherix section.

### 6. Files touched

**Edited**:
- `src/pages/Atherix.tsx` — section reorder, new sections, copy rewrite, CTA repo change.
- `src/components/atherix/AetherixMetricCards.tsx` — metrics reframed, MAPE removed from headline.
- `src/components/atherix/AetherixMeshDiagram.tsx` — 4 nodes with statuses incl. Anima.
- `src/components/atherix/AetherixArchitectureDiagram.tsx` — remove Qdrant/Semantic Layer, add HiveMemory + fallback.
- `src/components/atherix/AnticipationCeiling.tsx` — small MAPE note honestly labeled, Qdrant removed.
- `public/aetherix.md` — mirror.
- `public/llms-full.txt` — mirror.

**Created**:
- `src/components/atherix/AetherixLoopCards.tsx` — 4 cards Memory/Prediction/Action/Learning.
- `src/components/atherix/AetherixTrustFrames.tsx` — 3 screenshot placeholders.
- `src/components/atherix/AetherixVideoPlaceholder.tsx` — labeled aspect-video block.
- `src/components/atherix/AetherixAnimaSpotlight.tsx` — promoted Anima block, 4-layer stack.

**Not touched**: routes, SEO scaffolding (Seo component values updated inline in `Atherix.tsx` only for title/description alignment with new thesis), design tokens.

### 7. Explicit non-goals

- No claim of real-world MAPE.
- No em-dashes anywhere (project rule).
- No hardcoded colors — all through existing semantic tokens.
- No change to hospitality tone (felt, never named).
- No structural change to global layout, header, footer, or routing.

### 8. Placeholders you will provide later

- 3 screenshots for "Trust engineering, visible".
- Closed-loop demo video file or URL.

Once those arrive, swap into the placeholder components without further reframing.
