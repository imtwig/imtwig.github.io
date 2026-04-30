import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Import } from "lucide-react";
import { useCmsCaseStudies, useSaveCaseStudy, useDeleteCaseStudy, useSaveSection } from "@/hooks/useCmsData";
import { caseStudiesData } from "@/data/caseStudies";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  onEdit: (id: string) => void;
}

const CaseStudiesManager = ({ onEdit }: Props) => {
  const { data: studies, isLoading } = useCmsCaseStudies();
  const saveCaseStudy = useSaveCaseStudy();
  const deleteCaseStudy = useDeleteCaseStudy();
  const saveSection = useSaveSection();
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = () => {
    if (!newSlug || !newTitle) return;
    saveCaseStudy.mutate(
      {
        slug: newSlug,
        title: newTitle,
        description: "",
        category: "",
        hero_color: "24 80% 55%",
        tags: [],
        sort_order: (studies?.length || 0),
        published: false,
      },
      {
        onSuccess: (data: any) => {
          toast.success("Case study created!");
          setNewSlug("");
          setNewTitle("");
          setDialogOpen(false);
          onEdit(data.id);
        },
      }
    );
  };

  const handleImportAll = async () => {
    for (const [slug, study] of Object.entries(caseStudiesData)) {
      // Check if already imported
      if (studies?.some((s) => s.slug === slug)) continue;
      
      const result = await saveCaseStudy.mutateAsync({
        slug: study.slug,
        title: study.title,
        description: study.description,
        category: study.category,
        hero_color: study.heroColor,
        tags: study.tags,
        sort_order: Object.keys(caseStudiesData).indexOf(slug),
        published: true,
      });

      // Create sections
      const sectionTypes = [
        { type: "timeline", content: { items: study.timeline } },
        { type: "body_text", content: study.bodySection },
        { type: "stats", content: { items: study.stats } },
        { type: "reflections", content: { items: study.reflections } },
      ];

      for (let i = 0; i < sectionTypes.length; i++) {
        await saveSection.mutateAsync({
          case_study_id: (result as any).id,
          section_type: sectionTypes[i].type,
          content: sectionTypes[i].content,
          sort_order: i,
        });
      }
    }
    toast.success("Imported all static case studies!");
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    deleteCaseStudy.mutate(id, { onSuccess: () => toast.success("Deleted!") });
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold font-serif">Case Studies</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportAll}>
            <Import className="w-4 h-4 mr-2" /> Import Static Data
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Case Study</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Case Study</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="My New Project" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Slug (URL-friendly)</label>
                  <Input
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    placeholder="my-new-project"
                  />
                </div>
                <Button onClick={handleCreate} disabled={!newSlug || !newTitle} className="w-full">
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {(!studies || studies.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="mb-4">No case studies in the CMS yet.</p>
            <p className="text-sm">Click "Import Static Data" to import your existing case studies, or create a new one.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {studies?.map((study) => (
          <Card key={study.id} className="hover:shadow-md transition-shadow">
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg"
                  style={{ backgroundColor: `hsl(${study.hero_color})` }}
                />
                <div>
                  <h3 className="font-semibold">{study.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    /{study.slug} · {study.category || "No category"} ·{" "}
                    <span className={study.published ? "text-green-600" : "text-muted-foreground"}>
                      {study.published ? "Published" : "Draft"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(study.id)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(study.id, study.title)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CaseStudiesManager;
