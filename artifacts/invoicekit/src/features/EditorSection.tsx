"use client";

import { motion } from "framer-motion";
import { StandaloneEditor } from "./editor/components/StandaloneEditor";

export function EditorSection() {
  return (
    <section id="editor-section" className="py-8 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Subtle background glow for the editor area */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/5 via-secondary/5 to-transparent blur-3xl -z-10 rounded-3xl" />
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Interactive Invoice Maker</h2>
            <p className="text-muted-foreground">Start typing your details. Preview updates in real-time.</p>
          </div>

          <StandaloneEditor mode="embedded" />
          
          {/* Bottom attribution/clean flow helper */}
          <div className="mt-8 flex justify-center">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Your data is saved locally for convenience.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
