# Consistency check: Rose and the markdown mirrors

Answer: no, they are not up to date. The six fixes landed in `public/aetherix.md`, `public/tacet.md`, `public/llms.txt`, `public/llms-full.txt` (partly) and the local `get_about` tool, but Rose's context file, the deployed MCP function, the site pages and several mirrors still carry the old facts.

## What is stale today (verified)

Rose (`supabase/functions/_shared/rose-context.ts`)
- Track record still says "rolled out an internal SaaS to 500+ users across 100 care homes".
- Current builds still list Kissa.
- Anima described as "a synthetic proof of concept" (lowercase, inconsistent with the standardised "Synthetic PoC").
- No Tacet status line, so Rose cannot say Tacet is Built.

Deployed MCP function (`supabase/functions/mcp/index.ts`)
- Track record already fixed and Kissa already removed there, but it is a separate copy from `src/lib/mcp/tools/get-about.ts`; both must stay in sync, and the function needs redeploying for the change to be live.

Repo URL still pointing at the renamed repo
- `scripts/seo-routes.ts` (2 places), `src/pages/Atherix.tsx` (4), `src/pages/Architecture.tsx` (2), `src/components/atherix/AetherixAnimaSpotlight.tsx`, `public/architecture.md`, `public/llms-full.txt`.

Tacet status still "Prototype"
- `src/content/systems.ts`, `src/pages/Architecture.tsx`, `src/pages/Atherix.tsx` vision list, `public/architecture.md` table, `public/llms-full.txt` Aetherix paragraph.

Anima status wording
- "Design" in `src/pages/Atherix.tsx` and `public/llms-full.txt`; "Design, prototype shipped" in `src/pages/Architecture.tsx`; "synthetic proof of concept" in `src/content/systems.ts`, `public/anima.md`, `public/architecture.md`, `public/llms-full.txt`.

Kissa still present
- `src/content/site.ts` project list, `supabase/functions/_shared/rose-context.ts`.

DomusVi line still overstated
- `src/content/site.ts`.

## Proposed fixes

1. Repo URL: replace every `hospitality-agentic-mesh` occurrence with `Hospitality-Multi-agent-Architecture`, including visible link labels.
2. Tacet status: "Built" everywhere (systems, both pages, architecture.md, llms-full.txt). Keep the fuller phrasing "Built - live data ingestion pipeline, MCP server v0 live on Fly.io" where a sentence allows it.
3. Anima status: standardise on "Synthetic PoC" as the status word in every status field and list, keeping the surrounding descriptive text and the DPIA caveat intact.
4. DomusVi: `src/content/site.ts` outcome becomes "Delivered the MVP; rollout planned for 500+ users across 100 care homes...", same as the other copies. Name kept.
5. Kissa: remove from `src/content/site.ts` projects and from Rose's current-builds line.
6. Rose context: apply 2 to 5 above, and add a one-line Tacet status fact so Rose answers correctly.
7. Redeploy the `mcp` and `rose-chat` edge functions so the corrected context is live, then spot-check Rose with a question about Tacet's status and the DomusVi rollout.

## Open question

`src/content/site.ts` currently links Kissa to its GitHub repo under "Other projects". The plan removes it entirely per the earlier instruction. Say the word if you would rather keep the GitHub link and only drop it from "current builds".
