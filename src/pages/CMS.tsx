import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeEditor from "./cms/HomeEditor";
import AboutEditor from "./cms/AboutEditor";
import CaseStudiesManager from "./cms/CaseStudiesManager";
import CaseStudyEditor from "./cms/CaseStudyEditor";

const CMS = () => {
  const [editingStudyId, setEditingStudyId] = useState<string | null>(null);

  if (editingStudyId) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <CaseStudyEditor
            studyId={editingStudyId}
            onBack={() => setEditingStudyId(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold font-serif mb-2">Content Management</h1>
        <p className="text-muted-foreground mb-8">Edit your portfolio pages and case studies.</p>

        <Tabs defaultValue="case-studies">
          <TabsList className="mb-6">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <HomeEditor />
          </TabsContent>
          <TabsContent value="about">
            <AboutEditor />
          </TabsContent>
          <TabsContent value="case-studies">
            <CaseStudiesManager onEdit={(id) => setEditingStudyId(id)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CMS;
