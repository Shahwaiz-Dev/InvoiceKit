import Link from "next/link";
import { FileText, ShieldCheck, Sparkles, Zap, ArrowRight } from "lucide-react";

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
  { icon: ShieldCheck, text: "Bank-grade auth with private sessions" },
  { icon: Zap, text: "Send polished invoices in under 2 minutes" },
  { icon: Sparkles, text: "Made for freelancers and small businesses" },
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
    <div className="min-h-screen bg-background font-sans selection:bg-foreground selection:text-background flex">
      {/* Left Column - Branding / Manifesto */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border/60 relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle geometric background */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', 
            backgroundSize: '32px 32px' 
          }} 
        />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 text-foreground group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:scale-105 transition-transform duration-300 ease-out">
              <FileText className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-medium tracking-tight">InvoiceKit</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md py-12">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-accent font-semibold mb-6">
            {eyebrow}
          </p>
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tighter text-foreground leading-[1.05]">
            {panelTitle}
          </h2>
          <p className="mt-6 text-base text-muted-foreground leading-relaxed">
            {panelDescription}
          </p>

          <div className="mt-12 space-y-6 border-t border-border/60 pt-10">
            {trustPoints.map(({ icon: Icon, text }) => (
               <div key={text} className="flex items-center gap-4 group">
                 <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center border border-border/80 rounded-md bg-background group-hover:border-primary/50 transition-colors duration-300">
                   <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                 </div>
                 <p className="text-sm font-medium tracking-tight text-foreground/90">{text}</p>
               </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-border/60 pt-6">
           <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
             © {new Date().getFullYear()} InvoiceKit
           </p>
           <p className="text-[10px] font-mono tracking-widest uppercase text-primary font-semibold">
             Invoicing, Refined.
           </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-background">
         {/* Mobile Header */}
         <div className="absolute top-6 left-6 lg:hidden flex items-center">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                <FileText className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-medium tracking-tight">InvoiceKit</span>
            </Link>
         </div>

         <div className="w-full max-w-sm">
            <div className="mb-10">
              <h1 className="text-3xl font-medium tracking-tighter text-foreground mb-3">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>

            {children}

            <div className="mt-10 border-t border-border/60 pt-6">
              <p className="text-sm text-muted-foreground">
                {footerText}{" "}
                <Link href={footerLinkHref as any} className="text-primary font-semibold hover:text-primary/80 transition-colors group">
                  {footerLinkText}
                  <ArrowRight className="inline-block ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
         </div>
      </div>
    </div>
  );
}
