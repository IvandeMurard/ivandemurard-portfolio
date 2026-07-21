
CREATE TABLE public.rose_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  intent text,
  transcript jsonb NOT NULL DEFAULT '[]'::jsonb,
  booking_clicked boolean NOT NULL DEFAULT false,
  session_id text,
  page text,
  referrer text
);

GRANT INSERT ON public.rose_sessions TO anon, authenticated;
GRANT ALL ON public.rose_sessions TO service_role;

ALTER TABLE public.rose_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a bounded rose session"
  ON public.rose_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (intent IS NULL OR length(intent) <= 40)
    AND jsonb_typeof(transcript) = 'array'
    AND jsonb_array_length(transcript) <= 20
    AND (session_id IS NULL OR length(session_id) <= 64)
    AND (page IS NULL OR length(page) <= 512)
    AND (referrer IS NULL OR length(referrer) <= 2048)
  );
