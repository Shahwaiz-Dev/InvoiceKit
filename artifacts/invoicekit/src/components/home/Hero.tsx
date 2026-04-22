"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronDown } from "lucide-react";
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
    <section className="pt-20 pb-6 px-6 bg-background relative overflow-hidden flex flex-col items-center text-center">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] pointer-events-none -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60" />
      
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
            <span className="text-[12px] uppercase tracking-wider text-primary font-bold">
              Production-Ready Invoices in Seconds
            </span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-[72px] leading-[0.95] text-foreground mb-4 tracking-tight">
            Create Professional <span className="text-primary italic">Invoices</span> <br className="hidden md:block" /> Without the <span className="text-secondary italic">Complexity</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            The simplest, most powerful <strong>free invoice generator</strong>. No accounts, no watermarks, just professional results instantly. Start typing below to generate your PDF.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("editor-section")}
              className="w-full sm:w-auto h-14 px-10 rounded-full bg-primary text-white hover:bg-primary/90 font-bold transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 text-lg"
            >
              Start Generating Now <span>&rarr;</span>
            </button>
            
            {!session && (
              <Link
                href="/register"
                className="w-full sm:w-auto h-14 px-10 rounded-full border border-border bg-white/50 backdrop-blur-sm hover:bg-white text-foreground font-semibold transition-all flex items-center justify-center gap-2 text-lg"
              >
                Create Free Account
              </Link>
            )}
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Free Clean Template</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Zero Watermarks</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Unlimited PDFs</span>
          </div>
        </motion.div>
      </div>

      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => scrollTo("editor-section")}
        className="mt-12 text-muted-foreground hover:text-primary transition-colors flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Quick Editor Below</span>
        <ChevronDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
}
