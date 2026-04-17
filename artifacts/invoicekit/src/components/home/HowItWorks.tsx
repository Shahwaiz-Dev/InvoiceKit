"use client";

import { motion } from "framer-motion";
import { MousePointer2, PenLine, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <MousePointer2 className="w-6 h-6 text-primary" />,
      title: "Select Template",
      description: "Start instantly with the Clean template, or create an account to unlock the full library of professional layouts.",
      accentClass: "from-primary/15 via-primary/5 to-transparent",
    },
    {
      icon: <PenLine className="w-6 h-6 text-primary" />,
      title: "Enter Data",
      description: "Fill in your client details and line items. Our online invoice maker calculates taxes automatically.",
      accentClass: "from-accent/20 via-accent/5 to-transparent",
    },
    {
      icon: <Download className="w-6 h-6 text-primary" />,
      title: "Download PDF",
      description: "Download your professional PDF invoice instantly with no watermark. Create an account whenever you want more templates and saved workflows.",
      accentClass: "from-secondary/20 via-secondary/5 to-transparent",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden px-6 py-24 bg-[linear-gradient(180deg,hsl(var(--background))_0%,#ffffff_45%,hsl(var(--background))_100%)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent mb-4">
            Simple by design
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight leading-tight">
            Create Your Invoice in Three Easy Steps
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.45, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="group relative isolate overflow-hidden rounded-2xl border border-border/75 bg-white/90 p-7 shadow-[0_18px_45px_-32px_rgba(30,58,138,.55)] transition-all duration-300 hover:border-primary/45"
            >
              <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${step.accentClass}`} />

              {i < steps.length - 1 ? (
                <div className="hidden md:block absolute top-[3.5rem] -right-3 w-6 border-t border-dashed border-primary/30" />
              ) : null}

              <div className="w-12 h-12 bg-white border border-primary/20 rounded-xl flex items-center justify-center mb-5 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3 relative z-10">
                {step.title}
              </h3>

              <p className="text-[15px] text-muted-foreground leading-relaxed relative z-10">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
