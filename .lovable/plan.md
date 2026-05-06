## Tacet case study, V3 reframe

Reposition Tacet from "Architecture of Silence" (B2C noise app) to **"The Synthetic Acoustic Twin"** (headless B2B intelligence layer for hospitality), while keeping the original visual language as a B2B reporting reference.

### 1. Page rewrite, `src/pages/Tacet.tsx`

**Hero**
- New headline: *"Tacet: The Synthetic Acoustic Twin."*
- New sub: *"A proactive, headless intelligence layer that predicts the impact of the external acoustic environment on revenue and guest experience."*
- Eyebrow: `Selected Work / 2026 — Hospitality`

**Project Info** (refresh values)
- Rôle: Product Builder, Architect of an acoustic intelligence layer
- Durée: 2026, ongoing (V3 pivot from B2C to B2B)
- Équipe: Solo (with AI collaboration)
- Contexte: Headless API for hospitality, complement to Aetherix
- Stack: Proxy data APIs (OpenData permits, traffic, weather, events), OpenStreetMap 3D geometry, synthetic acoustic model, JSON alerts to RMS/PMS

**Replace narrative sections** with the six numbered sections from the new copy:
1. *Overview* — origin as Bruitparif dashboard, evolution to Synthetic Acoustic Twin.
2. *The Problem* — one bad noise review costs thousands; "quiet room" is subjective.
3. *The Solution: A Synthetic Digital Twin* — three-step "How it works" (Proxy Data Ingestion, Spatial Geometry, Proactive Alerts) plus the jackhammer example workflow as a pulled quote.
4. *Synergy: Tacet & Aetherix* — side-by-side card (Internal context vs External context). Internal link to `/aetherix` using `react-router` `Link`.
5. *UI/UX: The Sound of Quiet* — keep the existing "Chromatic Silence" midnight section and the two phone mockups, but reframe them as **B2B reporting language** (Chromatic Silence, Soft Components, Data Provenance). Drop "Guided Respiration / Soft Haptics" wording.
6. *The 5-Year Horizon* — Quiet Certification, top 500 boutique hotels, Booking.com / Airbnb integration.

**New section: "The Intelligence Pipeline"**
- Title + sub from the brief.
- New component `src/components/tacet/TacetPipelineDiagram.tsx`, modelled on `AetherixArchitectureDiagram.tsx` (same column + connector + reveal pattern, same tokens).
- Three groups, matching the mermaid:
  - Proxy Data Sources: OpenData Permits (webhooks), Traffic APIs (streams), Weather APIs (streams).
  - Tacet Engine: Synthetic Acoustic Model (accent node) + OpenStreetMap 3D Geometry (data store).
  - Hotel Operations: Revenue Management System, Property Management System.
- Labelled connectors: `Webhooks`, `Streams`, `JSON Alerts`, `Room Tags`.
- Caption row at bottom: `Proxy signals · Synthetic model · 3D geometry · JSON alerts`.

**New illustration**
- Copy `user-uploads://abstract_city_data_1778066028977.jpg` to `src/assets/tacet-acoustic-twin.jpg`.
- Use it in the "Solution" section as a full-width 16/9 plate with gradient overlay and a `Reveal` ink-in animation, captioned *"Synthetic acoustic twin, isometric view."* This replaces text-only density without overshadowing the diagram.

**FAQ refresh**
- "Why headless and not a dashboard?" → API-first integrates into RMS/PMS where decisions already happen.
- "How accurate is a software-only model vs hardware sensors?" → physics-based, calibrated against Bruitparif baselines, no capex.
- "How does Tacet relate to Aetherix?" → external context vs internal context, same digital twin.

**CTA + footer**
- Keep "Explore the Platform" but reframe: primary button → `mailto:` for hotel pilot inquiries; secondary → existing `tacet.vercel.app` demo (labelled *"Original B2C dashboard, visual reference"*).
- Keep the discreet `View as markdown` link at the bottom right.

**SEO**
- Update `<Seo title>` to `Tacet, Synthetic Acoustic Twin for Hospitality`.
- Update description and JSON-LD `@type` from `MobileApplication` to `SoftwareApplication` with `applicationCategory: BusinessApplication`.

### 2. Cross-references

- `src/content/site.ts`: update `PROJECTS.tacet.tagline`, `label` (`B2B • Hospitality • Acoustic Intelligence • 2026`), `NOW_PROJECTS` Tacet blurb.
- `src/pages/Journeys.tsx`: rewrite Journey 03 body to match the new vision (synthetic acoustic twin, hospitality, JSON alerts to RMS/PMS).
- `src/pages/Index.tsx` if it surfaces a Tacet line, align tagline.

### 3. Markdown source of truth

Rewrite `public/tacet.md` with the exact six-section copy from the brief (Overview, Problem, Solution, Synergy, UI/UX, 5-Year Horizon), updated front-matter facts (role, status, stack), and links section pointing to `/aetherix`, `tacet.vercel.app`, repo, contact.

### 4. LLM and SEO assets

- `public/llms.txt`: update Tacet one-liner to the new positioning.
- `public/llms-full.txt`: replace the Tacet block to mirror the new `tacet.md`.
- `public/sitemap.xml`: no URL change needed, just bump `lastmod` for `/tacet` and `/tacet.md`.

### Technical notes

- Diagram component uses the same Tailwind tokens (`surface-container-low`, `secondary-fixed-dim`, `divider-fall`, `mcp-pulse-track`) as Aetherix to stay visually consistent.
- New illustration imported as ES module from `@/assets/`.
- All new copy follows the no-em-dash rule (use commas, colons, parentheses).
- Hospitality remains felt, not named as a slogan; positioning stays "business value + human interactions".
