# Field Notes v2: design reference

Source: canvas boards "I · Field Notes index v2" and "J · Field Note pattern" (17 Nov 2026). Copy validated by Ivan on 17 Nov 2026.

- `field-index-day.html`, `field-index-night.html`: the index reference. Take copy, order, structure and tokens from the HTML, never from the PNGs.
- `field-note-pattern-day.html`: board J. Three slices, one per note, stacked for comparison. Each slice is a separate note page: hook, one peak moment on a full screen (cream to navy), then the reference zone on a flat ground.
- PNGs: how it should look (1440 and 390).

## Data, not copy
- Read times, revision counts ("revised N times") and "tested on" come from the journal content (updates arrays, computed read time), never typed in the page.
- Project names, statuses and links come from site.ts and statuses.ts.

## Known liberties in the reference, to correct in code
- Lore's answer in the index proof block is paraphrased. In code, quote only verbatim fragments of the recorded answer in section 12 of the harness note.
- "6 min" for "Where should an agent's responsibility end?" is an estimate: use the computed value.
