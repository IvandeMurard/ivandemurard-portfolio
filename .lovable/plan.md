## Hero readability fix, option D

Move the gold halo's core up so it crowns the headline only, and give the supporting paragraph a touch more presence so it reads cleanly on warm cream.

### Changes

**`src/pages/Index.tsx`, hero halo wrapper**
- `-translate-y-[42%]` → `-translate-y-[58%]`
- `h-[520px]` → `h-[440px]`
- `max-h-[82vw]` → `max-h-[70vw]`
- Width unchanged (`w-[620px]`, `max-w-[96vw]`)

Result: the dense glow sits behind "Welcome," and the italic line, then fades before reaching the paragraph.

**`src/pages/Index.tsx`, hero paragraph**
- `font-light` → `font-normal`
- `text-on-surface-variant` → `text-on-surface/85`
- Size, max-width, leading unchanged.

Result: paragraph reads cleanly on cream without feeling heavy. Hierarchy preserved through size and italics, not through fog.

### Out of scope
No CSS changes. Halo gradient, breathing animation, PageLight, milestones, blue halo, all untouched.