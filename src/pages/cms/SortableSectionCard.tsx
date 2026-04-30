import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import SectionContentEditor from "./SectionContentEditor";
import type { CmsSection } from "@/hooks/useCmsData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  timeline: "📋 Timeline",
  body_text: "📝 Body Text + Image",
  stats: "📊 Statistics",
  reflections: "💭 Reflections",
};

interface Props {
  section: CmsSection;
  onSave: (section: CmsSection) => void;
  onDelete: () => void;
}

const SortableSectionCard = ({ section, onSave, onDelete }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const [content, setContent] = useState(section.content);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setContent(section.content);
  }, [section.content]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-2">
              <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                <GripVertical className="w-5 h-5" />
              </button>
              <CollapsibleTrigger className="flex-1 flex items-center gap-2 text-left">
                <CardTitle className="text-sm font-medium">
                  {TYPE_LABELS[section.section_type] || section.section_type}
                </CardTitle>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <Button size="sm" variant="outline" onClick={() => onSave({ ...section, content })}>
                <Save className="w-3 h-3 mr-1" /> Save
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <SectionContentEditor
                type={section.section_type}
                content={content}
                onChange={setContent}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default SortableSectionCard;
