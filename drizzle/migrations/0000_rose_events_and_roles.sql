CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE TABLE public.rose_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  path text NOT NULL,
  section_id text,
  kind text NOT NULL CHECK (kind IN ('opened','chip','question','followup','booking_proposed','booking_clicked')),
  label_or_question text,
  used_chip boolean NOT NULL DEFAULT false
);
GRANT SELECT ON public.rose_events TO authenticated;
GRANT ALL ON public.rose_events TO service_role;
ALTER TABLE public.rose_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read rose events" ON public.rose_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX rose_events_created_at_idx ON public.rose_events (created_at DESC);
CREATE INDEX rose_events_path_idx ON public.rose_events (path);

CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('purge-old-rose-events', '0 3 * * *', $$DELETE FROM public.rose_events WHERE created_at < now() - interval '90 days'$$);