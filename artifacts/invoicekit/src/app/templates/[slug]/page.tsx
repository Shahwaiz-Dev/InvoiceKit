import { TEMPLATES_SEO } from "@/lib/templates-seo";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, FileText, ArrowRight, Zap, ShieldCheck, HelpCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import type { Metadata, Route } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = TEMPLATES_SEO.find((t) => t.slug === slug);
  if (!template) return {};

  const pageUrl = `https://www.invoice-sync.com/templates/${slug}`;

  return {
    title: template.title,
    description: template.description,
    keywords: template.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${template.name} | Free Invoice Template`,
      description: template.description,
      url: pageUrl,
      type: "website",
      siteName: "InvoiceKit",
      images: [
        {
          url: "/opengraph.jpg",
          width: 1200,
          height: 630,
          alt: `${template.name} - Free Professional Invoice Template`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.name} | Free Invoice Template`,
      description: template.description,
      images: ["/opengraph.jpg"],
    },
  };
}

export async function generateStaticParams() {
  return TEMPLATES_SEO.map((template) => ({
    slug: template.slug,
  }));
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const template = TEMPLATES_SEO.find((t) => t.slug === slug);

  if (!template) {
    notFound();
  }

  const pageUrl = `https://www.invoice-sync.com/templates/${slug}`;
  const editorUrl = `/editor?template=${template.editorTheme || "clean"}` as Route;

  // 1. WebApplication Schema
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${template.name} - Free Generator`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    url: pageUrl,
    description: template.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: template.features,
  };

  // 2. BreadcrumbList Schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.invoice-sync.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Templates",
        item: "https://www.invoice-sync.com/templates",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: template.name,
        item: pageUrl,
      },
    ],
  };

  // 3. HowTo Schema
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Create and Download a ${template.name}`,
    description: `Follow these 3 easy steps to generate a professional PDF invoice using our free ${template.name}.`,
    step: template.howToSteps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
  };

  // 4. FAQPage Schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: template.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // Other related templates for internal linking
  const relatedTemplates = TEMPLATES_SEO.filter((t) => t.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Script
        id="template-software-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <Script
        id="template-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="template-howto-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {template.faqs.length > 0 && (
        <Script
          id="template-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Header />

      <main className="flex-1">
        {/* Template Detail Hero */}
        <section className="py-20 px-6 bg-secondary/5 border-b border-border/40">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <nav aria-label="Breadcrumb" className="flex gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link href="/templates" className="hover:text-primary transition-colors">Templates</Link>
                <span>/</span>
                <span className="text-foreground">{template.name}</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {template.name} <br />
                <span className="text-primary italic font-serif">Free PDF Generator</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                {template.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  href={editorUrl}
                  className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  Customize & Download PDF <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold text-muted-foreground bg-white/60 dark:bg-zinc-900/60 rounded-xl border border-border/40">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  100% Free & No Sign-Up
                </div>
              </div>

              {/* Direct Answer Target Block (Featured Snippet anchor) */}
              {template.directAnswer && (
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-primary/20 shadow-sm mt-6">
                  <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>{template.directAnswer.heading}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {template.directAnswer.text}
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-[40px] rotate-2 blur-2xl" />
              <div className="relative bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-border shadow-2xl overflow-hidden aspect-[3/4] max-w-md mx-auto flex flex-col justify-between">
                <div className="border-b border-border/40 pb-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preview</span>
                    <h3 className="font-bold text-lg text-foreground">{template.name}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Free Format
                  </span>
                </div>

                <div className="my-auto py-8 text-center text-muted-foreground space-y-3">
                  <FileText className="w-16 h-16 mx-auto text-primary/60" />
                  <p className="text-sm font-medium">Ready-to-use professional layout with instant calculation and PDF printing.</p>
                </div>

                <Link
                  href={editorUrl}
                  className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl text-center hover:bg-secondary/90 transition-all text-sm"
                >
                  Open in Invoice Editor
                </Link>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border border-border hidden md:flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <div>
                  <span className="font-bold text-xs block">Ready in Seconds</span>
                  <p className="text-[11px] text-muted-foreground">Print or download PDF instantly</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step How It Works Guide (HowTo Schema match) */}
        <section className="py-20 px-6 bg-white dark:bg-zinc-950 border-b border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Simple 3-Step Process</span>
              <h2 className="text-3xl font-bold tracking-tight">How to Create Your Invoice</h2>
              <p className="text-muted-foreground mt-2">Generate and download in under 60 seconds with no registration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {template.howToSteps.map((step, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl border border-border/60 bg-muted/20 flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-muted/10 border-b border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight">Built-in Features</h2>
              <p className="text-muted-foreground mt-2">Everything required for tax compliance, client clarity, and swift payments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {template.features.map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 shadow-sm flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">{feature}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Optimized for professional invoicing standards and print rendering.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Template FAQ Section */}
        {template.faqs.length > 0 && (
          <section className="py-20 px-6 bg-white dark:bg-zinc-950 border-b border-border/40">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Questions About this Template</h2>
              </div>

              <div className="space-y-4">
                {template.faqs.map((faq, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-border/60 bg-muted/10">
                    <h3 className="font-bold text-base mb-2 text-foreground">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Templates Internal Linking Cluster */}
        <section className="py-20 px-6 bg-secondary/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Explore Other Free Templates</h2>
                <p className="text-muted-foreground mt-1 text-sm">Choose from our complete library of free billing formats.</p>
              </div>
              <Link href="/templates" className="mt-4 md:mt-0 text-sm font-bold text-primary hover:underline flex items-center gap-1">
                View all templates <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTemplates.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/templates/${rel.slug}` as Route}
                  className="group p-6 rounded-2xl border border-border bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors mb-2">{rel.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">{rel.description}</p>
                  </div>
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    Use Template <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
