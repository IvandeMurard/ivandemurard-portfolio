CREATE TABLE public.mcp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  tool text NOT NULL,
  slug text
);
GRANT ALL ON public.mcp_events TO service_role;
GRANT SELECT ON public.mcp_events TO authenticated;
ALTER TABLE public.mcp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read mcp events" ON public.mcp_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE INDEX mcp_events_created_at_idx ON public.mcp_events (created_at);

CREATE OR REPLACE FUNCTION public.log_mcp_call(_tool text, _slug text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _tool NOT IN ('list_case_studies','get_case_study','get_about','list_journal_entries','get_journal_entry') THEN RETURN; END IF;
  IF _slug IS NOT NULL AND (_slug !~ '^[a-z0-9-]{1,80}$') THEN _slug := NULL; END IF;
  IF (SELECT count(*) FROM public.mcp_events WHERE created_at > now() - interval '1 minute') >= 300 THEN RETURN; END IF;
  INSERT INTO public.mcp_events (tool, slug) VALUES (_tool, _slug);
END $$;
REVOKE ALL ON FUNCTION public.log_mcp_call(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_mcp_call(text, text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_mcp_metrics(days_window integer DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'Admin access required' USING ERRCODE='42501'; END IF;
  IF days_window NOT IN (7,30,90) THEN RAISE EXCEPTION 'Window must be 7, 30 or 90 days' USING ERRCODE='22023'; END IF;
  WITH e AS (SELECT * FROM public.mcp_events WHERE created_at >= now() - make_interval(days => days_window))
  SELECT jsonb_build_object(
    'total', (SELECT count(*) FROM e),
    'per_tool', coalesce((SELECT jsonb_agg(x) FROM (SELECT tool AS label, count(*) AS count FROM e GROUP BY tool ORDER BY count(*) DESC) x), '[]'::jsonb),
    'per_slug', coalesce((SELECT jsonb_agg(x) FROM (SELECT slug AS label, count(*) AS count FROM e WHERE slug IS NOT NULL GROUP BY slug ORDER BY count(*) DESC LIMIT 20) x), '[]'::jsonb),
    'per_day', coalesce((SELECT jsonb_agg(x) FROM (SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS label, count(*) AS count FROM e GROUP BY 1 ORDER BY 1 DESC) x), '[]'::jsonb)
  ) INTO result;
  RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.get_mcp_metrics(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_mcp_metrics(integer) TO authenticated;

SELECT cron.schedule('purge-old-mcp-events', '10 3 * * *', $$DELETE FROM public.mcp_events WHERE created_at < now() - interval '90 days'$$);