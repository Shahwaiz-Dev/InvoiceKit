"use client";

import { motion } from "framer-motion";
import { StandaloneEditor } from "./editor/components/StandaloneEditor";

export function EditorSection() {
  return (
    <section id="editor-section" className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/40 border-b border-slate-200/80 overflow-hidden">
      {/* Soft ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-500/8 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1360px] mx-auto px-3 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Header Block with primary H1 */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold tracking-wider uppercase mb-3.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Free Online Invoice Maker · Instant PDF Export
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
              Free Invoice Generator &amp; Online Invoice Maker
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mt-3 leading-relaxed font-normal">
              Create, customize, and download professional PDF invoices in seconds with our free invoice maker online. 100% free, no sign-up required, zero watermarks, and calculated privately in your browser.
            </p>
          </div>

          {/* Floating Product Surface Card */}
          <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.07)] overflow-hidden ring-1 ring-slate-900/5">
            <StandaloneEditor mode="embedded" />
          </div>

          {/* Bottom Trust Indicators */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>100% Free Invoice Maker</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Instant Vector PDF Download</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Zero Watermarks · No Sign-Up</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Custom Logo &amp; Multi-Currency</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
