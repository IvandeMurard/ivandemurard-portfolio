## Goal

Reflect the real repo state on `/atherix`: the **outbound MCP server is in progress** and should appear as a distinct node in the Intelligent Anticipation architecture diagram. Add quiet, on-brand motion that signals "data flowing" without becoming decorative.

## Changes to `src/components/atherix/AetherixArchitectureDiagram.tsx`

### 1. New "Outbound MCP" node in the delivery row

Today the delivery row has two cards: `WhatsApp push` and `Next.js verification`. Reframe it so the MCP server is the orchestrator that fans out to both channels:

```text
                    Intelligence layers
                            │
                    ┌───────┴───────┐
                    │ Outbound MCP  │   (in progress, dashed border)
                    │   server      │
                    └───┬───────┬───┘
                        │       │
                  WhatsApp   Next.js
                  push       verification
```

Implementation:
- Replace the current 2-column delivery grid with a centered MCP node above a 2-column children row.
- MCP node: same card styling as backend column, but with `border-dashed border-secondary-fixed-dim/60` and a small `font-label` "IN PROGRESS" tag in the top-right to honour the README's actual status.
- Icon: `hub` (Material Symbols) for the MCP node, keeps the gold-on-cream language.
- Two thin connector lines from MCP down into WhatsApp and Next.js cards, each using `.divider-fall` with staggered `--reveal-delay`.

### 2. Minimalist motion

All new motion stays inside the existing primitives so we add zero new keyframes except for one tiny pulse that signals the live MCP path:

- **Reveal cascade** (already present): nodes fade up via `data-reveal-child` with delays. Add the MCP node at delay `440ms`, its two child cards at `520ms` and `600ms`.
- **Connector lines**: existing `.divider-fall` for the new vertical connectors from intelligence column → MCP node, and MCP → delivery cards. Vertical lines using `.divider-fall` (which scales Y from 0 → 1, 700ms ease).
- **Single new "data pulse"**: a subtle 1px gold dot that travels down each connector line on a slow loop (4s, ease-in-out, infinite). Pure CSS using `@keyframes mcp-pulse` translating Y from 0% → 100% with opacity easing in then out. Respects `prefers-reduced-motion` (motion disabled, dot hidden).

Add to `src/index.css` (in the `@layer components` block, near `halo-drift`):

```css
.mcp-pulse-track { position: relative; }
.mcp-pulse-track::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: 3px;
  height: 3px;
  border-radius: 9999px;
  background: hsl(var(--secondary) / 0.7);
  transform: translate(-50%, 0);
  animation: mcp-pulse 4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  animation-delay: var(--pulse-delay, 0ms);
}
@media (prefers-reduced-motion: reduce) {
  .mcp-pulse-track::after { animation: none; opacity: 0; }
}
@keyframes mcp-pulse {
  0%   { transform: translate(-50%, -2px); opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translate(-50%, calc(100% + 2px)); opacity: 0; }
}
```

Apply `.mcp-pulse-track` to each of the three new vertical connector divs (intelligence → MCP, MCP → WhatsApp, MCP → Next.js) with staggered `--pulse-delay` (`0ms`, `1300ms`, `2600ms`) so the pulse feels like a continuous heartbeat moving through the system rather than three synchronized blinks.

### 3. Caption update

Change the bottom italic caption from `Numerical · Semantic · Cognitive · Reasoning` to `Numerical · Semantic · Cognitive · Reasoning · Action` so the MCP server (the action layer) is acknowledged in the legend without adding a separate label.

## Files touched

- `src/components/atherix/AetherixArchitectureDiagram.tsx` (restructure delivery row, add MCP node + connectors, ~40 lines changed)
- `src/index.css` (add `.mcp-pulse-track` + `@keyframes mcp-pulse`, ~25 lines)

## Out of scope

- No copy changes elsewhere on the page (status row already says "outbound MCP server in progress").
- No new dependencies, no SVG path animations, no JS-driven motion.
- Horizon illustration untouched.

Reply "go" to implement.