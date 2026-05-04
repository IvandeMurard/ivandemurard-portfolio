CREATE TABLE public.link_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  kind TEXT NOT NULL,
  page TEXT,
  referrer TEXT,
  session_id TEXT
);

CREATE INDEX idx_link_clicks_created_at ON public.link_clicks (created_at DESC);
CREATE INDEX idx_link_clicks_kind ON public.link_clicks (kind);

ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous visitors) can insert click events. No reads from client.
CREATE POLICY "Anyone can insert link clicks"
  ON public.link_clicks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
