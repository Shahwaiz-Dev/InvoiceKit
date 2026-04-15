import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Templates } from "@/components/home/Templates";
import { FAQ } from "@/components/home/FAQ";
import { Editor } from "@/components/home/Editor";
import { TemplateType } from "@/lib/schema";

export default function Home() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("clean");

  const handleTemplateSelect = (template: TemplateType) => {
    setSelectedTemplate(template);
    setEditorOpen(true);
    // Lock body scroll when editor is open
    document.body.style.overflow = "hidden";
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    // Restore body scroll
    document.body.style.overflow = "auto";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Templates onSelect={handleTemplateSelect} />
        <FAQ />
      </main>

      <Footer />

      <Editor 
        template={selectedTemplate} 
        isOpen={editorOpen} 
        onClose={handleEditorClose} 
      />
    </div>
  );
}
