"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, Zap, FileSpreadsheet, Download, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function Hero() {
  const { data: session } = useSession();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-28 pb-16 px-6 bg-white flex flex-col items-center relative overflow-hidden">
      {/* Ambient background glows for visual depth */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-b from-[#0f77ff]/10 via-[#6366f1]/10 to-transparent blur-[90px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-36 left-1/2 -translate-x-1/2 w-[340px] h-[160px] bg-[#0f77ff]/12 blur-[60px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
        {/* Top Eyebrow / Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#e1e9f0] shadow-[0_2px_12px_rgba(15,119,255,0.06)] hover:border-[#0f77ff]/40 transition-all cursor-default"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0f77ff] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0f77ff]" />
          </span>
          <span className="text-[13px] font-normal text-[#091135] tracking-tight">
            Data-grade invoicing for modern operators
          </span>
          <span className="text-[11px] font-medium text-[#0f77ff] bg-[#f5f3ff] px-2 py-0.5 rounded-full border border-[#d2e4ff]">
            100% Free
          </span>
        </motion.div>

        {/* Hero Headline Block - 2 Lines, Elegant Regular Weight Typography with Background Accent */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-5xl lg:text-[54px] font-normal text-[#091135] tracking-tight leading-[1.2] text-center max-w-5xl"
        >
          Instant,{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-[#0f77ff] via-[#2563eb] to-[#6366f1] bg-clip-text text-transparent font-normal">
              watermark-free
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-3.5 bg-[#0f77ff]/12 rounded-sm -rotate-1 -z-0" />
          </span>{" "}
          invoices
          <br className="hidden sm:inline" />
          {" "}rendered on{" "}
          <span className="relative inline-block font-serif italic font-normal text-[#091135] underline decoration-[#0f77ff]/40 decoration-wavy decoration-1 underline-offset-8">
            clean paper.
          </span>
        </motion.h1>

        {/* Subtitle - No bold text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base sm:text-lg lg:text-[19px] text-[#36394a] leading-relaxed text-center max-w-2xl mt-5 mb-8 font-normal"
        >
          Generate client-ready PDF bills in seconds with zero sign-up required. Everything calculates privately in your browser with mathematical precision.
        </motion.p>

        {/* Action Buttons: Filled Cobalt Surface + Outlined Ghost Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-xl"
        >
          <button
            onClick={() => scrollTo("editor-section")}
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-[#127ee3] to-[#0f77ff] text-white hover:from-[#0f77ff] hover:to-[#0966df] font-semibold text-[15px] whitespace-nowrap transition-all inline-flex items-center justify-center gap-2.5 shadow-[0_10px_25px_-5px_rgba(15,119,255,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(15,119,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[#0f77ff]"
          >
            <Sparkles className="w-4 h-4 text-white/90" />
            <span>Open Interactive Editor</span>
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </button>

          {!session ? (
            <Link
              href="/register"
              className="w-full sm:w-auto h-12 px-7 rounded-xl border border-[#e1e9f0] bg-white text-[#091135] hover:bg-[#f5f3ff] hover:border-[#b1bbcd] font-semibold text-[15px] whitespace-nowrap transition-all inline-flex items-center justify-center gap-2 shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Unlock All Templates</span>
              <ArrowRight className="w-4 h-4 shrink-0 text-[#36394a]" />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto h-12 px-7 rounded-xl border border-[#e1e9f0] bg-white text-[#091135] hover:bg-[#f5f3ff] hover:border-[#b1bbcd] font-semibold text-[15px] whitespace-nowrap transition-all inline-flex items-center justify-center gap-2 shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 shrink-0 text-[#36394a]" />
            </Link>
          )}
        </motion.div>

        {/* Feature Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-9 flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#36394a]"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f3ff]/90 border border-[#e1e9f0] text-[#091135] text-xs font-normal shadow-2xs hover:border-[#0f77ff]/30 transition-colors">
            <Check className="w-3.5 h-3.5 text-[#0f77ff]" strokeWidth={2} />
            <span>Clean Template 100% Free</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f3ff]/90 border border-[#e1e9f0] text-[#091135] text-xs font-normal shadow-2xs hover:border-[#0f77ff]/30 transition-colors">
            <Check className="w-3.5 h-3.5 text-[#0f77ff]" strokeWidth={2} />
            <span>Zero Watermarks</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f3ff]/90 border border-[#e1e9f0] text-[#091135] text-xs font-normal shadow-2xs hover:border-[#0f77ff]/30 transition-colors">
            <Check className="w-3.5 h-3.5 text-[#0f77ff]" strokeWidth={2} />
            <span>Client-Side Generation</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f3ff]/90 border border-[#e1e9f0] text-[#091135] text-xs font-normal shadow-2xs hover:border-[#0f77ff]/30 transition-colors">
            <Check className="w-3.5 h-3.5 text-[#0f77ff]" strokeWidth={2} />
            <span>Instant PDF Download</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
