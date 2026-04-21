import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TEMPLATES_SEO } from "@/lib/templates-seo";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Invoice Templates",
  description: "Browse our library of high-quality, free invoice templates. Choose from Clean, Contractor, Creative, and more. Generate professional PDFs instantly.",
};

export default function TemplatesHub() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-secondary/5 border-b border-secondary/10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional <span className="text-primary italic">Invoice Templates</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Find the perfect design for your business. All our templates are meticulously crafted to be professional, 
              <strong>free to download</strong>, and fully customizable with our <strong>free invoice generator</strong>.
            </p>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TEMPLATES_SEO.map((template) => (
                <div 
                  key={template.slug} 
                  className="group flex flex-col p-8 rounded-3xl border border-secondary/10 bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-secondary/5 transition-all"
                >
                  <div className="mb-6 bg-secondary/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <FileText className="w-8 h-8 text-secondary group-hover:text-primary transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{template.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                    {template.description.slice(0, 120)}...
                  </p>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {template.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="px-3 py-1 bg-secondary/5 text-[10px] font-bold uppercase tracking-widest text-secondary/60 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/editor?template=${template.slug}`}
                        className="flex items-center justify-center px-6 py-4 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10"
                      >
                        Try This Template
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 px-6 bg-secondary text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why use our invoice templates?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <div className="text-primary text-3xl font-bold mb-2">100%</div>
                <p className="text-white/40 text-sm">Free to use forever</p>
              </div>
              <div>
                <div className="text-primary text-3xl font-bold mb-2">Zero</div>
                <p className="text-white/40 text-sm">Watermarks on PDFs</p>
              </div>
              <div>
                <div className="text-primary text-3xl font-bold mb-2">No</div>
                <p className="text-white/40 text-sm">Sign-up required for Clean</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
