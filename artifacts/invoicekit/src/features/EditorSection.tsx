"use client";

import { motion } from "framer-motion";
import { StandaloneEditor } from "./editor/components/StandaloneEditor";

export function EditorSection() {
  return (
    <section id="editor-section" className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 border-t border-slate-200/80 overflow-hidden">
      {/* Soft ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1360px] mx-auto px-3 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Header Block */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-600 text-xs font-semibold tracking-wider uppercase mb-3.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Direct Synthesis
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
              Interactive Invoice Maker
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-2.5 leading-relaxed font-normal">
              Fill in your line items and billing coordinates. The document updates in real-time without latency.
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
              <span>Runs 100% in browser</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Real-time synthesis</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Zero watermarks</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
