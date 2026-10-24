REVOKE INSERT ON public.rose_sessions FROM anon, authenticated;
DROP POLICY IF EXISTS "Anyone can insert a bounded rose session" ON public.rose_sessions;
COMMENT ON TABLE public.rose_sessions IS 'DEPRECATED: booking clicks no longer store transcripts; historical rows purged after 90 days.';
SELECT cron.schedule('purge-old-rose-sessions', '0 3 * * *', $$DELETE FROM public.rose_sessions WHERE created_at < now() - interval '90 days'$$);