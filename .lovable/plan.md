## Goal
Make the Aetherix case study acknowledge Tacet as its external-context counterpart. Today the relationship is one-sided: Tacet has a "Synergy with Aetherix" section, Aetherix has zero mentions of Tacet.

## Changes to `src/pages/Atherix.tsx`

### 1. Project Info, add a Companion entry
Add to `PROJECT_INFO`:
- label: `Companion`
- value: `Tacet, the synthetic acoustic twin (external context)`

Mirrors Tacet's existing line "Headless API for hospitality, complement to Aetherix".

### 2. New Synergy section, placed before Intelligent Anticipation
Insert between "The Vision" (ends ~line 252) and "Intelligent Anticipation" (line 256), preceded by `<SectionDivider label="Synergy" />` to follow the established case-study rhythm.

Section content:
- Label: `Synergy`, headline `Aetherix and Tacet`.
- Intro paragraph: Aetherix reads internal context (PMS, occupancy, F&B, staffing). Tacet reads external context (street, weather, events). Together they form one predictive digital twin for the hotel.
- Two static cards in a 2-column grid, matching the visual treatment of the Tacet page's Synergy section so the pair feels symmetric:
  - Card 1, `hub` icon, "Aetherix, internal context": forecasts operational needs, F&B demand, and staffing from occupancy, PMS data, and historical patterns.
  - Card 2, `public` icon, "Tacet, external context": predicts environmental impact, street disruptions, and acoustic risks from weather, events, and city signals.
- Below the duo, a small inline link: `Read the Tacet case ->` pointing to `/tacet`. Cards themselves stay static (not link-wrapped), per your call.
- Closing line: Together, they let hotel teams act on what is happening inside and what is approaching from outside.

Spacing follows the default `mb-12 md:mb-16` rhythm.

### 3. The Horizon, weave Tacet in
Edit the first paragraph of "The Horizon" so the long-term vision is consistent across both case studies. New wording, roughly:

"Aetherix anchors the internal layer, Tacet the external one. Together they form a single predictive digital twin where specialised agents detect opportunities in real time, orchestrate workflows, and continuously optimise experiences, with humans firmly in the loop for strategic direction."

The two follow-up paragraphs stay as is.

### 4. FAQ, add one entry
Add to `FAQ`, mirroring the symmetric question already on the Tacet page:
- q: `How does Aetherix relate to Tacet?`
- a: `Aetherix reads internal context (PMS, occupancy, F&B, staffing). Tacet reads external context (street, weather, events). They are designed as complements, one predictive digital twin for the hotel.`

### 5. SEO and JSON-LD
- Update the `Seo` description to briefly mention Tacet as the external-context companion.
- Add a `relatedLink: ["https://www.ivandemurard.com/tacet"]` field to the JSON-LD object.

## Copy rules
No em-dashes (commas, colons, parentheses only). Hospitality stays implied, never named. Agentic AI mentioned as a tool, not an identity.

## Files affected
- `src/pages/Atherix.tsx` only.

## Out of scope
- `public/aetherix.md` and `public/llms-full.txt` are the markdown sources of truth flagged in the file header. They can be synced in a follow-up pass; not required for the visual update to ship.
