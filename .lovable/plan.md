# Homepage hero and intro flow

Scope: `src/pages/Index.tsx` only. No changes to design tokens, SEO routes, or other pages.

## 1. Hero cleanup

- Remove the eyebrow span that currently reads "Welcome, it's good to see you."
- Keep the `<h1>` exactly as it is today: "Product builder." with the second clause "Agentic AI systems for operations." in `text-primary-container`.
- Preserve the gold halo, reveal delays, and scroll cue.

## 2. Replace the bio paragraph

- Delete the existing paragraph directly under the headline (lines 252-258): "Product builder, Paris. Five years across start-ups, scale-ups and large groups, plus two years co-founding a SaaS. Currently building an architecture of specialised agents for hotel operations."
- In its place, add a single paragraph with this exact copy:

  > Product builder, Paris. Five years inside operations - founder → scale-up → large groups → builder.
  > Now I build agentic systems from 0 to 1. Vision → architecture → evaluation → continuous and autonomous improvement.

- Render it as one block, two sentences, directly under the headline, before the proof strip.

## 3. Remove the signature section

- Delete the entire "Signature line" `<Reveal as="section">` block (currently lines 316-328) that reads "Five years reading operations from the inside..."

## 4. Tighten the flow

- Move the Case Studies section up so it follows immediately after the proof strip / CTAs, with no empty space or extra section between them.
- Keep the existing `SectionDivider index="01" label="Case Studies"` as the divider for the section.
- Preserve the two project groups ("The Hospitality Mesh" and "Standalone projects") and their current content.

## 5. Verification

- Run `bun run build` to confirm no TypeScript or JSX errors.
- Capture Playwright screenshots at 375px and 1280px to confirm the new paragraph renders correctly and the Case Studies section sits directly under the hero CTAs.
