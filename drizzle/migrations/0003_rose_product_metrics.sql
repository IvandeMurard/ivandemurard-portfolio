ALTER TABLE public.rose_events ADD COLUMN IF NOT EXISTS request_id text, ADD COLUMN IF NOT EXISTS target_path text, ADD COLUMN IF NOT EXISTS booking_source text;
CREATE UNIQUE INDEX IF NOT EXISTS rose_events_request_dedupe ON public.rose_events(session_id, kind, request_id) WHERE request_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS rose_events_window ON public.rose_events(created_at);
CREATE OR REPLACE FUNCTION public.limit_rose_events() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN
PERFORM pg_advisory_xact_lock(hashtext(NEW.session_id));
IF (SELECT count(*) FROM public.rose_events WHERE session_id=NEW.session_id AND created_at > now()-interval '1 hour') >= 120 THEN RAISE EXCEPTION 'session event limit' USING ERRCODE='P0001'; END IF;
RETURN NEW; END $$;
CREATE TRIGGER rose_event_session_limit BEFORE INSERT ON public.rose_events FOR EACH ROW EXECUTE FUNCTION public.limit_rose_events();
CREATE OR REPLACE FUNCTION public.get_rose_metrics(days_window integer DEFAULT 30) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
DECLARE result jsonb; measurement_from timestamptz := '2026-10-24T14:55:10Z';
BEGIN
IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'Admin access required' USING ERRCODE='42501'; END IF;
IF days_window NOT IN (7,30,90) THEN RAISE EXCEPTION 'Window must be 7, 30 or 90 days' USING ERRCODE='22023'; END IF;
WITH events AS (SELECT * FROM public.rose_events WHERE created_at >= greatest(now()-make_interval(days=>days_window), measurement_from)),
sessions AS (SELECT session_id, bool_or(kind='opened') opened, count(*) FILTER (WHERE kind IN ('question','chip','followup')) turns, bool_or(kind='rose_answer_completed') answered, bool_or(kind='rose_link_clicked') referenced, bool_or(kind='booking_proposed') proposed, bool_or(kind='booking_clicked') contacted, bool_or(kind='booking_clicked' AND booking_source='card') card_clicked FROM events GROUP BY session_id)
SELECT jsonb_build_object(
'measurement_from',measurement_from,'window_days',days_window,
'opened',(SELECT count(*) FROM sessions WHERE opened),
'activated',(SELECT count(*) FROM sessions WHERE opened AND turns>0),
'question_sessions',(SELECT count(*) FROM sessions WHERE turns>0),
'continued',(SELECT count(*) FROM sessions WHERE turns>=2),
'answered_sessions',(SELECT count(*) FROM sessions WHERE answered),
'reference_sessions',(SELECT count(*) FROM sessions WHERE answered AND referenced),
'contact_sessions',(SELECT count(*) FROM sessions WHERE turns>0 AND contacted),
'proposed_sessions',(SELECT count(*) FROM sessions WHERE turns>0 AND proposed),
'card_clicked_sessions',(SELECT count(*) FROM sessions WHERE proposed AND card_clicked),
'card_proposed_sessions',(SELECT count(*) FROM sessions WHERE proposed),
'submitted',(SELECT count(*) FROM events WHERE kind='rose_request_started'),
'completed',(SELECT count(*) FROM events WHERE kind='rose_answer_completed'),
'failed',(SELECT count(*) FROM events WHERE kind='rose_answer_failed'),
'reference_clicks',(SELECT count(*) FROM events WHERE kind='rose_link_clicked'),
'destinations',coalesce((SELECT jsonb_agg(x) FROM (SELECT target_path AS label,count(*) AS count FROM events WHERE kind='rose_link_clicked' AND target_path IS NOT NULL GROUP BY target_path ORDER BY count(*) DESC LIMIT 20) x),'[]'::jsonb),
'per_page',coalesce((SELECT jsonb_agg(x) FROM (SELECT path AS label,count(*) AS count FROM events WHERE kind IN ('question','chip','followup') GROUP BY path ORDER BY count(*) DESC LIMIT 20) x),'[]'::jsonb)
) INTO result;
RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.get_rose_metrics(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_rose_metrics(integer) TO authenticated;
COMMENT ON FUNCTION public.get_rose_metrics(integer) IS 'Admin-only Rose product aggregates. Historical pre-P4 events excluded; no question text returned.';