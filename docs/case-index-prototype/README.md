# Case studies index v2: design reference

Source: canvas board "H · Case studies index v2" (17 Nov 2026). Copy validated by Ivan on 17 Nov 2026.

- `case-index-day.html`, `case-index-night.html`: the reference. Take copy, order, structure and tokens from the HTML, never from the PNGs.
- `case-index-day-1440.png`, `case-index-night-1440.png`, `case-index-day-390-part1.png` and `-part2.png`: how it should look.
- `compass.jpg`, `sonor.jpg`: copies of the existing site images (src/assets/case-paris-compass.jpg, src/assets/case-sonor.png). Use the originals in code.

## Data, not copy
- Status word and lamp of every card: from `src/content/statuses.ts`, never written in the page.
- Project names and links: from `src/content/site.ts`.
- Per-project tint of the blurred card backgrounds: Aetherix warm sand, Tacet sage, Anima powder rose, Rose cool blue-grey, Lore steel grey. Compass and Sonor keep their photo under a dark veil. The other photos of the old page are removed.

## Not page copy
- "Group 1" / "Group 2" kickers: keep them only if they help; they may become the section labels "The Hospitality Multi-Agent Architecture" and "Standalone projects" alone.
