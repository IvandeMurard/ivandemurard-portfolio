# Aetherix and Architecture: pilot status wording, plus what the system already does

## Current state, verified

An earlier pass already softened part of this page, so two of the four phrasings you quote no longer exist verbatim. What is actually on disk today:

- Promise card 1 tag: `Shadow mode` (not "Shipped, in pilot")
- Hero badge: `Phase 3 · Shadow Mode` (not "Phase 3 · Pilot")
- Metric card 1: `Shadow mode` / `Phase 3 · pilot preparation` / caveat mentioning "no design partner signed"
- Meta row Status: "Phase 3 · Pilot preparation … no design partner signed yet"
- FAQ: "First real-world measurements start when a pilot begins"
- Closing line: "Real-world measurement begins when a design partner signs."
- `/architecture` node table: `Aetherix — Built, pilot starting`; also the intro list line "Aetherix (built, pilot starting, zero real users)" and section 8 "built, entering a pilot".

So this pass replaces the current wording with your target wording, and sweeps the same claim in the mirrors.

## 1. The four pilot claims, on /aetherix

| Where | New wording |
| --- | --- |
| Promise card 1 tag | `Running daily against real data. Operator delivery begins with the pilot.` (tag stays short: `Running daily`; the sentence moves to the card body's first line) |
| Hero badge | `Phase 3 · Pilot partner in recruitment, go-live September` |
| Metric card 1 + Status row | `Pilot design partner in recruitment. Go-live targeted end of September.` |
| Closing line + FAQ answer | `Real-world measurement begins with the pilot.` |

No justifying clause appended to any of them. The phase timeline label and the FAQ answer about design partners get the same two sentences, nothing more.

## 2. New block: "What it already does"

Inserted on `/aetherix` above the three promises, inside the existing "What it does" section, using the current card/list grammar and tokens (no new layout primitives): a headed list of the five behaviours you wrote, verbatim, closed by the single line `Sandbox data, real mechanics, deterministic reruns.` No counts, no ratios.

## 3. /architecture

- Node table, Aetherix status: `Built and instrumented — pilot partner in recruitment` (rendered with the site's separator convention, not a raw hyphen).
- Intro list line and section 8 bullet get the same status, so the page does not contradict its own table.
- Section 4, fifth rule: title becomes `A fifth node is an addition, not a redesign`, and the body is replaced with your text: the contract was designed to admit staff knowledge, which no node captures today; inspired by Lore; then the named node, `Peritia, the trade node — a house's know-how, held by the house rather than by whoever is on shift. Not started. The contract admits it, and Lore is the working proof of the pattern in another industry.` The "namespaced signal contract" internals sentence goes away. The other four rules are untouched.

Interpretation to confirm if wrong: your note points at Section 4 as a whole, but the replacement text is specifically about the fifth node, so I am replacing only that rule's body and leaving rules 1 to 4 intact.

## 4. Mirrors, corpus, snapshots

- `public/aetherix.md`: status lines, three-promise labels, "Where we are, honestly", roadmap Phase 3 label; add the "What it already does" block.
- `public/architecture.md`: intro list, node table row, section 4 fifth rule, section 8 bullet.
- `public/llms.txt` and `public/llms-full.txt`: Aetherix entries and the architecture paragraph.
- `scripts/seo-routes.ts`: Aetherix and Architecture descriptions and any JSON-LD text carrying the old claim; then rebuild so `dist/` snapshots regenerate.

## 5. Verification

Playwright pass over `/aetherix` and `/architecture` (light and dusk) asserting that none of these strings survives anywhere in the rendered DOM, including `<meta>` and `ld+json`: "Shipped, in pilot", "pilot starting", "Design partner pilot starting", "measurement begins now", "Phase 3 · Pilot" as a bare badge. Plus a repo-wide grep across `src/`, `public/`, `scripts/`.

## Untouched

The MAPE figure and its "synthetic backtest, not a headline" framing, and the status labels of the four mesh nodes.
