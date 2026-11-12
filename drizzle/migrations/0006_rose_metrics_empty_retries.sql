-- get_rose_metrics: two more figures for the private Rose view, the empty-answer retries (kind 'empty_retry', 0005).
-- Same function as 0003, same arguments, same admin check and same grants; only 'empty_retries' (how many) and
-- 'empty_retries_recovered' (how many gave an answer the second time) are added. No question text is returned.
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
'empty_retries',(SELECT count(*) FROM events WHERE kind='empty_retry'),
'empty_retries_recovered',(SELECT count(*) FROM events WHERE kind='empty_retry' AND outcome='recovered'),
'destinations',coalesce((SELECT jsonb_agg(x) FROM (SELECT target_path AS label,count(*) AS count FROM events WHERE kind='rose_link_clicked' AND target_path IS NOT NULL GROUP BY target_path ORDER BY count(*) DESC LIMIT 20) x),'[]'::jsonb),
'per_page',coalesce((SELECT jsonb_agg(x) FROM (SELECT path AS label,count(*) AS count FROM events WHERE kind IN ('question','chip','followup') GROUP BY path ORDER BY count(*) DESC LIMIT 20) x),'[]'::jsonb)
) INTO result;
RETURN result;
END $$;
