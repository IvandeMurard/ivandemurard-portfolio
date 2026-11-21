-- Listen: two measurement kinds (with the source of the reading, no content), a private bucket for cached audio,
-- and a content-free usage table for the per-session and daily caps. Same pattern as 0009 for the kinds.
ALTER TABLE public.rose_events DROP CONSTRAINT IF EXISTS rose_events_kind_check;
ALTER TABLE public.rose_events ADD CONSTRAINT rose_events_kind_check CHECK (kind IN (
  'opened', 'chip', 'question', 'followup', 'booking_proposed', 'booking_clicked',
  'rose_request_started', 'rose_answer_completed', 'rose_answer_failed', 'rose_link_clicked', 'rose_conversation_cleared',
  'empty_retry', 'history_rejected',
  'listen', 'listen_complete'
));

ALTER TABLE public.rose_events ADD COLUMN IF NOT EXISTS listen_source text;
ALTER TABLE public.rose_events DROP CONSTRAINT IF EXISTS rose_events_listen_source_check;
ALTER TABLE public.rose_events ADD CONSTRAINT rose_events_listen_source_check CHECK (listen_source IS NULL OR listen_source IN ('summary', 'answer'));

CREATE TABLE IF NOT EXISTS public.rose_listen_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  chars integer NOT NULL DEFAULT 0,
  cached boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS rose_listen_usage_session_idx ON public.rose_listen_usage (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS rose_listen_usage_created_idx ON public.rose_listen_usage (created_at DESC);
GRANT ALL ON public.rose_listen_usage TO service_role;
ALTER TABLE public.rose_listen_usage ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.rose_listen_usage IS 'Listen caps: session id, time, characters sent. No text. Service role only.';

CREATE EXTENSION IF NOT EXISTS pg_cron;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-old-rose-listen-usage') THEN
    PERFORM cron.unschedule('purge-old-rose-listen-usage');
  END IF;
END
$$;
SELECT cron.schedule('purge-old-rose-listen-usage', '0 3 * * *', $$DELETE FROM public.rose_listen_usage WHERE created_at < now() - interval '7 days'$$);

-- Private: the function reads and writes with the service role and hands out signed links.
INSERT INTO storage.buckets (id, name, public) VALUES ('rose-listen', 'rose-listen', false) ON CONFLICT (id) DO NOTHING;

-- Retention of the cached audio is not done here: rose-listen deletes expired objects of this bucket through the Storage API
-- (see _shared/listen-core.ts, purgeExpiredListenCache). Nothing in the database does it.
