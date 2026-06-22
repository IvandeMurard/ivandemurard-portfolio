
## Goal

1. Restore full text contrast (WCAG AA) across `/aetherix` in both Day and Dusk modes.
2. Add the missing **Anima** node to the visual Mesh diagram (currently only present in the bounded-contexts table).

## 1. Accessibility, contrast on text (Day + Dusk)

Audit result on `/aetherix`: the page itself is healthy, but several captions and footnotes layer an opacity modifier on top of already-muted tokens. In Dusk, `--on-surface-variant` is `38 14% 70%`, so `/70` and `/80` opacity drops it below AA on the warm-taupe surface. Same risk on `text-secondary/80` and `text-outline/60`.

Files and lines to harden:

- `src/pages/Atherix.tsx`
  - L340, L420, L591: `text-on-surface-variant/80` → `text-on-surface-variant` (footnotes / caveats already small, no need to fade further).
- `src/components/atherix/AetherixMeshDiagram.tsx`
  - L84: `text-outline/60` → `text-outline`.
  - L121: `text-on-surface-variant/70` → `text-on-surface-variant`.
- `src/components/atherix/AetherixArchitectureDiagram.tsx`
  - L54, L58: `text-on-surface-variant/80` → `text-on-surface-variant`.
  - L88: `text-secondary/80` → `text-secondary`.
  - L125: `text-on-surface-variant/70` → `text-on-surface-variant`.
- `src/components/atherix/AetherixLayerStack.tsx`
  - L145: `text-on-surface-variant/70` → `text-on-surface-variant`.

No new tokens, no design overhaul. Just remove opacity haircuts on text-bearing tokens. Borders and decorative icon opacities are kept as-is (they are non-text).

Verification: Playwright screenshot of `/aetherix` in Day mode and Dusk mode (`html[data-mood="dusk"]`), checked at sections 02 (memory caveat), 05 (Mesh caption), 07 (performance caveat). Visual confirmation that all captions read clearly on both surfaces.

## 2. Anima added to the Mesh diagram

`AetherixMeshDiagram` already lists Anima in the bounded-contexts table but omits it from the schematic. Add it as a peer node so the visual matches the narrative.

Layout intent (no new component, just edits inside `AetherixMeshDiagram.tsx`):

```text
Desktop (lg+):

  [ Tacet         ]         ┌──────────────────┐
  [ Orchestrator  ] ──►     │   Aetherix       │ ──► [ Manager · WhatsApp ]
  [ Anima         ]         │   F&B execution  │
                            └────────┬─────────┘
                                     ┆
                            [ HiveMemory ] (dashed, side input)

Mobile (<lg):

  ┌────────────┬──────────────┐
  │   Tacet    │ Orchestrator │
  ├────────────┴──────────────┤
  │          Anima            │   ← new row, full width, Shipped chip
  └───────────────────────────┘
              ▼
        [ Aetherix ]
        [ HiveMemory ]
              ▼
        [ Manager · WhatsApp ]
```

Details:
- Anima reuses the existing `NodeCard` with `sub="Guest Cognition"`.
- A small "Shipped" chip (same style as the table `statusTone="shipped"`) is added below the Anima card so the reader sees that Anima is not vapor.
- Tacet and Orchestrator keep their "Phase 3" sub-label visual weight unchanged.
- Caption at the bottom ("Aetherix executes. It does not orchestrate.") stays.

## Scope guardrails

- Frontend / presentation only.
- No copy changes beyond adding the "Shipped" mini-chip under Anima.
- No token edits in `index.css`, no new CSS utilities.
- Em-dash policy respected.

## Files touched

- `src/pages/Atherix.tsx` (3 className edits)
- `src/components/atherix/AetherixMeshDiagram.tsx` (add Anima node, desktop + mobile)
- `src/components/atherix/AetherixArchitectureDiagram.tsx` (4 className edits)
- `src/components/atherix/AetherixLayerStack.tsx` (1 className edit)

## Verification

- `rg "on-surface-variant/(7|8)0|text-secondary/80|text-outline/60" src/pages/Atherix.tsx src/components/atherix` returns 0.
- Playwright: screenshot `/aetherix` Day + Dusk at 1280×1800, verify Mesh shows 3 sibling nodes on the left (Tacet, Orchestrator, Anima) and that section captions are legible.
- Console clean, no layout regressions on mobile (375 px).
