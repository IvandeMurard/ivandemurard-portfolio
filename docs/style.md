# Site style: words, type and layout

Status: v1, validated by Ivan on 2 Nov 2026. Applies to every page of ivandemurard.com and to Rose. Pilot: the Rose case study (`/rose-design-lab`). When this file and an older brief disagree, this file wins for style; the brief still wins for facts.

Principles. Simple purpose, simple architecture, simple implementation. Cut taglines, helper text and secondary labels that explain the interface: if a screen needs them to make sense, fix the layout. Keep, as short as possible, what commits you: status, sources, honesty markers and the data notice where data is collected. Every decision should serve the reader (UX), the builder (DX) and agents (AX). When one gains at another’s expense, say so and measure it. A change ships only when tests show nothing else broke.

Reference: ada.cx/platform, for its clarity, not for its brand. Take the method below, never its visuals, words or layout one to one.

## 1. What a page must do

- **One message per page, said in the hero.** One sentence of intent, one supporting line, and the product shown working. No metadata, badges or extra links in the hero.
- **The product shown in action, from the first screen.** A live or looping demonstration beats a description of it.
- **Each section answers one question, in reading order.** The next section's heading follows from the previous one. The story carries the transition; no bridging sentence is needed.
- **Product, technical and business content together.** In each project: what it does for the user, how it works, what it is worth or costs.
- **The right level of information.** Each section pairs short text with one visual (demo, diagram, figure) that is understood at a glance. Detail goes behind a link or a disclosure, never in the main flow.
- **Background changes mark a new part of the story.** Use the existing continuous gradient and full-width colour bands, not borders or boxes.

## 2. Words

- Short, affirmative sentences. One idea per sentence. A subject and a verb.
- Say what is. Do not stage it.
- Every figure comes with its comparison and its meaning in plain words (see the figures rule in `docs/rose-case-study.md` §11.6).
- No em-dashes.

### Banned patterns (AI tells)

Each is banned in site copy and in Rose's answers. The checker in §5 flags the ones it can detect.

| Pattern | Example to remove | Write instead |
|---|---|---|
| Theatrical fragments | "Not selling. Explaining, reformulating, contextualising." / "His call." | One full sentence: "Rose explains, rephrases and puts the work in context; she does not sell." |
| Maxim-like closing lines | "Contracts are only as good as the checks behind them." | Cut it, or state the next fact plainly. |
| Self-aware asides | "I would rather say so." / "rather than calling them features" | Cut it. |
| Rhythm triads with full stops | "One platform. Fully configurable. Ready for your team." | One sentence with a verb. |
| "Not X, but Y" / "X, not Y" as a reflex | "Contact is an optional outcome, not the goal of every answer." | Keep only when the contrast is the information. Max one per page. |
| Colon reveals | "What I changed: her goal." | "I changed her goal." |
| Mood words standing in for facts | "quiet", "honest", "narrow on purpose", "the part everyone skips" | The fact the word stands for. |
| Chains of middle dots as decoration | "Case study · AI service design · Rose" | One label, or a real list. Middle dots only in metadata lines and source lines. |

## 3. Type

- **Italic: one use only.** One phrase in the hero headline of a page, at most. No italic in section headings, transitions, captions, notes or body text.
- **Rose's notes:** Rose's notes are recognised by their bubble (dock surface and border), the compass and the name Rose in roman. Their text is ink, not copper. No italic in notes.
- **Serif** for headings, **sans** for body text, **mono** only for data, code and source lines.
- **Uppercase mono labels (kickers, tags, pills):** at most one per section, and no decorative pills or badges. The one status badge per project stays (Built, Pilot-ready, and so on).
- No new fonts or display effects.

## 4. Layout

- Generous space between sections; fewer, larger elements.
- One visual per section. No grids of small cards with icons and tags.
- Navigation aids (table of contents, legends) stay out of the hero.

## 5. Checks

- A test scans site copy (`src/content`, page components, `public/*.md`) for the detectable patterns of §2 and for italic outside the hero, and lists every hit with its file and line.
- A hit is fixed in the copy, or recorded in an allowlist with a one-line reason. The allowlist is reviewed by Ivan.
- The test is a ratchet. `docs/style-baseline.json` records the hits per file and per pattern. The test fails if a count goes up or a new file gets a hit; when a count goes down, it asks for the baseline to be lowered in the same commit (`bunx tsx scripts/style-check.ts --lower`). The baseline is never raised to pass. The remaining total is printed on every run.
- Rose's evaluation adds a style dimension: an answer with a banned pattern is a quality failure (not critical).
