import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TEMPLATES_SEO } from "@/lib/templates-seo";
import Link from "next/link";
import { FileText, ArrowRight, Check } from "lucide-react";
import type { Metadata, Route } from "next";

export const metadata: Metadata = {
  title: "Professional Invoice Templates",
  description: "Browse our library of high-quality, free invoice templates. Choose from Clean, Contractor, Creative, and more. Generate professional PDFs instantly.",
  alternates: {
    canonical: "https://www.invoice-sync.com/templates",
  },
  openGraph: {
    title: "Professional Invoice Templates | InvoiceKit",
    description: "Browse our library of high-quality, free invoice templates. Generate professional PDFs instantly.",
    url: "https://www.invoice-sync.com/templates",
    siteName: "InvoiceKit",
    type: "website",
    images: [
      {
        url: "/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "InvoiceKit Professional Invoice Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Invoice Templates | InvoiceKit",
    description: "Browse our library of high-quality, free invoice templates. Generate professional PDFs instantly.",
    images: ["/opengraph.jpg"],
  },
};

export default function TemplatesHub() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section on White Canvas */}
        <section className="py-20 px-6 bg-white border-b border-[#e1e9f0]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[13px] font-medium uppercase tracking-[0.004em] text-[#091135] mb-2 block">
              Layout Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-[#091135] tracking-[0.512px] mb-4">
              Professional Invoice Templates
            </h1>
            <p className="text-base sm:text-lg text-[#36394a] leading-relaxed max-w-2xl mx-auto tracking-[0.128px]">
              Engineered with architectural discipline. Each layout compiles cleanly to standard vector print format with zero intrusive watermarks.
            </p>
          </div>
        </section>

        {/* Templates Grid on Lavender Wash */}
        <section className="py-24 px-6 bg-[#f5f3ff]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#091135] tracking-[0.512px]">
                Choose Your Architectural Layout
              </h2>
              <p className="text-[#36394a] text-sm max-w-lg mx-auto mt-2">
                Select an invoice template to initialize the interactive browser editor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TEMPLATES_SEO.map((template) => (
                <div 
                  key={template.slug} 
                  className="flex flex-col p-7 rounded-xl border border-[#e1e9f0] bg-white transition-all hover:border-[#b1bbcd] shadow-none"
                >
                  <div className="mb-5 bg-[#f5f3ff] border border-[#e1e9f0] w-12 h-12 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#0f77ff]" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-[#091135] mb-2">
                    <Link href={`/templates/${template.slug}` as Route} className="hover:text-[#0f77ff] transition-colors">
                      {template.name}
                    </Link>
                  </h3>
                  <p className="text-[#36394a] text-sm leading-relaxed mb-6 flex-1">
                    {template.description.slice(0, 120)}...
                  </p>

                  <div className="space-y-4 pt-4 border-t border-[#e1e9f0]">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {template.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#f5f3ff] text-[11px] font-medium text-[#091135] rounded-full border border-[#e1e9f0]">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/editor?template=${template.editorTheme || template.slug}` as Route}
                        className="flex items-center justify-center px-4 py-2.5 bg-[#127ee3] text-white text-sm font-medium rounded-lg hover:bg-[#0f77ff] transition-all"
                      >
                        Launch in Editor
                      </Link>
                      <Link
                        href={`/templates/${template.slug}` as Route}
                        className="flex items-center justify-center gap-1 text-xs font-medium text-[#36394a] hover:text-[#091135] transition-colors py-1"
                      >
                        Inspect Specifications <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verification / Trust Section on White */}
        <section className="py-20 px-6 bg-white border-t border-[#e1e9f0] text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-[12px] font-medium uppercase tracking-[0.004em] text-[#091135] mb-2 block">
              System Guarantees
            </span>
            <h2 className="text-2xl font-semibold text-[#091135] mb-8">Why professionals choose our templates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-[#e1e9f0] bg-[#f5f3ff]/40">
                <div className="text-[#0f77ff] text-2xl font-bold font-mono mb-1">100%</div>
                <p className="text-[#091135] font-medium text-sm">Free to export</p>
                <p className="text-xs text-[#36394a] mt-1">Clean template is unrestricted</p>
              </div>
              <div className="p-5 rounded-xl border border-[#e1e9f0] bg-[#f5f3ff]/40">
                <div className="text-[#0f77ff] text-2xl font-bold font-mono mb-1">0</div>
                <p className="text-[#091135] font-medium text-sm">Watermarks</p>
                <p className="text-xs text-[#36394a] mt-1">Crisp unbranded PDF export</p>
              </div>
              <div className="p-5 rounded-xl border border-[#e1e9f0] bg-[#f5f3ff]/40">
                <div className="text-[#0f77ff] text-2xl font-bold font-mono mb-1">Local</div>
                <p className="text-[#091135] font-medium text-sm">Browser execution</p>
                <p className="text-xs text-[#36394a] mt-1">Client records remain private</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
