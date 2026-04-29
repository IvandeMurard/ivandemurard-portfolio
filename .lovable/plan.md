## Intent

Three threads, one direction:

1. Update the hero subtitle with your new wording.
2. Sharpen the homepage positioning so three things show through, in order: (a) you read environments / operations from the inside, (b) you turn that reading into product decisions, (c) you reason in agentic ecosystems with the human in the loop.
3. Add a **Journal** page for opinion pieces and curated resources — a place where this point of view lives, not as a case study.
4. Remove every em-dash (`—`) from the site, replacing each with a comma, parentheses, or a sentence break depending on context.

---

## 1. Hero subtitle (Index.tsx)

Replace the current subcopy with exactly:

> "A digital practice where AI-powered systems quietly deliver measurable business impact by reducing operational costs, eliminating waste, sharing intelligence, while keeping the human at the center."

No em-dashes (already comma-separated). Keep current typography and spacing.

---

## 2. Sharpen the homepage positioning

Goal: the three pillars and the signature line currently say "what I do" generically. Re-cast them so the differentiating angle (*PM who thinks in operational experience, ecosystem over features*) reads on first scroll, without naming it.

### 2a. Signature line (between Hero and Case Studies)

Replace the current quote with one that names the bridge from operations to product, in your voice:

> "I read environments from the inside, then translate what I see into products that hold together as systems."

Keeps the italic, hairline-divided, full-width treatment.

### 2b. "What I do" → renamed **"How I work"**, with three rewritten pillars

The three pillars become a sequence (1 → 2 → 3), not a list. Each now reflects one of your three articulated points.

1. **Reading the ground**
  *Field-level fluency in operations (boutique hotels, F&B, design partners, open-data ecosystems). I learn an environment before I design for it.*
2. **From insight to product decisions**
  *I turn that reading into shipped products. Aetherix is the proof: a real operating layer for boutique hotels, not a slideware concept.*
3. **Agentic ecosystems, not isolated features**
  *I design in systems: MCP architecture, Prophet/Claude separation, an Agent Hub, and a clear place for the human in every loop.*

Keep the existing icons or swap to a sequence visual (small `01 / 02 / 03` numerals next to each title, in `font-headline italic text-secondary`) so it reads as a method, not a menu. Recommendation: keep Lucide icons but add the numeral above them.

Section subcopy under the heading:

> "A practice at the intersection of product, AI, and operations: PM training, experience-design instinct, agentic-systems thinking."

### 2c. Milestones row (kept, lightly retuned)

Replace `0→1` and `Open data` with items that reinforce the angle:

- `2 yrs` Co-founder & Product Lead, Sonor
- `3` Shipped products: Sonor, Aetherix, Tacet
- `MCP` Agentic architecture (Aetherix)
- `Field` Hotel & F&B design partners

(If any of those don't match reality, we'll swap them in build, not invent.)

---

## 3. New page: **Journal**

A space for opinion pieces and curated resources. Name it **Field Notes**.

### 3a. Route & nav

- New route `/journal` in `src/App.tsx`.
- Add `{ label: "Journal", to: "/journal" }` to `PRIMARY_NAV` in `src/content/site.ts`. Place it between *Stories/Journeys* and *About*.
- Remove the duplicate `Stories` + `Journeys` entries currently both pointing to `/journeys` (it's a leftover). Keep one labeled *Stories*.

### 3b. Page structure (`src/pages/Journal.tsx`)

Two distinct streams on one page, separated by a hairline section break:

```text
1. Hero strip
   eyebrow: "Journal"
   headline (italic): "Notes from the field."
   subcopy: "Opinion on hard product decisions in hospitality tech, and a curated trail of what I'm reading."

2. Entries  ← long-form opinion pieces
   - vertical list, newest first
   - each item: date · category · title · 2-line excerpt · "Read" link
   - category chips: Product, Operations, Agentic AI, Field

3. Reading list  ← curated external resources
   - 2-column grid on desktop, stacked on mobile
   - each card: source (Substack / podcast / article), title, 1-line take in your voice, outbound link
```

### 3c. Content model (light, no CMS)

Static TS file `src/content/journal.ts` with two arrays:

```ts
export type JournalEntry = {
  slug: string;        // "the-pm-who-reads-rooms"
  title: string;
  date: string;        // "2026-04-29"
  category: "Product" | "Operations" | "Agentic AI" | "Field";
  excerpt: string;
  body: string;        // markdown-ish or plain paragraphs
};

export type ReadingItem = {
  source: "Substack" | "Podcast" | "Article" | "Paper" | "Talk";
  title: string;
  author: string;
  url: string;
  take: string;        // your one-line point of view
  date: string;
};
```

Entries render at `/journal/:slug` via a single `JournalEntry.tsx` route that reads from the array. No backend needed for v1.

### 3d. Seed content (placeholders, you replace)

One opinion entry skeleton ("A hard call on Aetherix's agent boundaries") and three reading-list slots, so the page isn't empty on first build. Clearly marked `// TODO: replace`.

---

## 4. Remove every em-dash from the site

Audit found em-dashes in: `index.html`, `src/index.css` (comments + title), `src/components/layout/SiteLayout.tsx`, `src/components/layout/Footer.tsx`, `src/pages/Index.tsx`, `src/pages/Atrium.tsx`, `src/pages/Sonor.tsx`, `src/pages/Tacet.tsx`, `src/pages/Atherix.tsx`, `src/pages/Contact.tsx`. ~25 occurrences total.

Replacement rules, applied case by case:


| Pattern                                                                | Replace with                                                                             |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Title separator: `Ivan de Murard — Product Builder`                    | `Ivan de Murard, Product Builder`                                                        |
| Page title: `Tacet — The Architecture of Silence`                      | `Tacet: The Architecture of Silence` (colon for title/subtitle)                          |
| Parenthetical clause: `… cognitive impacts in children — and carries…` | parentheses or commas: `…, cognitive impacts in children, and carries…`                  |
| Emphatic break: `…isn't just a quieter city — it is a…`                | comma: `…isn't just a quieter city, it is a…` or split into two sentences                |
| Footer: `© Ivan de Murard — Curated with Care`                         | `© Ivan de Murard · Curated with Care` (middle dot, already used elsewhere as separator) |
| Code comments (`/* Surfaces — warm creams */`)                         | colon: `/* Surfaces: warm creams */`                                                     |


Each occurrence reviewed individually; no blind find-and-replace, since punctuation choice depends on rhythm.

---

## 5. Out of scope

- No CMS, no MDX pipeline for the Journal in v1 (can add later if entries grow past ~10).
- No design-system changes, no new color tokens, no new fonts.
- Atherix / Sonor / Tacet case study pages: only em-dash cleanup, no copy rewrite.
- Footer and header structures stay; only nav array gets the `Journal` entry and the duplicate `Stories/Journeys` cleanup.

---

## Technical notes

- Files created: `src/pages/Journal.tsx`, `src/pages/JournalEntry.tsx`, `src/content/journal.ts`.
- Files edited: `src/App.tsx` (2 routes), `src/content/site.ts` (nav), `src/pages/Index.tsx` (hero subtitle, signature line, pillars, milestones), plus the em-dash sweep across the files listed in §4.
- Pillar numerals: a small `<span className="font-headline italic text-secondary text-sm tracking-widest">01</span>` above each title; no new component required.
- Journal entry routing uses the existing `useParams` pattern; if no slug matches, render a minimal "not found" state inline (no need for the global `NotFound` page).

---

## One question before I build

**Do you confirm the page name "Journal"?** If you'd rather call it *Notes*, *Field Notes*, *Marginalia*, or something else, tell me now and I'll use that name everywhere (route, nav, page title, internal types).