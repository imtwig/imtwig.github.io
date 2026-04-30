import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { useCmsPage, useSaveCmsPage } from "@/hooks/useCmsData";
import { toast } from "sonner";
import IconPicker from "@/components/cms/IconPicker";

interface TimelineEntry {
  year: string;
  title: string;
  company: string;
  duration: string;
  description: string[];
  icon: string;
  highlight?: boolean;
}

interface StatEntry {
  value: number;
  suffix: string;
  label: string;
}

interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  bubbleText: string;
  timeline: TimelineEntry[];
  stats: StatEntry[];
  endTitle: string;
  endSubtitle: string;
}

const defaultTimeline: TimelineEntry[] = [
  { year: "2012", title: "Undergraduate", company: "Singapore Management University", duration: "August 2012 - April 2016", description: ["School of Information Systems - technical and business studies foundation", "Skills: interaction design, prototyping, design thinking, information architecture, project management", "Undergraduate Teaching Assistant for IS306 - Interaction Design & Prototyping"], icon: "GraduationCap" },
  { year: "2016", title: "UX Student", company: "General Assembly (Singapore)", duration: "May 2016 - August 2016", description: ["Enrolled in a 10-week UX design course to get certified", "Completed five end-to-end UX Design projects", "Employed full User Experience Design process"], icon: "Lightbulb" },
  { year: "2016", title: "UX Designer (Contract)", company: "Nanyang Technological University", duration: "October 2016 - May 2017", description: ["First job in my UX career! 🎉", "Designed NTU MENTOR mobile application from user research to high fidelity prototype", "Managed the project, sourced developers, translated designs into requirements"], icon: "Rocket", highlight: true },
  { year: "2017", title: "UX Design Consultant", company: "IBM iX", duration: "July 2017 - July 2019", description: ["Consulting by Degrees graduate program", "UX design consulting for ASEAN clients across telecom, media, banking, retail, public sector", "Focus: digital transformation, app/website redesign, design systems, product conceptualization"], icon: "Briefcase" },
  { year: "2019", title: "UX Designer I (F)", company: "GovTech", duration: "August 2019 - July 2020", description: ["Joined GovTech and started OurSG Grants Portal journey", "Focused on onboarding Tote Board grants", "Started MSF grants delivery in May 2020"], icon: "Briefcase" },
  { year: "2020", title: "UX Designer II (G)", company: "GovTech", duration: "August 2020 - September 2021", description: ["Helped with TraceTogether during Covid-19 period (April 2020)", "Started NCSS grants delivery in OurSG Grants Portal"], icon: "Briefcase" },
  { year: "2021", title: "UX Designer II (H)", company: "GovTech", duration: "October 2021 - March 2023", description: ["Became Design Lead for OurSG Grants Portal", "Started AIC grants delivery"], icon: "Users", highlight: true },
  { year: "2023", title: "Senior UX Designer (I)", company: "GovTech", duration: "April 2023 - Present", description: ["Design lead for Research Grants Portal (FormFlow/BoB/ApplySG)", "Project Lead of OurSG Grants Portal since July 2024", "Design Manager for Productivity Policy Programme since April 2025", "Managing designers across Optical, GovWallet Suite, FormFlow/BoB/ApplySG, OSG"], icon: "Award", highlight: true },
];

const defaultContent: HomeContent = {
  heroTitle: "Experience...",
  heroSubtitle: "Scroll through my journey from curious student to seasoned UX professional. Every step shaped who I am today.",
  bubbleText: "I spent a lot of time on this!",
  timeline: defaultTimeline,
  stats: [
    { value: 9, suffix: "+", label: "Years of Experience" },
    { value: 30, suffix: "+", label: "Projects Completed" },
    { value: 500, suffix: "K+", label: "Visitors Reached" },
  ],
  endTitle: "And the journey continues...",
  endSubtitle: "Each experience has been a stepping stone, shaping my perspective on design and how it can make a real difference in people's lives.",
};

const HomeEditor = () => {
  const { data: page, isLoading } = useCmsPage("home");
  const savePage = useSaveCmsPage();
  const [content, setContent] = useState<HomeContent>(defaultContent);

  useEffect(() => {
    if (page?.content && Object.keys(page.content as object).length > 0) {
      const loaded = page.content as unknown as HomeContent;
      // Merge with defaults to ensure timeline is pre-populated
      setContent({
        ...defaultContent,
        ...loaded,
        timeline: loaded.timeline && loaded.timeline.length > 0 ? loaded.timeline : defaultTimeline,
      });
    }
  }, [page]);

  const update = (key: keyof HomeContent, value: any) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    savePage.mutate(
      { pageKey: "home", content: content as any },
      { onSuccess: () => toast.success("Home page saved!") }
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold font-serif">Home Page</h2>
        <Button onClick={handleSave} disabled={savePage.isPending}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Hero */}
      <Card>
        <CardHeader><CardTitle className="text-base">Hero Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input value={content.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Subtitle</label>
            <Textarea value={content.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Bubble Text</label>
            <Input value={content.bubbleText} onChange={(e) => update("bubbleText", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Timeline ({content.timeline.length} entries)</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => update("timeline", [...content.timeline, { year: "", title: "", company: "", duration: "", description: [""], icon: "Briefcase", highlight: false }])}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.timeline.map((entry, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <IconPicker
                    value={entry.icon || "Briefcase"}
                    onChange={(icon) => {
                      const t = [...content.timeline];
                      t[i] = { ...t[i], icon };
                      update("timeline", t);
                    }}
                  />
                  <span className="text-sm font-medium">{entry.title || `Entry ${i + 1}`}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => update("timeline", content.timeline.filter((_, j) => j !== i))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Year</label>
                  <Input value={entry.year} onChange={(e) => {
                    const t = [...content.timeline];
                    t[i] = { ...t[i], year: e.target.value };
                    update("timeline", t);
                  }} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Title</label>
                  <Input value={entry.title} onChange={(e) => {
                    const t = [...content.timeline];
                    t[i] = { ...t[i], title: e.target.value };
                    update("timeline", t);
                  }} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Company</label>
                  <Input value={entry.company} onChange={(e) => {
                    const t = [...content.timeline];
                    t[i] = { ...t[i], company: e.target.value };
                    update("timeline", t);
                  }} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Duration</label>
                  <Input value={entry.duration} onChange={(e) => {
                    const t = [...content.timeline];
                    t[i] = { ...t[i], duration: e.target.value };
                    update("timeline", t);
                  }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description (one per line)</label>
                <Textarea
                  value={entry.description.join("\n")}
                  onChange={(e) => {
                    const t = [...content.timeline];
                    t[i] = { ...t[i], description: e.target.value.split("\n") };
                    update("timeline", t);
                  }}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={entry.highlight || false}
                  onChange={(e) => {
                    const t = [...content.timeline];
                    t[i] = { ...t[i], highlight: e.target.checked };
                    update("timeline", t);
                  }}
                />
                Highlight this entry
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Statistics</CardTitle>
            <Button size="sm" variant="outline" onClick={() => update("stats", [...content.stats, { value: 0, suffix: "", label: "" }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Stat
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.stats.map((stat, i) => (
            <div key={i} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Value</label>
                <Input type="number" value={stat.value} onChange={(e) => {
                  const s = [...content.stats]; s[i] = { ...s[i], value: Number(e.target.value) }; update("stats", s);
                }} />
              </div>
              <div className="w-20">
                <label className="text-xs text-muted-foreground">Suffix</label>
                <Input value={stat.suffix} onChange={(e) => {
                  const s = [...content.stats]; s[i] = { ...s[i], suffix: e.target.value }; update("stats", s);
                }} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Label</label>
                <Input value={stat.label} onChange={(e) => {
                  const s = [...content.stats]; s[i] = { ...s[i], label: e.target.value }; update("stats", s);
                }} />
              </div>
              <Button size="icon" variant="ghost" className="h-10 w-10" onClick={() => update("stats", content.stats.filter((_, j) => j !== i))}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* End Section */}
      <Card>
        <CardHeader><CardTitle className="text-base">End Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input value={content.endTitle} onChange={(e) => update("endTitle", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Subtitle</label>
            <Textarea value={content.endSubtitle} onChange={(e) => update("endSubtitle", e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeEditor;
