import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EditorSection } from "./EditorSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TemplateSection } from "./TemplateSection";
import { FAQ } from "@/components/home/FAQ";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        <EditorSection />
        <HowItWorks />
        <TemplateSection />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
