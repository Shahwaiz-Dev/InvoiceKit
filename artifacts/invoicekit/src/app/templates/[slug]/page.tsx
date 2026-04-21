import { TEMPLATES_SEO } from "@/lib/templates-seo";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, FileText, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const template = TEMPLATES_SEO.find((t) => t.slug === params.slug);
  if (!template) return {};

  return {
    title: template.title,
    description: template.description,
    keywords: template.keywords,
    openGraph: {
      title: template.title,
      description: template.description,
      type: "website",
      images: [`/templates/${params.slug}-preview.jpg`],
    },
  };
}

export async function generateStaticParams() {
  return TEMPLATES_SEO.map((template) => ({
    slug: template.slug,
  }));
}

export default function TemplatePage({ params }: Props) {
  const template = TEMPLATES_SEO.find((t) => t.slug === params.slug);

  if (!template) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: template.name,
    description: template.description,
    brand: {
      "@type": "Brand",
      name: "InvoiceKit",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header />

      <main className="flex-1">
        {/* Template Detail Hero */}
        <section className="py-24 px-6 bg-secondary/5 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <nav className="flex gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
                <Link href="/templates" className="hover:text-primary transition-colors">Templates</Link>
                <span>/</span>
                <span className="text-secondary">{template.name}</span>
              </nav>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                {template.name} <br />
                <span className="text-primary italic">Professional Invoice Template</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
                {template.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/editor?template=${template.slug}`}
                  className="px-8 py-4 bg-primary text-secondary font-bold rounded-full hover:bg-primary/90 transition-all text-center flex items-center justify-center gap-2"
                >
                  Use This Template <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3 px-6 py-4 text-sm font-semibold text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  No Watermarks
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-[40px] rotate-3 blur-2xl" />
              <div className="relative bg-white p-2 rounded-[32px] border border-secondary/10 shadow-2xl overflow-hidden aspect-[3/4] max-w-md mx-auto">
                <div className="w-full h-full bg-secondary/5 flex items-center justify-center text-secondary/20">
                    <FileText className="w-24 h-24" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-secondary/5 hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-bold">Fast Generation</span>
                </div>
                <p className="text-xs text-muted-foreground">Ready to download in &lt;60s</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Key Features of this Template</h2>
              <p className="text-muted-foreground">Everything you need to bill your clients professionally.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {template.features.map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl border border-secondary/5 bg-secondary/5">
                  <div className="mb-4 bg-primary/20 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Optimized for professional use and compliant with universal billing standards.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-24 px-6 bg-secondary/5">
          <div className="max-w-4xl mx-auto prose prose-secondary">
            <h2 className="text-3xl font-bold mb-8">Why choice the {template.name}?</h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                In today's competitive landscape, your invoice is often the final touchpoint you have with a client. 
                Using a professional <strong>invoice template</strong> like the {template.name} ensures that your brand 
                remains consistent and trustworthy until the very end of the project.
              </p>
              <p>
                Our <strong>free invoice generator</strong> handles all the heavy lifting—calculations, tax totals, 
                and PDF formatting—so you can focus on what you do best. Whether you are a solo freelancer or 
                running a specialized agency, the {template.name} provides exactly what you need to get paid 
                on time and in style.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
