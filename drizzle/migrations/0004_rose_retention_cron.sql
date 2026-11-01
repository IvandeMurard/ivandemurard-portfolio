CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-old-rose-events') THEN
    PERFORM cron.unschedule('purge-old-rose-events');
  END IF;
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-old-rose-sessions') THEN
    PERFORM cron.unschedule('purge-old-rose-sessions');
  END IF;
END
$$;

SELECT cron.schedule('purge-old-rose-events', '0 3 * * *', $$DELETE FROM public.rose_events WHERE created_at < now() - interval '90 days'$$);
SELECT cron.schedule('purge-old-rose-sessions', '0 3 * * *', $$DELETE FROM public.rose_sessions WHERE created_at < now() - interval '90 days'$$);