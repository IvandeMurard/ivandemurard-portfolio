# Sharpen Paris Compass card copy

Scope: copy only. One file in the source tree, two mirrors in the LLM corpus.

## 1. New tagline for the card

Lead with the unifying promise, then one concrete differentiator. Keep it to two sentences so the card stays scannable.

> Context is the product. Paris Compass turns an address into its neighbourhood — walkability, transport, retail, schools, air quality and risk scores within a 400–800 m radius, all from public open data.

## 2. Files to update

- `src/content/site.ts` — replace the `parisCompass.tagline` value.
- `public/llms.txt` — update the Paris Compass one-liner.
- `public/llms-full.txt` — update the Paris Compass one-liner.

## 3. Verify

- Card renders cleanly on the homepage at 375 px and 1280 px.
- Card text remains legible in light and dusk modes.
- No layout shift caused by longer or shorter text.
