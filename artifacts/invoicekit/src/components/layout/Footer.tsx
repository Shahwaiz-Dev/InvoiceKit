import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";
import { InvoiceBroLogo } from "./InvoiceBroLogo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#e1e9f0] pt-16 pb-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#e1e9f0]">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
            <InvoiceBroLogo size="md" />
            <p className="max-w-md text-[#36394a] text-sm leading-relaxed mt-1">
              Data observatory on cloud paper. Free in-browser invoice generator delivering watermark-free PDF bills with zero friction.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[#091135] font-semibold text-xs uppercase tracking-wider">Templates</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/templates" className="text-[#36394a] hover:text-[#091135] transition-colors text-sm">
                  Template Library
                </Link>
              </li>
              <li>
                <Link href="/templates/clean" className="text-[#36394a] hover:text-[#091135] transition-colors text-sm">
                  Clean Blueprint
                </Link>
              </li>
              <li>
                <Link href="/templates/contractor" className="text-[#36394a] hover:text-[#091135] transition-colors text-sm">
                  Contractor Timesheet
                </Link>
              </li>
              <li>
                <Link href="/templates/corporate" className="text-[#36394a] hover:text-[#091135] transition-colors text-sm">
                  Corporate Ledger
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[#091135] font-semibold text-xs uppercase tracking-wider">Product</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/editor" className="text-[#36394a] hover:text-[#091135] transition-colors text-sm">
                  Interactive Editor
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#36394a] hover:text-[#091135] transition-colors text-sm">
                  Architecture & Standards
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#36394a] hover:text-[#091135] transition-colors text-sm">
                  Inquiries & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 text-xs text-[#36394a]">
          <div>
            &copy; {new Date().getFullYear()} InvoiceBro. Built with architectural restraint.
          </div>

          <div className="flex items-center gap-6">
            <Link href={"/privacy" as any} className="hover:text-[#091135] transition-colors">
              Privacy Policy
            </Link>
            <Link href={"/terms" as any} className="hover:text-[#091135] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
