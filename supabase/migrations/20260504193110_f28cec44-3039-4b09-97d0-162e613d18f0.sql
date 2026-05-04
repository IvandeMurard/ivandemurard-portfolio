DROP POLICY "Anyone can insert link clicks" ON public.link_clicks;

CREATE POLICY "Anyone can insert valid link clicks"
  ON public.link_clicks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    kind IN ('project', 'contact', 'social', 'nav')
    AND length(label) BETWEEN 1 AND 120
    AND length(href) BETWEEN 1 AND 2048
    AND (page IS NULL OR length(page) <= 512)
    AND (referrer IS NULL OR length(referrer) <= 2048)
    AND (session_id IS NULL OR length(session_id) <= 64)
  );
