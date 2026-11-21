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

-- Cache retention: objects of the rose-listen bucket are purged after 90 days, like the questions.
-- A plain DELETE on storage.objects would only drop the row and leave the file in the backing store (Supabase: delete
-- objects through the Storage API, never in SQL), so the "kept for 90 days" on /privacy would not be true. The job
-- therefore asks the Storage API to delete each expired object, through pg_net. It needs two Vault secrets that
-- Ivan creates once (see the PR): `project_url` and `service_role_key`. The key never appears in a file. If a secret
-- is missing the function raises, so the failure shows in cron.job_run_details instead of passing silently.
-- A purged text is simply paid again the next time it is asked.
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION public.purge_rose_listen_cache() RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  base_url text := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1);
  api_key text := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1);
  expired integer := 0;
  o record;
BEGIN
  IF base_url IS NULL OR api_key IS NULL THEN
    RAISE EXCEPTION 'Vault secrets project_url and service_role_key are required to purge the rose-listen bucket';
  END IF;
  FOR o IN SELECT name FROM storage.objects WHERE bucket_id = 'rose-listen' AND created_at < now() - interval '90 days' LOOP
    PERFORM net.http_delete(
      url := rtrim(base_url, '/') || '/storage/v1/object/rose-listen/' || o.name,
      headers := jsonb_build_object('Authorization', 'Bearer ' || api_key)
    );
    expired := expired + 1;
  END LOOP;
  RETURN expired;
END
$$;
REVOKE ALL ON FUNCTION public.purge_rose_listen_cache() FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-old-rose-listen-cache') THEN
    PERFORM cron.unschedule('purge-old-rose-listen-cache');
  END IF;
END
$$;
SELECT cron.schedule('purge-old-rose-listen-cache', '0 3 * * *', $$SELECT public.purge_rose_listen_cache()$$);
