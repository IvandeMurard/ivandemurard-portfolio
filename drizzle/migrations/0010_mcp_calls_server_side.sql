-- Server-side MCP call counter. One row per tool call: the tool and the time, nothing else.
-- Only the service role writes or reads. No policy exists for anon or authenticated, so RLS denies them.
CREATE TABLE public.mcp_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  tool text NOT NULL CHECK (tool IN ('list_case_studies','get_case_study','get_about','list_journal_entries','get_journal_entry')),
  ok boolean NOT NULL
);
ALTER TABLE public.mcp_calls ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mcp_calls FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.mcp_calls TO service_role;
CREATE INDEX mcp_calls_created_at_idx ON public.mcp_calls (created_at);

-- The legacy table is kept, but nobody outside the service role can write to it.
REVOKE INSERT, UPDATE, DELETE ON public.mcp_events FROM PUBLIC, anon, authenticated;
COMMENT ON TABLE public.mcp_events IS 'Legacy MCP counter, unverified (public callers could write to it). Not usage evidence. Superseded by mcp_calls.';
