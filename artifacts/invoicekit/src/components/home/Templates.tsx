"use client";

import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Check } from "lucide-react";
import { TemplateType } from "@/lib/schema";
import { isGuestTemplate } from "@/lib/config";

interface TemplatesProps {
  isAuthenticated: boolean;
  isSessionPending: boolean;
  onRequireAccount: (template: TemplateType, mode: "login" | "register") => void;
  onSelect: (template: TemplateType) => void;
}

export function Templates({
  isAuthenticated,
  isSessionPending,
  onRequireAccount,
  onSelect,
}: TemplatesProps) {
  const templates: {
    id: TemplateType;
    name: string;
    tag: string;
    features: string[];
    preview: React.ReactNode;
  }[] = [
    {
      id: "clean",
      name: "Clean Layout",
      tag: "Blueprint Default",
      features: ["Guest Enabled", "Direct PDF", "Logo Support"],
      preview: (
        <div className="w-full h-full bg-white p-4 flex flex-col font-sans text-[8px] text-[#091135]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-8 h-8 bg-[#127ee3] rounded-sm flex items-center justify-center font-bold text-white text-[9px]">
              iB
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#091135] mb-0.5">INVOICE</div>
              <div className="text-[#36394a] font-mono">#INV-001</div>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <div className="font-semibold text-[#36394a] mb-0.5">Billed To</div>
              <div className="font-medium text-[#091135]">Acme Corporation</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-[#36394a] mb-0.5">Net Due</div>
              <div className="text-[10px] font-bold font-mono text-[#091135]">$1,200.00</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex border-y border-[#e1e9f0] py-1 mb-1 font-semibold text-[#36394a]">
              <div className="flex-1">Description</div>
              <div className="w-8 text-right">Qty</div>
              <div className="w-12 text-right">Amount</div>
            </div>
            <div className="flex py-1 text-[#091135]">
              <div className="flex-1">Software Architecture</div>
              <div className="w-8 text-right font-mono">1</div>
              <div className="w-12 text-right font-mono">$1,200</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "corporate",
      name: "Corporate Ledger",
      tag: "Formal Billing",
      features: ["Structured Columns", "Bank Wire Terms"],
      preview: (
        <div className="w-full h-full bg-white flex flex-col font-sans text-[8px] text-[#091135]">
          <div className="bg-[#091135] text-white p-3 flex justify-between items-center mb-3">
            <div className="text-[9px] font-bold uppercase tracking-wider">Statement of Work</div>
            <div className="text-white/70 font-mono">INV-8492</div>
          </div>
          <div className="px-3 flex-1">
            <div className="flex justify-between mb-3">
              <div>
                <div className="font-semibold text-[#36394a] text-[7px] uppercase">Entity</div>
                <div className="font-medium text-[#091135]">Global Logistics Ltd</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#36394a] text-[7px] uppercase">Settlement</div>
                <div className="text-[9px] font-bold font-mono text-[#091135]">$3,450.00</div>
              </div>
            </div>
            <div className="flex bg-[#f5f3ff] py-1 px-2 mb-1 font-semibold text-[#091135] border border-[#e1e9f0]">
              <div className="flex-1">Deliverable</div>
              <div className="w-12 text-right">Fee</div>
            </div>
            <div className="flex py-1 px-2 text-[#36394a] border-b border-[#e1e9f0]">
              <div className="flex-1">Advisory Services</div>
              <div className="w-12 text-right font-mono">$3,450</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "minimal",
      name: "Minimalist Record",
      tag: "Sparse & Editorial",
      features: ["High Tracking", "Documentary Tone"],
      preview: (
        <div className="w-full h-full bg-white p-4 flex flex-col font-sans text-[8px] text-[#091135]">
          <div className="text-right mb-4">
            <div className="text-[11px] font-semibold tracking-wider text-[#091135]">RECORD 001</div>
            <div className="text-[#36394a] font-mono">2026-10-24</div>
          </div>
          <div className="mb-4">
            <div className="text-[#36394a] text-[7px] uppercase mb-0.5">Counterparty</div>
            <div className="font-medium">Studio Nordic</div>
          </div>
          <div className="flex-1">
            <div className="flex border-b border-[#e1e9f0] py-1 text-[#36394a]">
              <div className="flex-1">Interface Direction</div>
              <div className="w-12 text-right font-mono">$2,800</div>
            </div>
            <div className="flex justify-end pt-2">
              <div className="w-24 flex justify-between font-semibold font-mono">
                <span>Sum</span>
                <span>$2,800</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contractor",
      name: "Contractor Timesheet",
      tag: "Unit & Hour Tracking",
      features: ["Day Rates", "Line Annotations"],
      preview: (
        <div className="w-full h-full bg-white flex flex-col font-sans text-[8px] text-[#091135]">
          <div className="border-b-2 border-[#127ee3] p-3 flex justify-between items-end mb-3">
            <div className="text-[11px] font-bold text-[#127ee3] tracking-tight">CONTRACT BILLING</div>
            <div className="font-mono text-[#091135]">#CON-901</div>
          </div>
          <div className="px-3 flex-1">
            <div className="flex justify-between mb-3 bg-[#f5f3ff] p-2 border border-[#e1e9f0] rounded">
              <div>
                <div className="text-[#36394a] text-[6px] uppercase mb-0.5">Contractor</div>
                <div className="font-medium">Independent Dev</div>
              </div>
              <div className="text-right">
                <div className="text-[#36394a] text-[6px] uppercase mb-0.5">Total</div>
                <div className="text-[9px] font-bold font-mono text-[#127ee3]">$4,800.00</div>
              </div>
            </div>
            <div className="flex border-b border-[#e1e9f0] py-1 font-semibold text-[#36394a]">
              <div className="flex-1">Hours / Days</div>
              <div className="w-12 text-right">Net</div>
            </div>
            <div className="flex py-1 border-b border-[#e1e9f0]/60">
              <div className="flex-1 font-medium">80 Hours @ $60/hr</div>
              <div className="w-12 text-right font-mono">$4,800</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="templates" className="py-24 bg-[#f5f3ff] border-y border-[#e1e9f0] px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[13px] font-medium uppercase tracking-[0.004em] text-[#091135] mb-2 block">
            Layout catalog
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#091135] tracking-[0.512px] leading-tight">
            Clean is open to everyone. Unlock more with an account.
          </h2>
          <p className="mt-3 text-base text-[#36394a] max-w-xl mx-auto tracking-[0.128px]">
            The Clean blueprint works immediately without sign-in. Register once to access specialized layouts and retain customer records.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {templates.map((template) => {
            const locked = !isAuthenticated && !isGuestTemplate(template.id);

            return (
              <motion.div
                key={template.id}
                className="bg-white rounded-xl border border-[#e1e9f0] overflow-hidden flex flex-col justify-between shadow-none transition-all hover:border-[#b1bbcd]"
              >
                <div className="p-8 bg-[#f5f3ff]/50 border-b border-[#e1e9f0] flex justify-center items-center relative">
                  {locked ? (
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#e1e9f0] bg-white px-3 py-1 text-[11px] font-medium text-[#36394a]">
                      <LockKeyhole className="h-3 w-3 text-[#0f77ff]" />
                      Account Required
                    </div>
                  ) : (
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#d2e4ff] bg-[#f5f3ff] px-3 py-1 text-[11px] font-medium text-[#0f77ff]">
                      <Check className="h-3 w-3 text-[#0f77ff]" />
                      Ready to Use
                    </div>
                  )}
                  <div className="w-[260px] aspect-[3/4] bg-white border border-[#e1e9f0] rounded-lg overflow-hidden origin-top scale-[0.90] transition-transform duration-300">
                    {template.preview}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#091135]">{template.name}</h3>
                      <span className="text-xs text-[#36394a]">{template.tag}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {template.features.map((feature) => (
                        <span
                          key={feature}
                          className="bg-[#f5f3ff] text-[#091135] text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#e1e9f0]"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {locked ? (
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        onClick={() => onRequireAccount(template.id, "register")}
                        disabled={isSessionPending}
                        className="flex-1 h-10 bg-[#127ee3] hover:bg-[#0f77ff] text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        Create Account to Unlock
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onRequireAccount(template.id, "login")}
                        disabled={isSessionPending}
                        className="h-10 px-4 rounded-lg border border-[#e1e9f0] bg-white text-sm font-medium text-[#091135] hover:bg-[#f5f3ff] transition-colors disabled:opacity-60"
                      >
                        Sign In
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelect(template.id)}
                      disabled={isSessionPending}
                      className="w-full h-10 mt-6 bg-[#127ee3] hover:bg-[#0f77ff] text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      Use {template.name}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
