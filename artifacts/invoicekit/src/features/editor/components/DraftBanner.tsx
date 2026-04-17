import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface DraftBannerProps {
  onRestore: () => void;
  onDiscard: () => void;
}

export function DraftBanner({ onRestore, onDiscard }: DraftBannerProps) {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 220 }}
      className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between gap-4 bg-primary text-primary-foreground px-6 py-3 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <RotateCcw className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium">
          We found an unsaved invoice draft. Would you like to restore it?
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRestore}
          className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors"
        >
          Restore
        </button>
        <button
          onClick={onDiscard}
          className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        >
          Discard
        </button>
      </div>
    </motion.div>
  );
}
