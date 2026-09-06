import Link from "next/link";
import { ShieldCheck, Sparkles, Zap, ArrowRight } from "lucide-react";
import { InvoiceBroLogo } from "@/components/layout/InvoiceBroLogo";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  panelTitle: string;
  panelDescription: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  children: React.ReactNode;
}

const trustPoints = [
  { icon: ShieldCheck, text: "Private browser sessions with bank-grade encryption" },
  { icon: Zap, text: "Instant watermark-free PDF exports in under 30 seconds" },
  { icon: Sparkles, text: "Unrestricted Clean template with zero forced billing" },
];

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  panelTitle,
  panelDescription,
  footerText,
  footerLinkText,
  footerLinkHref,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-white font-sans flex">
      {/* Left Column - Clearbit Observatory Wash */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#f5f3ff] border-r border-[#e1e9f0] relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center group">
            <InvoiceBroLogo size="md" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md py-12">
          <span className="text-xs font-medium uppercase tracking-[0.004em] text-[#091135] mb-4 block">
            {eyebrow}
          </span>
          <h2 className="text-4xl font-semibold tracking-[0.512px] text-[#091135] leading-[1.12]">
            {panelTitle}
          </h2>
          <p className="mt-5 text-sm text-[#36394a] leading-relaxed tracking-[0.056px]">
            {panelDescription}
          </p>

          <div className="mt-10 space-y-4 border-t border-[#e1e9f0] pt-8">
            {trustPoints.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center border border-[#e1e9f0] rounded-lg bg-white">
                  <Icon className="h-4 w-4 text-[#0f77ff]" strokeWidth={2} />
                </div>
                <p className="text-xs font-medium text-[#091135]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-[#e1e9f0] pt-6">
          <p className="text-xs text-[#36394a]">
            &copy; {new Date().getFullYear()} InvoiceBro
          </p>
          <p className="text-xs font-medium text-[#0f77ff]">
            Achromatic Invoicing
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center">
          <Link href="/" className="inline-flex items-center group">
            <InvoiceBroLogo size="sm" />
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-[#091135] mb-2">
              {title}
            </h1>
            <p className="text-sm text-[#36394a] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {children}

          <div className="mt-8 border-t border-[#e1e9f0] pt-5">
            <p className="text-xs text-[#36394a]">
              {footerText}{" "}
              <Link href={footerLinkHref as any} className="text-[#127ee3] font-medium hover:text-[#0f77ff] transition-colors inline-flex items-center gap-1">
                {footerLinkText}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
