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
- Who figure, PMS: "Shares read-only data through Apaleo, and lists the integration."
- Who figure, hotel management: "Signs the contract."
- Decision 4 title: "Three parties: who uses, who pays, who distributes".
- Forecast test, last paragraph: "The test used restaurant data, without hotel occupancy, the signal the product relies on. The protocol was not pre-registered. Maison Lumen uses occupancy from Apaleo; how accurate the forecast is on a real hotel is what a pilot will measure."
