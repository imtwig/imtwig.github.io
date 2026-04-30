import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { useCmsPage, useSaveCmsPage } from "@/hooks/useCmsData";
import { toast } from "sonner";
import ImageUpload from "@/components/cms/ImageUpload";

interface AboutContent {
  title: string;
  subtitle: string;
  wordCyclePrefix: string;
  wordCycleWords: { word: string; article: string }[];
  profileImage: string;
  paragraphs: string[];
  skills: string[];
  contactTitle: string;
  contactText: string;
  contactEmail: string;
}

const defaultContent: AboutContent = {
  title: "About Me",
  subtitle: "Hello, I'm a UX Designer",
  wordCyclePrefix: "Sometimes it feels like being ",
  wordCycleWords: [
    { word: "Linguist", article: "a" },
    { word: "Engineer", article: "an" },
    { word: "Artist", article: "an" },
    { word: "Doctor", article: "a" },
    { word: "Psychologist", article: "a" },
    { word: "Economist", article: "an" },
    { word: "Statistician", article: "a" },
    { word: "Fortune-Teller", article: "a" },
  ],
  profileImage: "",
  paragraphs: [
    "I'm passionate about creating intuitive, user-centered digital experiences that solve real problems.",
    "My design process is collaborative and iterative, combining research insights with creative problem-solving to deliver solutions that are both beautiful and functional.",
    "When I'm not designing, you'll find me exploring photography, which has taught me to see the world through different perspectives.",
  ],
  skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Information Architecture", "Interaction Design", "Visual Design", "Design Systems"],
  contactTitle: "Let's Connect",
  contactText: "I'm always interested in hearing about new projects and opportunities.",
  contactEmail: "hello@uxdesigner.com",
};

const AboutEditor = () => {
  const { data: page, isLoading } = useCmsPage("about");
  const savePage = useSaveCmsPage();
  const [content, setContent] = useState<AboutContent>(defaultContent);

  useEffect(() => {
    if (page?.content && Object.keys(page.content as object).length > 0) {
      setContent({ ...defaultContent, ...(page.content as unknown as AboutContent) });
    }
  }, [page]);

  const update = (key: keyof AboutContent, value: any) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    savePage.mutate(
      { pageKey: "about", content: content as any },
      { onSuccess: () => toast.success("About page saved!") }
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold font-serif">About Page</h2>
        <Button onClick={handleSave} disabled={savePage.isPending}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Profile Image</CardTitle></CardHeader>
        <CardContent>
          <ImageUpload
            value={content.profileImage}
            onChange={(url) => update("profileImage", url)}
            folder="about"
            aspectRatio="aspect-square"
            className="max-w-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Header</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Page Title</label>
            <Input value={content.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Subtitle</label>
            <Input value={content.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Word Cycle Prefix</label>
            <Input value={content.wordCyclePrefix} onChange={(e) => update("wordCyclePrefix", e.target.value)} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Word Cycle Words</label>
              <Button size="sm" variant="outline" onClick={() => update("wordCycleWords", [...content.wordCycleWords, { word: "", article: "a" }])}>
                <Plus className="w-3 h-3 mr-1" /> Add Word
              </Button>
            </div>
            <div className="space-y-2">
              {content.wordCycleWords.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={item.article}
                    onChange={(e) => {
                      const w = [...content.wordCycleWords];
                      w[i] = { ...w[i], article: e.target.value };
                      update("wordCycleWords", w);
                    }}
                    className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                  >
                    <option value="a">a</option>
                    <option value="an">an</option>
                  </select>
                  <Input
                    value={item.word}
                    placeholder="Word"
                    className="flex-1"
                    onChange={(e) => {
                      const w = [...content.wordCycleWords];
                      w[i] = { ...w[i], word: e.target.value };
                      update("wordCycleWords", w);
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => update("wordCycleWords", content.wordCycleWords.filter((_, j) => j !== i))}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Body Paragraphs</CardTitle>
            <Button size="sm" variant="outline" onClick={() => update("paragraphs", [...content.paragraphs, ""])}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                value={p}
                className="flex-1"
                onChange={(e) => {
                  const ps = [...content.paragraphs];
                  ps[i] = e.target.value;
                  update("paragraphs", ps);
                }}
              />
              <Button size="icon" variant="ghost" onClick={() => update("paragraphs", content.paragraphs.filter((_, j) => j !== i))}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Skills</CardTitle>
            <Button size="sm" variant="outline" onClick={() => update("skills", [...content.skills, ""])}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-1 bg-muted rounded-lg px-3 py-1">
                <Input
                  value={skill}
                  className="border-0 bg-transparent h-8 p-0 text-sm w-auto min-w-[80px]"
                  onChange={(e) => {
                    const s = [...content.skills];
                    s[i] = e.target.value;
                    update("skills", s);
                  }}
                />
                <button
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => update("skills", content.skills.filter((_, j) => j !== i))}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input value={content.contactTitle} onChange={(e) => update("contactTitle", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Text</label>
            <Input value={content.contactText} onChange={(e) => update("contactText", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input value={content.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutEditor;
