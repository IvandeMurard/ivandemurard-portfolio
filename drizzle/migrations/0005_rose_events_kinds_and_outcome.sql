-- Rose events: the closed list of kinds now matches what the site and rose-chat send, and an event can carry an outcome.
--
-- Until now the table accepted only the six kinds of 0000. The dock has sent rose_request_started,
-- rose_answer_completed, rose_answer_failed, rose_link_clicked and rose_conversation_cleared since 0003, and each
-- insert was refused by this check (no row of those kinds exists). 'empty_retry' is new: rose-chat asks the model a
-- second time when the first answer has no text, and records whether the second call recovered ('recovered') or not
-- ('still_empty'). Content-free: kind, outcome, path, session. Purely additive; nothing is dropped or rewritten.
BEGIN;

ALTER TABLE public.rose_events DROP CONSTRAINT IF EXISTS rose_events_kind_check;
ALTER TABLE public.rose_events ADD CONSTRAINT rose_events_kind_check CHECK (kind IN (
  'opened', 'chip', 'question', 'followup', 'booking_proposed', 'booking_clicked',
  'rose_request_started', 'rose_answer_completed', 'rose_answer_failed', 'rose_link_clicked', 'rose_conversation_cleared',
  'empty_retry'
));

ALTER TABLE public.rose_events ADD COLUMN IF NOT EXISTS outcome text;
ALTER TABLE public.rose_events DROP CONSTRAINT IF EXISTS rose_events_outcome_check;
ALTER TABLE public.rose_events ADD CONSTRAINT rose_events_outcome_check CHECK (
  (kind = 'empty_retry' AND outcome IN ('recovered', 'still_empty')) OR (kind <> 'empty_retry' AND outcome IS NULL)
);

COMMIT;
