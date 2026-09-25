import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, ShieldCheck, Users2, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission behind InvoiceKit - helping freelancers and small businesses manage their billing with professional, free invoice templates.",
  alternates: {
    canonical: "https://www.invoice-sync.com/about",
  },
  openGraph: {
    title: "About Us | InvoiceKit",
    description: "Learn about the mission behind InvoiceKit - helping freelancers and small businesses manage their billing with professional, free invoice templates.",
    url: "https://www.invoice-sync.com/about",
    siteName: "InvoiceKit",
    type: "website",
    images: [
      {
        url: "/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "About InvoiceKit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | InvoiceKit",
    description: "Learn about the mission behind InvoiceKit - helping freelancers and small businesses manage their billing with professional, free invoice templates.",
    images: ["/opengraph.jpg"],
  },
};

export default function AboutPage() {
  const values = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#0f77ff]" />,
      title: "Architectural Simplicity",
      description: "Billing interfaces should operate like clean blueprints. We eliminate bloated sign-up funnels and unnecessary configuration.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#0f77ff]" />,
      title: "Data Sovereignty",
      description: "Your financial numbers belong to you. Guest sessions are strictly evaluated inside your browser sandbox without telemetry.",
    },
    {
      icon: <Zap className="w-5 h-5 text-[#0f77ff]" />,
      title: "Deterministic Speed",
      description: "Produce a publication-quality invoice PDF in under sixty seconds, perfectly rendered with exact margins and vector lines.",
    },
    {
      icon: <Users2 className="w-5 h-5 text-[#0f77ff]" />,
      title: "Made for Independent Operators",
      description: "Engineered specifically for developers, contractors, and studios who require professional billing without monthly taxations.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section on White Canvas */}
        <section className="py-24 px-6 bg-white border-b border-[#e1e9f0]">
          <div className="max-w-[1200px] mx-auto text-center">
            <span className="text-[13px] font-medium uppercase tracking-[0.004em] text-[#091135] mb-3 block">
              Observatory Manifesto
            </span>
            <h1 className="text-4xl md:text-6xl font-semibold text-[#091135] tracking-[1.008px] mb-6 max-w-3xl mx-auto leading-[1.15]">
              Empowering independent operators to bill with clarity.
            </h1>
            <p className="text-lg text-[#36394a] leading-relaxed max-w-2xl mx-auto tracking-[0.252px]">
              InvoiceKit began with a singular observation: modern billing tools had become noisy, bloated, and hostile. We built a room-bright, achromatic canvas that respects your time.
            </p>
          </div>
        </section>

        {/* Mission & Values on Lavender Wash */}
        <section className="py-24 px-6 bg-[#f5f3ff]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[12px] font-medium uppercase tracking-[0.004em] text-[#091135] mb-2 block">
                Core Principles
              </span>
              <h2 className="text-3xl font-semibold text-[#091135] tracking-[0.512px] mb-6">
                Our Architectural Stance
              </h2>
              <div className="space-y-4 text-[#36394a] text-base leading-relaxed tracking-[0.128px]">
                <p>
                  At InvoiceKit, we treat invoices as essential commercial contracts that require precision, legibility, and restraint. No intrusive watermarks, no forced paywalls on basic functions, and no arbitrary lock-in.
                </p>
                <p>
                  Every layout in our catalog is engineered to communicate authority and trust. Whether you are generating an ad-hoc bill using the Clean template or archiving clients in your authenticated dashboard, the experience remains quiet and reliable.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map((value, i) => (
                <div 
                  key={i} 
                  className="p-6 bg-white rounded-xl border border-[#e1e9f0] shadow-none flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-[#f5f3ff] border border-[#e1e9f0] flex items-center justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="font-semibold text-base text-[#091135] mb-2">{value.title}</h3>
                    <p className="text-xs text-[#36394a] leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action on White */}
        <section className="py-24 px-6 bg-white border-t border-[#e1e9f0]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-[#091135] tracking-[0.512px] mb-4">
              Begin generating your next invoice
            </h2>
            <p className="text-base text-[#36394a] mb-8 tracking-[0.128px]">
              No credit card. No onboarding waiting period. Instant browser compilation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/editor"
                className="h-11 px-6 rounded-lg bg-[#127ee3] text-white hover:bg-[#0f77ff] font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                Launch Free Editor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="h-11 px-6 rounded-lg border border-[#e1e9f0] bg-white text-[#091135] hover:bg-[#f5f3ff] font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
