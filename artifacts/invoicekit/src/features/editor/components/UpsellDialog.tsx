import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpsellDialogProps {
  onClose: () => void;
}

export function UpsellDialog({ onClose }: UpsellDialogProps) {
  const router = useRouter();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5">
            <Download className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Invoice downloaded! 🎉
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Want to save this invoice and your client details for next time? Create a free account
            — your business profile and invoices will be securely stored.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/register")}
              className="h-11 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Create a free account
            </button>
            <button
              onClick={onClose}
              className="h-11 text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              No thanks, I'll continue as guest
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
