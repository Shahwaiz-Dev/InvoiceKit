import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TemplateSection } from "./TemplateSection";
import { FAQ } from "@/components/home/FAQ";

/**
 * Server Component — no "use client" directive.
 * Only TemplateSection (useRouter) and Header (useSession) need the client bundle.
 * Hero, HowItWorks, and FAQ render statically on the server.
 * Rule: bundle-dynamic-imports — reduces client JS payload for the home route.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <TemplateSection />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
