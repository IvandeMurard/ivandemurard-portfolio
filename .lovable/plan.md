Update the "Harnesses, graders, closed loops" Field Note and keep its system definitions in sync across the site.

## Title recommendation

Keep the current title **"Harnesses, graders, closed loops"**. It is distinctive, matches the slug, and signals the article is a reference vocabulary piece rather than a generic how-to. Shift the promise into the subtitle instead of the title, so the value proposition is explicit without changing the URL or the reading contract.

## What to change

1. **Field Note anchors block** (`src/content/journalHarnesses.ts`, top `anchors` block)
   - **Aetherix / What it does**: "A food & beverage execution agent for hotels. It tells a manager how many covers to expect, how to staff for them, and how to cut food waste."
   - **Aetherix / Who uses it**: "Other agents via MCP, or a hotel / F&B manager with WhatsApp."
   - **Lore / What it does**: "A voice AI mentor that captures, qualifies, and leverages the tacit expertise from senior to junior collaborators. Just ask."
   - **Lore / Who uses it**: "A junior technician on the shop floor, hands busy."
   - **Lore / What reality returns**: "Reality returns both the SOP and the signed work record: the procedure that was followed, and the outcome of the operation actually performed."

2. **System definitions** (`src/content/systems.ts`)
   - Update `Aetherix` and `Lore` entries in both `SYSTEM_ANCHORS` and `MESH_ANCHORS` to match the new one-liners, so the case-study anchors and `/architecture` page stay consistent.

3. **Plain-text mirror** (`public/harnesses-graders-closed-loops.md`)
   - Update the opening system summary to reflect the same wording, then regenerate the LLM corpus files (`public/llms.txt`, `public/llms-full.txt`) so the mirrors stay in sync.

4. **Subtitle**
   - Replace the current subtitle with a clearer promise: "A working vocabulary for building evaluation into AI products from day one, tested on two real systems." or similar, depending on final copy choice.

## What to verify

- No broken links or changed slugs.
- Updated text is exported in the LLM corpus.
- `JournalEntry.tsx` rendering still correctly picks up the `anchors` block.