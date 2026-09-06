"use client";

import { motion } from "framer-motion";
import { MousePointer2, PenLine, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <MousePointer2 className="w-5 h-5 text-[#0f77ff]" />,
      title: "Select Layout",
      description: "Initialize immediately with the Clean layout, or sign in to activate the complete library of specialized templates.",
    },
    {
      num: "02",
      icon: <PenLine className="w-5 h-5 text-[#0f77ff]" />,
      title: "Enter Records",
      description: "Specify recipient identity, hours or units, and rates. Taxes, discounts, and line totals compute in milliseconds.",
    },
    {
      num: "03",
      icon: <Download className="w-5 h-5 text-[#0f77ff]" />,
      title: "Export PDF",
      description: "Trigger print rendering to produce an uncompromised vector PDF with zero watermarks, ready for client delivery.",
    },
  ];

  return (
    <section id="how-it-works" className="px-6 py-24 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[13px] font-medium uppercase tracking-[0.004em] text-[#091135] mb-2 block">
            Three-phase pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#091135] tracking-[0.512px] leading-tight">
            Designed for minimal operational overhead
          </h2>
          <p className="text-base text-[#36394a] max-w-xl mx-auto mt-3 tracking-[0.128px]">
            No onboarding queues or verification walls. The shortest distance between work finished and invoice dispatched.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white rounded-xl border border-[#e1e9f0] p-7 transition-colors hover:border-[#b1bbcd] flex flex-col justify-between shadow-none"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#f5f3ff] border border-[#e1e9f0] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#36394a]/60">
                    PHASE {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[#091135] mb-2 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-sm text-[#36394a] leading-relaxed tracking-[0.056px]">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e1e9f0] flex items-center justify-between text-xs text-[#36394a]">
                <span>Status</span>
                <span className="font-medium text-[#0f77ff]">Ready</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
