# Aetherix case study v2: design reference

Source: canvas board "G · Aetherix case study v2" (16 Nov 2026). Copy validated by Ivan on 16 Nov 2026.

- `aetherix-v2-day.html`, `aetherix-v2-night.html`: the reference. Take copy, order, structure and tokens from the HTML, never from the PNGs.
- `aetherix-v2-day-1440.png`, `aetherix-v2-night-1440.png`, `aetherix-v2-day-390-part1a.png` to `-part2b.png` (four parts, top to bottom): how it should look.
- `steps.json`: the five "Inside the agent" steps (number, short label, title, description, bubbles, badge).

## Not page copy (board notes only)
- Hero figcaption suffix "(the homepage demo, unchanged)": the page shows the existing caption only.
- "▸ The numbers (…), collapsed": the existing collapsible "The numbers" block, unchanged content.
- "For the technical reader: stack, evaluation contract, observability, multi-tenant security": the existing technical content of the page, collapsed under this label, unchanged.
- The hero demo is a drawing of the existing AetherixHomepageLoop component: reuse the component.

## Known issues in the reference at 390 px (fix in code, not by copying)
- "Inside the agent": the open card is clipped; below md the open card grows to its content.
- Decisions table (03): three columns are cramped; below md each decision stacks (number and title, then the text).
- Decision Ledger table (05): five columns are cramped; below md each row becomes a small card (label: value).

## Copy changed after validation (16 Nov)
The HTML files in this folder keep the copy as validated on 16 Nov 2026. The page and `public/aetherix.md` differ from them in these places, on Ivan's instruction:
- Status: the page shows the status of `src/content/statuses.ts` (Pre-pilot and its note), not the hard-coded "Pilot-ready" and "Ready for a 30-day pilot".
- TL;DR "Today": "The loop runs daily on Maison Lumen, a fictional hotel in the Apaleo sandbox. The product is being made ready for a first pilot; no hotel yet." (The brief says "Hotel Lumen"; the configured name is "Maison Lumen".)
- Phase 0–2: "Validation, observability and the Daily Receipt are done."
- Phase 5: "Revenue Orchestrator. Hive Memory stays research."
- Who figure, PMS: "Apaleo shares read-only data and lists the integration."
- Phase 3: "Pilot readiness. No hotel yet."
- Who figure, hotel management: "Signs the contract."
- Decision 4 title: "Three parties: who uses, who pays, who distributes".
- Forecast test, last paragraph: "The test used restaurant data, without hotel occupancy, the signal the product relies on. The protocol was not pre-registered. Maison Lumen uses occupancy from Apaleo; how accurate the forecast is on a real hotel is what a pilot will measure."
- Chapters 05 and 06, reworded so the style check does not go up (no allowlist entry added). The HTML files and `steps.json` keep the validated words:
  - Shared layer box title: "The shared layer: design, nothing built yet" (was "The shared layer: designed, not built").
  - Step 01 bubble: "Read. Weather is poor, and there are no local events." (was "Read. Weather: poor. Local events: none.").
  - Step 02 description: "A statistical forecast that comes with its range." (was "A statistical forecast with its range, not a single number.").
  - "Inside the agent" caption: "Maison Lumen, a fictional hotel in the Apaleo sandbox: synthetic data, real services, seed 42. The figures come from the run; the bubbles word them for display." (the dots between the three facts are commas).
  - Architecture figure caption: "Every exchange goes through the orchestrator, over MCP. A solid line is Built, long dashes are Synthetic PoC, dots are Design."
- Architecture figure, page and Markdown: the statuses are written as in the reference. In `public/aetherix.md` each is in brackets after the role (for example "Tacet: Sensory: weather, noise, open data (Built · maintenance)").
- Hero button "How it decides, and when it refuses" now points to "Inside the agent" (`#inside-the-agent`).
