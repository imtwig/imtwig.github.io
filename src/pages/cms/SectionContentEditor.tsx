import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/cms/ImageUpload";

interface Props {
  type: string;
  content: any;
  onChange: (content: any) => void;
}

const SectionContentEditor = ({ type, content, onChange }: Props) => {
  switch (type) {
    case "timeline":
      return <TimelineEditor content={content} onChange={onChange} />;
    case "body_text":
      return <BodyTextEditor content={content} onChange={onChange} />;
    case "stats":
      return <StatsEditor content={content} onChange={onChange} />;
    case "reflections":
      return <ReflectionsEditor content={content} onChange={onChange} />;
    default:
      return <p className="text-sm text-muted-foreground">Unknown section type: {type}</p>;
  }
};

const TimelineEditor = ({ content, onChange }: { content: any; onChange: (c: any) => void }) => {
  const items = content?.items || [];

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...content, items: newItems });
  };

  return (
    <div className="space-y-3">
      {items.map((item: any, i: number) => (
        <div key={i} className="border border-border rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted-foreground font-medium">Step {i + 1}</span>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onChange({ ...content, items: items.filter((_: any, j: number) => j !== i) })}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <Input placeholder="Title" value={item.title || ""} onChange={(e) => updateItem(i, "title", e.target.value)} />
          <Textarea placeholder="Description" value={item.description || ""} onChange={(e) => updateItem(i, "description", e.target.value)} className="min-h-[60px]" />
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={() => onChange({ ...content, items: [...items, { title: "", description: "" }] })}>
        <Plus className="w-3 h-3 mr-1" /> Add Step
      </Button>
    </div>
  );
};

const BodyTextEditor = ({ content, onChange }: { content: any; onChange: (c: any) => void }) => (
  <div className="space-y-3">
    <div>
      <label className="text-xs text-muted-foreground">Eyebrow</label>
      <Input value={content?.eyebrow || ""} onChange={(e) => onChange({ ...content, eyebrow: e.target.value })} />
    </div>
    <div>
      <label className="text-xs text-muted-foreground">Header</label>
      <Input value={content?.header || ""} onChange={(e) => onChange({ ...content, header: e.target.value })} />
    </div>
    <div>
      <label className="text-xs text-muted-foreground">Body</label>
      <Textarea value={content?.body || ""} onChange={(e) => onChange({ ...content, body: e.target.value })} className="min-h-[120px]" />
    </div>
    <div>
      <label className="text-xs text-muted-foreground">Image</label>
      <ImageUpload value={content?.image || ""} onChange={(url) => onChange({ ...content, image: url })} folder="case-studies/sections" className="mt-1" />
    </div>
  </div>
);

const StatsEditor = ({ content, onChange }: { content: any; onChange: (c: any) => void }) => {
  const items = content?.items || [];
  return (
    <div className="space-y-3">
      {items.map((stat: any, i: number) => (
        <div key={i} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Value</label>
            <Input type="number" value={stat.value || 0} onChange={(e) => {
              const newItems = [...items];
              newItems[i] = { ...newItems[i], value: Number(e.target.value) };
              onChange({ ...content, items: newItems });
            }} />
          </div>
          <div className="w-20">
            <label className="text-xs text-muted-foreground">Suffix</label>
            <Input value={stat.suffix || ""} onChange={(e) => {
              const newItems = [...items];
              newItems[i] = { ...newItems[i], suffix: e.target.value };
              onChange({ ...content, items: newItems });
            }} />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Label</label>
            <Input value={stat.label || ""} onChange={(e) => {
              const newItems = [...items];
              newItems[i] = { ...newItems[i], label: e.target.value };
              onChange({ ...content, items: newItems });
            }} />
          </div>
          <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => onChange({ ...content, items: items.filter((_: any, j: number) => j !== i) })}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={() => onChange({ ...content, items: [...items, { value: 0, suffix: "", label: "" }] })}>
        <Plus className="w-3 h-3 mr-1" /> Add Stat
      </Button>
    </div>
  );
};

const ReflectionsEditor = ({ content, onChange }: { content: any; onChange: (c: any) => void }) => {
  const items: string[] = content?.items || [];
  const images: string[] = content?.images || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Reflection Images (3 floating images)</label>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((idx) => (
            <ImageUpload
              key={idx}
              value={images[idx] || ""}
              onChange={(url) => {
                const newImages = [...images];
                while (newImages.length <= idx) newImages.push("");
                newImages[idx] = url;
                onChange({ ...content, images: newImages });
              }}
              folder="case-studies/reflections"
              aspectRatio="aspect-[4/3]"
            />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium">Reflection Texts</label>
        {items.map((text, i) => (
          <div key={i} className="flex gap-2">
            <Textarea value={text} className="flex-1 min-h-[60px]" onChange={(e) => {
              const newItems = [...items];
              newItems[i] = e.target.value;
              onChange({ ...content, items: newItems });
            }} />
            <Button size="icon" variant="ghost" onClick={() => onChange({ ...content, items: items.filter((_, j) => j !== i) })}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => onChange({ ...content, items: [...items, ""] })}>
          <Plus className="w-3 h-3 mr-1" /> Add Reflection
        </Button>
      </div>
    </div>
  );
};

export default SectionContentEditor;
