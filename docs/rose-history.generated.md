<!-- Generated. Private review artifact, excluded from public content. v1 sha256:9af54bc6f76ea3324f1954c43996e6f460ba6849e88ee9bef6393ff108ad51b8 -->

Rose historical reference, v1. Repository evidence, not verified deployment parity. No measured visitor-value claim is established. Source paths and commit IDs are provenance, not public reading URLs. Do not invent a public Rose history page or link to the private reference.

Rose is the conversational guide embedded in Ivan de Murard's portfolio. She helps visitors question the published work, explore evidence and find relevant pages; a conversation with Ivan remains optional. The longer-term design explores a more self-referential, context-responsive reading experience, not a capability already delivered.

Current repository capabilities:
- Answer questions about the projects, Field Notes, CV and architecture published on the site.
- Use the page address, title and section heading the visitor is on to ground an answer.
- Load a Field Note on demand when the visitor is reading it or names it.
- Link to the relevant pages of the site and suggest follow-up questions.
- Show a booking card that opens Ivan's calendar, without sending the conversation.
- Keep the conversation across pages within one tab, and let the visitor clear it.

Limits:
- Rose receives page metadata per message and has no direct access to the full screen, cursor, scroll position, private browser state or arbitrary DOM.
- Rose does not inspect private repositories, execute visitor code, or modify website content in response to chat.
- Rose does not autonomously train on conversations or redesign her product. Product changes are made by people and must be grounded in documented authorship.
- The reviewed Rose evidence does not document visitor research establishing preferences or validating the July-to-August design change.
- The reviewed records do not establish visitor comprehension, satisfaction, reading outcomes, successful meetings or causal product value.

## launch (2026-07-21, implemented)
Rose launched as a chat dock with four intent starters (Product expertise, Technical profile, Culture fit, Just exploring). Her prompt aimed to help a visitor decide, within two or three exchanges, whether to book a call.
Provenance: 51245fc; src/components/rose/RoseDock.tsx; src/components/rose/RoseHistoryTransition.tsx

## booking-first-reading (date unverified, interpretation)
Ivan reconsidered beginning with a visitor-role or hiring qualification and chose to let questions about the work lead. This is a documented design interpretation, not a finding about what visitors actually wanted.
Provenance: .lovable/plan/rose-des-amorces-contextuelles-à-la-page-à-la-place-des-quat-2026-08-07.md
Unsupported wording: Visitors disliked the booking prompt.

## route-starters (2026-08-07, implemented)
Content pages received hand-written starters about the page being read. Generic intent starters stayed on pages without their own content.
Provenance: 286dae1; .lovable/plan/rose-des-amorces-contextuelles-à-la-page-à-la-place-des-quat-2026-08-07.md; src/content/rosePrompts.ts

## route-starters-refinement (2026-08-10, implemented)
Route matching was refined so exact routes take priority over prefix matches. This refined the already implemented contextual starters, rather than introducing them on August 10.
Provenance: 4fb55b4; src/content/rosePrompts.ts

## quiet-dock (2026-08-07, implemented)
At rest the dock became a translucent veil, returning to full contrast on hover, focus or use.
Provenance: 4efe2b8; .lovable/plan/rose-dock-discret-au-repos-plein-contraste-à-l-usage-2026-08-07.md; src/components/rose/RoseDock.tsx

## page-context (2026-08-10, implemented)
Rose started receiving the page address and the selected starter's intent. Booking stayed available instead of framing every answer. Section id and heading were added later; the exact commit is not identified.
Provenance: b236ff3; .lovable/plan/field-note-legibility-plus-rose-as-a-qualifying-agent-2026-08-10.md; supabase/functions/rose-chat/index.ts

## mcp-reference (2026-09-20, implemented)
Rose's system reference gained an explanation of the site's separate public, read-only portfolio MCP interface, so she could answer questions about how external agents access published content.
Provenance: 6cba2b5; .lovable/plan/footer-mcp-et-réponses-pédagogiques-de-rose-2026-09-20.md; supabase/functions/_shared/rose-context.ts; src/lib/mcp/index.ts

## booking-privacy (2026-10-24, implemented)
Opening the booking link navigates to Ivan's calendar and records a bounded click event. The booking link does not include the conversation or a summary; the deprecated transcript-notification endpoint responds with HTTP 410.
Provenance: 12c03fb; src/components/rose/RoseBookingCard.tsx; supabase/functions/rose-booking-notify/index.ts; src/test/roseBookingPrivacy.test.tsx

## question-logging (2026-10-24, implemented)
The site logs typed questions and selected chip labels with pattern-based email and phone masking, which is imperfect. Rose application event records do not include IP addresses or user agents, but providers and hosting may process separate network data. Generated answers are not saved in the current application event table; request-lifecycle events are content-free. Deprecated booking-transcript rows may remain until the scheduled 90-day purge. Access to Rose event records is restricted to the site admin.
Provenance: ccad61e; 475b2ed; supabase/functions/rose-event/index.ts; src/components/rose/roseEvents.ts; drizzle/migrations/0002_rose_sessions_retention.sql; src/pages/Privacy.tsx
Unsupported wording: Nothing you type is stored.

## dom-integrity (2026-10-24, implemented)
Nested buttons in a diagram corrupted pre-rendered pages and produced a phantom dock; they were removed and guarded by a regression test.
Provenance: 26daa5d; src/test/prerenderDomIntegrity.test.ts

## one-step (2026-10-24, implemented)
The backend is configured for one model step per request, with UI-display tools for follow-up questions and booking cards. Markdown and link rendering have separate client-side safeguards. These changes were intended to address duplicated answers; one-step execution is not a guarantee against every form of repetition.
Provenance: 6a63c1e; 6b2c26d; supabase/functions/rose-chat/index.ts; src/components/rose/roseMarkdown.tsx; src/components/rose/RoseDock.tsx

## session-memory (2026-10-24, implemented)
Chat history is kept in browser-tab sessionStorage across page navigation, expires after 60 minutes of inactivity and can be cleared. It is not persisted as a current server-side chat transcript. Some browsers may restore tab sessionStorage, and model-provider processing is a separate boundary.
Provenance: 467fa3b; src/components/rose/roseSession.ts; src/test/roseSession.test.ts

## measurement (2026-10-24, implemented)
The private admin page defines aggregates for Rose requests, completions, failures, evidence-link use and booking-link clicks, using tab-scoped event data separate from general site click-session data. These metrics do not establish visitor understanding or satisfaction.
Provenance: 9f0f721; src/pages/AdminRose.tsx; src/components/rose/roseMeasurement.ts; docs/rose-p4-measurement.md

## evaluation (2026-10-24, synthetic)
The October 24 risk-based release decision used a final sample of 15 synthetic model conversations, alongside other checks. Accepted limitations included one sample per scenario and several overlong answers. This supports only bounded test-case conclusions, not consistency across all visitors or demonstrated visitor value.
Provenance: 34f66a1; 1ff9a63; 4ce6b8a; scripts/rose-quality-check.ts; docs/rose-p5-verification.md; docs/rose-p5-results.json
Unsupported wording: Rose is proven to help visitors.

## design-lab (2026-10-24, lab)
An unlinked design-lab route was added for reviewing Rose's retrospective case study; its historical transition and later chapters are prototype UI, not evidence of shipped adaptive-reading capabilities. The route is excluded from standard discovery, but unlinked does not mean access-controlled.
Provenance: 2a6dd1b; fdb2388; src/pages/RoseDesignLab.tsx; src/components/rose/RoseLaterChapters.tsx

## feedback (date unverified, hypothesis)
Optional, response-level feedback after a real Rose answer is a proposed learning mechanism, not a deployed collection flow. An explicit submission, limited metadata, retention and privacy review remain design gates; prompting rules are undecided. A follow-up question alone cannot distinguish productive curiosity from confusion.
Provenance: fdb2388; docs/rose-progressive-feedback-spec.md
Unsupported wording: Rose asks for feedback after two answers.

## adaptive (date unverified, hypothesis)
Ivan is exploring adaptive, AI-mediated reading in which content could be located, annotated or explained in place, with voice as one potential modality. The Chapter 06 interaction is a scripted design demonstration; generative page adaptation and voice are not implemented capabilities.
Provenance: src/components/rose/RoseLaterChapters.tsx
