-- Page visit tracking table
CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  visitor_id text NOT NULL,
  user_agent text,
  referrer text,
  visited_at timestamptz NOT NULL DEFAULT now(),
  visit_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date
);

CREATE INDEX idx_page_visits_visited_at ON public.page_visits(visited_at);
CREATE INDEX idx_page_visits_visitor_id ON public.page_visits(visitor_id);
CREATE INDEX idx_page_visits_path ON public.page_visits(path);
-- Used to enforce one unique-visitor record per visitor per page per day
CREATE UNIQUE INDEX idx_page_visits_unique_daily
  ON public.page_visits(visitor_id, path, visit_date);

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Public site: anyone may insert a visit, no one may read individual rows from the client
CREATE POLICY "Anyone can record a visit"
  ON public.page_visits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT policy => only service_role (used by edge function) can read