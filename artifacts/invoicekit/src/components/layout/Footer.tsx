import { FileText } from "lucide-react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-white" strokeWidth={2.5} />
              <span className="font-semibold text-xl tracking-tight">{APP_CONFIG.name}</span>
            </div>
            <p className="max-w-md text-white/40 text-[13px] leading-relaxed mt-2">
              {APP_CONFIG.name} is an <strong>invoice generator free</strong> to start with, giving every visitor instant access to the Clean template and a fast path to unlock the full <strong>invoice template</strong> library with an account.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-medium text-sm">Product</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href={"/templates" as any} className="text-white/40 hover:text-white transition-colors text-xs">
                  Invoice Templates
                </Link>
              </li>
              <li>
                <Link href={"/editor" as any} className="text-white/40 hover:text-white transition-colors text-xs">
                  Invoice Editor
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-medium text-sm">Company</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href={"/about" as any} className="text-white/40 hover:text-white transition-colors text-xs">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={"/contact" as any} className="text-white/40 hover:text-white transition-colors text-xs">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8 pt-8 border-t border-white/5">
          <div className="text-white/40 text-xs">
            &copy; 2026 InvoiceKit &middot; Built for freelancers everywhere
          </div>

          <div className="flex gap-6">
            <Link href={"/privacy" as any} className="text-white/40 hover:text-white transition-colors text-xs">
              Privacy Policy
            </Link>
            <Link href={"/terms" as any} className="text-white/40 hover:text-white transition-colors text-xs">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
