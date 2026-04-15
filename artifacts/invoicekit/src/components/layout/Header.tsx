import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-[60px] z-40 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_8px_rgba(0,0,0,0.06)]" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center text-primary">
            <FileText className="w-6 h-6" strokeWidth={2.5} />
            <span className="ml-2 font-semibold text-lg text-foreground tracking-tight">InvoiceKit</span>
          </div>
          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-accent/15 text-accent text-[11px] font-bold uppercase tracking-wider">
            Free · No Login
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => scrollTo("how-it-works")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo("templates")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Templates
          </button>
        </nav>
      </div>
    </header>
  );
}
