ALTER TABLE public.rose_events DROP CONSTRAINT IF EXISTS rose_events_kind_check;
ALTER TABLE public.rose_events ADD CONSTRAINT rose_events_kind_check CHECK (kind IN (
  'opened', 'chip', 'question', 'followup', 'booking_proposed', 'booking_clicked',
  'rose_request_started', 'rose_answer_completed', 'rose_answer_failed', 'rose_link_clicked', 'rose_conversation_cleared',
  'empty_retry', 'history_rejected'
));