## Objective
Replace the outdated `aetherix-hospitality-ai` private repo link with the public `hospitality-agentic-mesh` meta-repo link on the Aetherix case study page and in all mirrors.

## Verified current state
- `src/pages/Atherix.tsx` line 36: Project Info "Repository" row → old URL.
- `src/pages/Atherix.tsx` line 173: JSON-LD `codeRepository` → old URL.
- `src/pages/Atherix.tsx` line 666: Bottom "Aetherix repo" CTA → old URL.
- `public/aetherix.md` lines 67 and 113: two "Aetherix repo (private, access upon request)" lines → old URL.
- `public/llms-full.txt` line 23: same private repo reference → old URL.

## Plan
1. Update `src/pages/Atherix.tsx` at lines 36, 173, and 666 to `https://github.com/IvandeMurard/hospitality-agentic-mesh`.
2. In `public/aetherix.md`, remove the now-redundant "Aetherix repo (private, access upon request)" lines (67 and 113), since the meta-repo is already listed just above/below as the canonical public link. Keeps the mirror clean rather than pointing two labels at the same URL.
3. In `public/llms-full.txt` line 23, drop the ", Aetherix repo (private, access upon request): ..." clause and keep only the meta-repo reference.
4. Also update the "Repository" row label context ("Private repository, access upon request" hint on line 37 and the `title` attribute on line 669) so they no longer describe a private repo — replace with a neutral hint like "Public meta-repo for the Hospitality Agentic Mesh".
5. Grep `aetherix-hospitality-ai` across the whole repo to confirm zero remaining references.
6. Verify build compiles.

## Technical details
- Edits are content-only; no component or route changes.
- No backend, no edge function, no schema changes.