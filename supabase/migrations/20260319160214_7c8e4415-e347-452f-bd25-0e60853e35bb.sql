
-- CMS page content (Home, About)
CREATE TABLE public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on cms_pages" ON public.cms_pages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public write on cms_pages" ON public.cms_pages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Case studies
CREATE TABLE public.cms_case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  hero_color text NOT NULL DEFAULT '24 80% 55%',
  tags text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on cms_case_studies" ON public.cms_case_studies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public write on cms_case_studies" ON public.cms_case_studies FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Case study sections (drag-and-drop reorderable)
CREATE TABLE public.cms_case_study_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id uuid REFERENCES public.cms_case_studies(id) ON DELETE CASCADE NOT NULL,
  section_type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_case_study_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on cms_case_study_sections" ON public.cms_case_study_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public write on cms_case_study_sections" ON public.cms_case_study_sections FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
