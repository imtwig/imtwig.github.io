import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { caseStudiesData, type CaseStudyData } from "@/data/caseStudies";

// ─── Page Content ───
export interface CmsPageContent {
  [key: string]: any;
}

export function useCmsPage(pageKey: string) {
  return useQuery({
    queryKey: ["cms-page", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_pages")
        .select("*")
        .eq("page_key", pageKey)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveCmsPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ pageKey, content }: { pageKey: string; content: CmsPageContent }) => {
      const { data, error } = await supabase
        .from("cms_pages")
        .upsert({ page_key: pageKey, content, updated_at: new Date().toISOString() }, { onConflict: "page_key" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["cms-page", vars.pageKey] });
    },
  });
}

// ─── Case Studies ───
export interface CmsCaseStudy {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  hero_color: string;
  tags: string[];
  sort_order: number;
  published: boolean;
  card_image: string;
  hero_images: string[];
  created_at: string;
  updated_at: string;
}

export interface CmsSection {
  id: string;
  case_study_id: string;
  section_type: string;
  content: any;
  sort_order: number;
}

export function useCmsCaseStudies() {
  return useQuery({
    queryKey: ["cms-case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_case_studies")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as CmsCaseStudy[];
    },
  });
}

export function useCmsCaseStudy(id: string | undefined) {
  return useQuery({
    queryKey: ["cms-case-study", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_case_studies")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as CmsCaseStudy;
    },
  });
}

export function useSaveCaseStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (study: Partial<CmsCaseStudy> & { id?: string }) => {
      if (study.id) {
        const { data, error } = await supabase
          .from("cms_case_studies")
          .update({ ...study, updated_at: new Date().toISOString() })
          .eq("id", study.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("cms_case_studies")
          .insert(study as any)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cms-case-studies"] });
      qc.invalidateQueries({ queryKey: ["cms-case-study"] });
    },
  });
}

export function useDeleteCaseStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_case_studies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cms-case-studies"] });
    },
  });
}

// ─── Sections ───
export function useCmsSections(caseStudyId: string | undefined) {
  return useQuery({
    queryKey: ["cms-sections", caseStudyId],
    enabled: !!caseStudyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_case_study_sections")
        .select("*")
        .eq("case_study_id", caseStudyId!)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as CmsSection[];
    },
  });
}

export function useSaveSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (section: Partial<CmsSection> & { case_study_id: string }) => {
      if (section.id) {
        const { data, error } = await supabase
          .from("cms_case_study_sections")
          .update({ section_type: section.section_type, content: section.content, sort_order: section.sort_order })
          .eq("id", section.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("cms_case_study_sections")
          .insert(section as any)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["cms-sections", vars.case_study_id] });
    },
  });
}

export function useDeleteSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, caseStudyId }: { id: string; caseStudyId: string }) => {
      const { error } = await supabase.from("cms_case_study_sections").delete().eq("id", id);
      if (error) throw error;
      return caseStudyId;
    },
    onSuccess: (caseStudyId) => {
      qc.invalidateQueries({ queryKey: ["cms-sections", caseStudyId] });
    },
  });
}

export function useReorderSections() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sections, caseStudyId }: { sections: { id: string; sort_order: number }[]; caseStudyId: string }) => {
      for (const s of sections) {
        const { error } = await supabase
          .from("cms_case_study_sections")
          .update({ sort_order: s.sort_order })
          .eq("id", s.id);
        if (error) throw error;
      }
      return caseStudyId;
    },
    onSuccess: (caseStudyId) => {
      qc.invalidateQueries({ queryKey: ["cms-sections", caseStudyId] });
    },
  });
}

// ─── Public data hooks (for front-end pages) ───
export function usePublicCaseStudies() {
  return useQuery({
    queryKey: ["public-case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_case_studies")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      
      // If no CMS data, fall back to static
      if (!data || data.length === 0) {
        return Object.values(caseStudiesData).map((s, i) => ({
          slug: s.slug,
          title: s.title,
          description: s.description,
          category: s.category,
          sort_order: i,
        }));
      }
      return data as CmsCaseStudy[];
    },
  });
}

export function usePublicCaseStudy(slug: string | undefined) {
  return useQuery({
    queryKey: ["public-case-study", slug],
    enabled: !!slug,
    queryFn: async () => {
      // Try CMS first
      const { data: study } = await supabase
        .from("cms_case_studies")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .maybeSingle();
      
      if (study) {
        const { data: sections } = await supabase
          .from("cms_case_study_sections")
          .select("*")
          .eq("case_study_id", study.id)
          .order("sort_order", { ascending: true });
        
        return { study: study as CmsCaseStudy, sections: (sections || []) as CmsSection[], source: "cms" as const };
      }
      
      // Fall back to static data
      const staticStudy = caseStudiesData[slug!];
      if (!staticStudy) return null;
      return { study: null, sections: [], source: "static" as const, staticData: staticStudy };
    },
  });
}
