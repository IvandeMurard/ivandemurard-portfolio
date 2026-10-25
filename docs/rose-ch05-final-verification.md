# Chapter 05 final refinement, 25 October 2026

## Changes
- `src/components/rose/RoseLaterChapters.tsx`: only Chapter 05 changed. Heading aligns with the adjacent max-w-6xl chapter container; evidence uses max-w-7xl. The 320px desktop margin begins 16px beyond the centered 560px dock. Columns and sticky positioning start at 1280px, sticky only above 840px viewport height. Smaller screens stack the invitation after the evidence.
- Invitation now opens the existing Rose with `rose:open`, without submitting a question or clearing history. The curiosity/confusion distinction lives in the third evidence row; the margin keeps one memorable statement and one action.
- `src/test/roseLearning.test.tsx`: regression asserts one open event and zero predefined-question events.
- `AGENTS.md`: records the lab handoff and dock-clearance contract.
- `roadmap.md`: tracks verification and the separate future response-level feedback dependency.

## Verification
- `bunx vitest run`: 86/86 tests pass. Preview log: build OK.
- `python3 /tmp/browser/rose-ch05/check_chapter.py`: 1280x1800, 1440x1800, 1140x768, 1280x720, 800x1000 and 390x844, each Day/Dusk. No horizontal overflow or runtime errors. Normal and reduced-motion preferences exercised; mobile touch context exercised.
- Desktop margin has 16px horizontal clearance from the dock in collapsed, expanded and simulated maximum-height conversation states, including scroll checks. Sticky is disabled on short desktop, tablet and mobile.
- Real dock opens and focuses its input without a chat request. Local synthetic answer survives close/reopen; keyboard Enter opens and focuses input; submitted request retains `/rose-design-lab` page context.
- All chat and event traffic intercepted locally. No real visitor data, model calls, booking notifications or database writes.
- Screenshots: `/tmp/browser/rose-ch05/{width}-{height}-{theme}-{collapsed|expanded}.png`; six-view review: `/tmp/browser/rose-ch05/review.png`.

## Limits and scope
- On stacked tablet/mobile layouts, the existing expanded conversation intentionally overlays the underlying page. It can be closed to resume reading; the collapsed dock does not obstruct the invitation in the tested position. The sticky-margin defect is eliminated, not the existing overlay interaction redesigned.
- Live model answers, real-device touch and screen-reader output were not retested. Continuity used an intercepted synthetic response, not a production conversation.
- Response-level feedback remains a separate future workstream. No feedback collection, storage or submission is available or promised here.
- Chapters 01 to 04, Chapter 06, closing, Rose source, prompts, memory, booking, analytics, server behavior, public mirrors and navigation unchanged. Nothing published or deployed.