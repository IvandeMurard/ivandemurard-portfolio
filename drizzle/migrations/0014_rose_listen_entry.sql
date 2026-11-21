-- Listen component: where a reading was started from. A closed list like listen_source, no content.
-- row = the ListenRow on a page, contents = the "On this page" line, index_card = a badge on an index card,
-- dock_starter = the starter question in the dock, answer = the Listen button under one of Rose's answers.
ALTER TABLE public.rose_events ADD COLUMN IF NOT EXISTS listen_entry text;
ALTER TABLE public.rose_events DROP CONSTRAINT IF EXISTS rose_events_listen_entry_check;
ALTER TABLE public.rose_events ADD CONSTRAINT rose_events_listen_entry_check CHECK (listen_entry IS NULL OR listen_entry IN ('row', 'contents', 'index_card', 'dock_starter', 'answer'));
