import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCmsCaseStudy,
  useCmsSections,
  useSaveCaseStudy,
  useSaveSection,
  useDeleteSection,
  useReorderSections,
  type CmsSection,
} from "@/hooks/useCmsData";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableSectionCard from "./SortableSectionCard";
import SectionContentEditor from "./SectionContentEditor";
import ImageUpload from "@/components/cms/ImageUpload";

const SECTION_TYPES = [
  { value: "timeline", label: "Timeline" },
  { value: "body_text", label: "Body Text + Image" },
  { value: "stats", label: "Statistics" },
  { value: "reflections", label: "Reflections" },
];

interface Props {
  studyId: string;
  onBack: () => void;
}

const CaseStudyEditor = ({ studyId, onBack }: Props) => {
  const { data: study, isLoading } = useCmsCaseStudy(studyId);
  const { data: sections, isLoading: sectionsLoading } = useCmsSections(studyId);
  const saveCaseStudy = useSaveCaseStudy();
  const saveSection = useSaveSection();
  const deleteSection = useDeleteSection();
  const reorderSections = useReorderSections();

  const [meta, setMeta] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    hero_color: "24 80% 55%",
    tags: [] as string[],
    published: false,
    card_image: "",
    hero_images: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [localSections, setLocalSections] = useState<CmsSection[]>([]);

  useEffect(() => {
    if (study) {
      setMeta({
        title: study.title,
        slug: study.slug,
        description: study.description,
        category: study.category,
        hero_color: study.hero_color,
        tags: study.tags || [],
        published: study.published,
        card_image: (study as any).card_image || "",
        hero_images: (study as any).hero_images || [],
      });
    }
  }, [study]);

  useEffect(() => {
    if (sections) setLocalSections(sections);
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSaveMeta = () => {
    saveCaseStudy.mutate(
      { id: studyId, ...meta },
      { onSuccess: () => toast.success("Saved!") }
    );
  };

  const handleAddSection = (type: string) => {
    const defaultContent: Record<string, any> = {
      timeline: { items: [{ title: "", description: "" }] },
      body_text: { eyebrow: "", header: "", body: "", image: "" },
      stats: { items: [{ value: 0, suffix: "", label: "" }] },
      reflections: { items: [""] },
    };
    saveSection.mutate(
      {
        case_study_id: studyId,
        section_type: type,
        content: defaultContent[type] || {},
        sort_order: localSections.length,
      },
      { onSuccess: () => toast.success("Section added!") }
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localSections.findIndex((s) => s.id === active.id);
    const newIndex = localSections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(localSections, oldIndex, newIndex);
    setLocalSections(reordered);

    reorderSections.mutate({
      caseStudyId: studyId,
      sections: reordered.map((s, i) => ({ id: s.id, sort_order: i })),
    });
  };

  const handleSaveSection = (section: CmsSection) => {
    saveSection.mutate(
      { id: section.id, case_study_id: studyId, section_type: section.section_type, content: section.content, sort_order: section.sort_order },
      { onSuccess: () => toast.success("Section saved!") }
    );
  };

  const handleDeleteSection = (id: string) => {
    if (!confirm("Delete this section?")) return;
    deleteSection.mutate(
      { id, caseStudyId: studyId },
      { onSuccess: () => toast.success("Section deleted!") }
    );
  };

  const handleAddTag = () => {
    if (tagInput && !meta.tags.includes(tagInput)) {
      setMeta((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput("");
    }
  };

  if (isLoading || sectionsLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-semibold font-serif flex-1">{meta.title || "New Case Study"}</h2>
        <Button onClick={handleSaveMeta} disabled={saveCaseStudy.isPending}>
          <Save className="w-4 h-4 mr-2" /> Save Meta
        </Button>
      </div>

      {/* Meta */}
      <Card>
        <CardHeader><CardTitle className="text-base">Case Study Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input value={meta.title} onChange={(e) => setMeta((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input value={meta.slug} onChange={(e) => setMeta((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Input value={meta.category} onChange={(e) => setMeta((p) => ({ ...p, category: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Hero Color (HSL)</label>
              <div className="flex gap-2">
                <Input value={meta.hero_color} onChange={(e) => setMeta((p) => ({ ...p, hero_color: e.target.value }))} />
                <div className="w-10 h-10 rounded-lg border" style={{ backgroundColor: `hsl(${meta.hero_color})` }} />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea value={meta.description} onChange={(e) => setMeta((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Card Image</label>
            <p className="text-xs text-muted-foreground mb-2">This image appears on the Case Studies listing page</p>
            <ImageUpload
              value={meta.card_image}
              onChange={(url) => setMeta((p) => ({ ...p, card_image: url }))}
              folder={`case-studies/${meta.slug || "new"}`}
              className="max-w-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Hero Banner Images (3 floating images)</label>
            <p className="text-xs text-muted-foreground mb-2">These images appear in the hero section of the case study detail page</p>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((idx) => (
                <ImageUpload
                  key={idx}
                  value={meta.hero_images[idx] || ""}
                  onChange={(url) => {
                    const newImages = [...meta.hero_images];
                    while (newImages.length <= idx) newImages.push("");
                    newImages[idx] = url;
                    setMeta((p) => ({ ...p, hero_images: newImages }));
                  }}
                  folder={`case-studies/${meta.slug || "new"}/hero`}
                  aspectRatio="aspect-[4/3]"
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {meta.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => setMeta((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))}>
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button variant="outline" onClick={handleAddTag}>Add</Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={meta.published} onCheckedChange={(v) => setMeta((p) => ({ ...p, published: v }))} />
            <label className="text-sm font-medium">Published</label>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold font-serif">Sections</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Section
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SECTION_TYPES.map((t) => (
                <DropdownMenuItem key={t.value} onClick={() => handleAddSection(t.value)}>
                  {t.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {localSections.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No sections yet. Click "Add Section" to start building your case study.
            </CardContent>
          </Card>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {localSections.map((section) => (
                <SortableSectionCard
                  key={section.id}
                  section={section}
                  onSave={handleSaveSection}
                  onDelete={() => handleDeleteSection(section.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CaseStudyEditor;
