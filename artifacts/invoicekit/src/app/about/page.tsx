import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, ShieldCheck, Users2, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission behind InvoiceKit - helping freelancers and small businesses manage their billing with professional, free invoice templates.",
};

export default function AboutPage() {
  const values = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
      title: "Simplicity First",
      description: "We believe professional billing shouldn't be complicated. Our tool is built for speed and ease of use.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Privacy Focused",
      description: "Your data is yours. We don't sell your information or track your every move. No ads, just tools.",
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Built for Speed",
      description: "Generate a professional PDF in under 60 seconds with our streamlined editor and pre-made templates.",
    },
    {
      icon: <Users2 className="w-6 h-6 text-primary" />,
      title: "Community Driven",
      description: "InvoiceKit is built for freelancers, by people who understand the challenges of running a small business.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 bg-secondary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20" />
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
              Empowering freelancers to <span className="text-primary italic">bill with confidence.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-2xl">
              InvoiceKit was born out of a simple frustration: professional invoice tools were either too expensive, too complex, or filled with intrusive ads. We built a better way.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  At InvoiceKit, our mission is to provide the world's most accessible and professional <strong>free invoice generator</strong>. We believe that everyone, from the solo freelancer to the growing small business, deserves access to high-quality billing tools without a paywall.
                </p>
                <p>
                  We focus on high-design <strong>invoice templates</strong> that make your business look professional from day one. Whether you're using our "Clean" template for an instant PDF or managing a full client list in your dashboard, we're here to support your growth.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, i) => (
                <div key={i} className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10 hover:border-primary/20 transition-all group">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform">{value.icon}</div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 bg-secondary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to create your first invoice?</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join thousands of freelancers who trust InvoiceKit for their professional billing needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/editor"
                className="px-8 py-4 bg-primary text-secondary font-semibold rounded-full hover:bg-primary/90 transition-all text-center"
              >
                Create Free Invoice
              </a>
              <a
                href="/register"
                className="px-8 py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-all text-center"
              >
                Create Free Account
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
