import { FileText } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-12 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-white" strokeWidth={2.5} />
              <span className="font-semibold text-xl tracking-tight">InvoiceKit</span>
              <span className="text-white/60 ml-2">&middot; Your go-to <strong>free invoice generator</strong>.</span>
            </div>
            <p className="max-w-md text-white/40 text-[13px] leading-relaxed mt-2">
              InvoiceKit is an <strong>invoice generator free</strong> of charge, designed to help you find the perfect <strong>invoice template</strong> for your business. Create professional invoices instantly with our <strong>invoice generator</strong>.
            </p>
          </div>
          
          <div className="text-white/60 italic text-sm">
            Made with care. No tracking. No ads. No login.
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8 pt-8 border-t border-white/5">
          <div className="text-white/40 text-xs">
            &copy; 2026 InvoiceKit &middot; Built for freelancers everywhere
          </div>
          
          <div className="flex gap-6">
            <Link href={"/privacy" as any} className="text-white/40 hover:text-white transition-colors text-xs">Privacy Policy</Link>
            <Link href={"/terms" as any} className="text-white/40 hover:text-white transition-colors text-xs">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
