# Rose P4 measurement and privacy review

Version 1, 24 October 2026. Only `/admin/rose` is the product dashboard. No external analytics, profile matching, micro-feedback, or general traffic reporting.

## Measurement dictionary

The window is 7, 30 or 90 days, clipped to instrumentation start (24 October 2026, 14:55:10 UTC). Earlier data may include test traffic and incomplete outcome tracking, so it is not used as a clean baseline. Sessions are random browser-tab identifiers, not people. Session membership is evaluated only within the selected window. Rates below 20 denominator observations are withheld as a presentation precaution, not a confidence estimate.

| Measure | Numerator / denominator |
| --- | --- |
| Activation | Opened sessions with at least one accepted visitor turn / opened sessions |
| Continuation | Sessions with at least two visitor turns / sessions with at least one |
| Evidence navigation | Completed-answer sessions with a known portfolio-reference click / completed-answer sessions |
| Contact intent | Question sessions with a booking-link click / question sessions |
| Proposal rate | Question sessions with a booking proposal / question sessions |
| Card click rate | Proposal sessions with a card click / proposal sessions, direct booking chips excluded |
| Request failure | Explicitly failed, disconnected, empty or aborted requests / started requests |

Visitor turns are `question`, `chip`, `followup`. No turn is counted on hydration. Outcome events are owned by the module-level Chat callbacks, not React status effects, and scoped to the active chat generation so late cancellation callbacks cannot close a new request. Proposal logging runs once at request completion. Request IDs deduplicate same-kind deliveries in the database. Reference clicks are actions, not successful navigation or reading. Card clicks are not bookings; card attribution is session-level, not a specific proposal conversion. Missing terminal events (tab closed or network loss) remain unknown, never inferred successful. Ratios are telemetry descriptions, not causal evidence or business value.

New events: `rose_request_started`, `rose_answer_completed`, `rose_answer_failed`, `rose_link_clicked`, `rose_conversation_cleared`. Payloads contain session ID, originating route, event kind, optional random request ID or validated destination path only. The server rejects text-bearing measurement events. Destinations exclude query strings and fragments. Existing questions remain pattern-masked on the server, with their existing limitations. No new question/answer fields or transcript store.

## Privacy impact assessment

- Purpose: evaluate portfolio discovery, technical reliability and intentional contact, independently of answer-quality grading.
- Linkability: Rose's random `rose_session` remains tab-local and separate from general `idm_session`. Cross-page linking already existed; there is no cross-device identification or new account linkage.
- Retention: existing daily 90-day purge of `rose_events` and deprecated `rose_sessions` is unchanged. Clear deletes tab-local conversation, not already logged events.
- Access: aggregate RPC checks the protected admin role server-side, rejects other accounts and invalid windows, has no anonymous execute grant, and returns no question text. Recent questions are separately fetched only after the admin explicitly opens that section.
- Test isolation: development and all non-public hosts are suppressed client-side. The event endpoint rejects non-public origins. Tests intercept measurement requests and never open the recent-questions section.
- Abuse: bounded payloads, destination allowlist, per-session 120-events/hour trigger, request deduplication. Origin checks are not authentication, session rotation can bypass this bound, and distributed spam remains a residual limitation. No IP-based rate limiting or fingerprinting is introduced.
- Booking: Cal.com receives neither chat text nor internal identifiers. No notification endpoint is invoked.
- Legal boundary: pseudonymous session events are not automatically anonymous under GDPR. Consent exemption and lawful basis cannot be established solely from implementation. A qualified privacy review of the existing question logging and audience-measurement model remains required before claiming regulatory compliance. This work does not assert consent exemption.
- Provider boundary: model requests and hosting/network logs are outside these application event records; no claim is made that infrastructure never processes IP addresses or provider requests.

## Operational review

Weekly or when enough clean data exists: Observe → Diagnose → Hypothesis → One bounded change → Re-evaluate. Record observation, source, hypothesis, changed behavior, deterministic results, synthetic evidence and uncertainty. Do not automatically train on visitor questions or optimize for conversation length. Qualitative correctness, booking relevance, confirmed meetings, satisfaction and professional outcomes are not inferred from click rates. Trends and targets wait for a clean baseline.