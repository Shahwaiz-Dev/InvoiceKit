"use client";

import { motion } from "framer-motion";
import { FileText, Download, CheckCircle2 } from "lucide-react";

export function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-16 px-6 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
            <span className="text-[13px] uppercase tracking-wider text-muted font-medium">
              No account needed. Always free.
            </span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-[56px] leading-[1.1] text-foreground mb-6">
            Free Professional <span className="text-primary italic">Invoice Generator</span> <span className="text-2xl md:text-3xl block mt-2 text-muted-foreground font-sans font-normal">(No Sign Up Required)</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
            Create and download professional PDF invoices instantly with our free online invoice maker. Perfect for freelancers and small businesses. No account, no watermarks, always free.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button 
              onClick={() => scrollTo("templates")}
              className="h-14 px-8 rounded-full bg-primary hover:bg-secondary text-white font-medium transition-colors flex items-center gap-2"
            >
              Browse Templates <span>&rarr;</span>
            </button>
            
            <button 
              onClick={() => scrollTo("how-it-works")}
              className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-colors font-medium h-14 px-4"
            >
              See how it works &darr;
            </button>
          </div>
          
          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 4 Templates</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Instant PDF</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> No Watermarks</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> No Login</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Free Forever</span>
          </div>
        </div>

        <div className="hidden lg:block relative h-[600px] w-full">
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[520px] bg-white rounded-xl shadow-2xl border border-border p-8"
          >
            {/* Fake Invoice Content */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4"></div>
                <div className="h-4 w-24 bg-muted/20 rounded mb-2"></div>
                <div className="h-3 w-32 bg-muted/10 rounded"></div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-serif text-primary mb-2">INVOICE</div>
                <div className="h-3 w-20 bg-muted/20 rounded ml-auto mb-1"></div>
                <div className="h-3 w-24 bg-muted/10 rounded ml-auto"></div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b border-border pb-2">
                <div className="h-3 w-40 bg-muted/20 rounded"></div>
                <div className="h-3 w-12 bg-muted/20 rounded"></div>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <div className="h-3 w-32 bg-muted/10 rounded"></div>
                <div className="h-3 w-16 bg-muted/10 rounded"></div>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <div className="h-3 w-48 bg-muted/10 rounded"></div>
                <div className="h-3 w-14 bg-muted/10 rounded"></div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <div className="w-40">
                <div className="flex justify-between mb-2">
                  <div className="h-3 w-16 bg-muted/20 rounded"></div>
                  <div className="h-3 w-16 bg-muted/20 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-12 bg-primary/20 rounded"></div>
                  <div className="h-4 w-20 bg-primary/20 rounded"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Badges */}
          <motion.div 
            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute top-24 right-8 bg-white px-4 py-2 rounded-full shadow-lg border border-border flex items-center gap-2 z-10"
          >
            <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
            <span className="text-sm font-medium text-foreground">PAID</span>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-32 -left-4 bg-white px-4 py-2 rounded-full shadow-lg border border-border flex items-center gap-2 z-10"
          >
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm font-medium text-foreground">PDF Ready</span>
          </motion.div>

          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute bottom-20 right-16 bg-accent w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white z-10"
          >
            <Download className="w-6 h-6" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
