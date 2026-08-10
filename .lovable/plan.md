# Rose, Paris Compass visual, Field Notes cards

## 1. Rose: prompts brought in line with the new homepage

- Add a `/` (home) entry to `ROSE_PROMPTS` so the homepage stops falling back to the generic defaults, worded around what the page now shows: case studies first, then field notes.
- Add a Paris Compass line to the default and home prompts' underlying knowledge (Rose context already reads the site content; the chip set gains "What is Paris Compass?").
- Question marks on every trigger: chips become questions, not labels. Examples:
  - Home: "What does Ivan build?", "What is live today?", "Where should I start?", "Book a call" (kept as the constant exit door, no question mark).
  - Case studies: "What does it actually do?", "Why WhatsApp?", "What is still a prototype?"
  - Field notes: "What is a grader?", "How do I apply this?", "Which product shows this?"
- Rule applied across `src/content/rosePrompts.ts`: every chip except "Book a call" ends with "?". `ariaLabel` kept where the visible question is elliptical.

## 2. Paris Compass illustration

Replace `src/assets/case-paris-compass.jpg` with a generated illustration in the site's register (muted, architectural, no cartoon, no map cliché): a Paris ground-floor commercial street front, shopfront rhythm, warm stone and gold-ish light, treated with the same restrained grain as the other case covers. Same filename and dimensions so nothing else changes.

## 3. Field Notes cards: taller and narrower

Adopt the proportions in the screenshot (the layout at ~995px, which reads finer):

- Card padding down from `p-10` to `p-8`, gap from `gap-10 md:gap-12` to `gap-6 md:gap-8`.
- Icon size 28 to 24, bottom margin 8 to 6.
- Constrain the grid so cards stay narrow columns on wide screens: `max-w-5xl` on the grid, left aligned with the section, so the text wraps in a tall rectangle rather than a wide slab.
- Keep three columns; the excerpt line length shortens, which is what makes it feel finer.

## 4. Other recommendations (included unless you say otherwise)

- Give the Paris Compass card a visible "External" marker consistent with the other cards' arrow treatment, so the new tab is not a surprise.
- Rose chips: cap at three questions plus "Book a call" on every route, so the dock never wraps to two rows at 994px (the screenshot shows it close to the edge).

## Technical notes

Files touched: `src/content/rosePrompts.ts`, `src/assets/case-paris-compass.jpg` (regenerated), `src/pages/Index.tsx` (Field Notes grid classes, Paris Compass external marker). No content, routing or backend changes. Verified with a browser pass at 375px, 995px and 1440px in light and dusk.
