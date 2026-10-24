# Rose prototype C refinement, 24 October 2026

## Scope and exact changes
- `src/pages/RoseDesignLab.tsx`: approved hero subtitle, authored idea/first-direction/change narrative, narrower evidence claims, clearly illustrative July conversation, synchronized transition integration and design-system Ask Rose control. Concepts A and B remain available.
- `src/components/rose/RoseHistoryTransition.tsx`: shared period state, 0°/80° compass, historical starters with ghosted July layer, coupled explanation, keyboard tabs and reduced motion.
- `src/test/roseHistoryTransition.test.tsx`: two regression tests for coupled period/direction and keyboard selection/focus.
- `AGENTS.md`: rule documenting shared period ownership and exclusion from public content generation.
- `roadmap.md`: scoped task list.
- `docs/rose-prototype-c-verification.md`: this report.
- Project memory: approved editorial direction and preview-only boundaries recorded.

## Verified
- `bunx vitest run src/test/roseHistoryTransition.test.tsx src/test/roseSession.test.ts src/test/roseMarkdown.test.tsx src/test/prerenderDomIntegrity.test.ts`: 38 tests passed.
- Final `bunx vitest run src/test/roseHistoryTransition.test.tsx`: 2 passed.
- `python3 /tmp/browser/rose-refinement/check_prototype.py`: desktop 1280×1800, current viewport 899×768, mobile 390×844, each Day and Dusk. Both periods, arrow keys, selected state and focus passed. No horizontal overflow or page runtime errors observed.
- Reduced-motion comparison preserves August selection with an effectively instant transition (global CSS sets 0.01ms rather than exactly 0ms).
- Controlled real Rose handoff: one request, published-content answer displayed with project links, close/reopen retained the answer. All Rose event requests intercepted locally; no booking clicked or notification triggered. This checks one real answer, not historical self-explanation.
- Latest automatic preview compilation: build OK.
- Independent read-only history audit checked July commit `51245fc`, August 7 archived plan/implementation and August 10 `b236ff3`. Copy distinguishes intended behavior from visitor outcomes and page context from complete page contents.

## Screenshots
Opening and July/August screenshots for all three sizes and both themes are under `/tmp/browser/rose-refinement/`; real answer is `rose-real-answer.png`. Reviewed desktop opening/transition, current-viewport Dusk opening, mobile Day opening/Dusk transition and real answer.

## Boundaries and remaining uncertainty
No publication, production prompt changes, analytics changes, booking changes, sitemap updates or generated public-document changes. Public deployment was not checked because this is an unpublished internal prototype. Full Rose historical knowledge, remaining chapters and voice remain outside scope. Screen-reader speech and exhaustive model-answer quality were not tested.
The fixed site header/dock may overlay portions of the long mobile figure while scrolling, but period controls are reachable and content can scroll clear; no essential action was blocked in the checks.
No unresolved editorial decision is required to review this iteration.