"use client";

import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole } from "lucide-react";
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
      name: "Clean",
      tag: "Minimalist",
      features: ["Logo Upload", "Tax Support"],
      preview: (
        <div className="w-full h-full bg-white p-4 flex flex-col font-sans text-[8px] text-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-sm"></div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-primary mb-1">INVOICE</div>
              <div className="text-gray-400">INV-001</div>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <div className="font-bold mb-1">Bill To:</div>
              <div className="text-gray-500">Acme Corp</div>
            </div>
            <div className="text-right">
              <div className="font-bold mb-1">Total Due:</div>
              <div className="text-[10px] font-bold">$1,200.00</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex border-y border-gray-200 py-1 mb-1 font-bold">
              <div className="flex-1">Item</div>
              <div className="w-8 text-right">Qty</div>
              <div className="w-12 text-right">Price</div>
            </div>
            <div className="flex py-1 text-gray-500">
              <div className="flex-1">Design Services</div>
              <div className="w-8 text-right">1</div>
              <div className="w-12 text-right">$1,200</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "corporate",
      name: "Corporate",
      tag: "Corporate",
      features: ["Formal Layout", "Auto Totals"],
      preview: (
        <div className="w-full h-full bg-white flex flex-col font-sans text-[8px] text-gray-800">
          <div className="bg-[#1E3A8A] text-white p-4 flex justify-between items-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-sm"></div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider">Invoice</div>
              <div className="text-white/70">INV-001</div>
            </div>
          </div>
          <div className="px-4 flex-1">
            <div className="flex justify-between mb-4">
              <div>
                <div className="font-bold text-[#1E3A8A] mb-1">BILL TO</div>
                <div className="text-gray-500">Acme Corp</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#1E3A8A] mb-1">AMOUNT DUE</div>
                <div className="text-[10px] font-bold">$1,200.00</div>
              </div>
            </div>
            <div className="flex bg-gray-100 py-1 px-2 mb-1 font-bold text-[#1E3A8A]">
              <div className="flex-1">DESCRIPTION</div>
              <div className="w-12 text-right">TOTAL</div>
            </div>
            <div className="flex py-1 px-2 text-gray-600 border-b border-gray-100">
              <div className="flex-1">Design Services</div>
              <div className="w-12 text-right">$1,200</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "minimal",
      name: "Minimal",
      tag: "Creative",
      features: ["Ultra Sparse", "Clean Typography"],
      preview: (
        <div className="w-full h-full bg-white p-4 flex flex-col font-serif text-[8px] text-gray-800">
          <div className="text-right mb-6">
            <div className="text-[12px] mb-1">Invoice 001</div>
            <div className="text-gray-400 font-sans">Oct 24, 2026</div>
          </div>
          <div className="mb-6">
            <div className="text-gray-400 font-sans mb-1">To</div>
            <div>Acme Corp</div>
          </div>
          <div className="flex-1">
            <div className="flex border-b border-gray-100 py-1 text-gray-500 font-sans">
              <div className="flex-1">Services</div>
              <div className="w-12 text-right">$1,200</div>
            </div>
            <div className="flex justify-end pt-2">
              <div className="w-24 flex justify-between font-bold">
                <span>Total</span>
                <span>$1,200</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contractor",
      name: "Contractor",
      tag: "Contractor",
      features: ["Day Rates", "Bold Header"],
      preview: (
        <div className="w-full h-full bg-white flex flex-col font-sans text-[8px] text-gray-800">
          <div className="border-b-4 border-[#EA580C] p-4 flex justify-between items-end mb-4">
            <div className="text-[14px] font-black text-[#EA580C] tracking-tighter">INVOICE</div>
            <div className="text-right">
              <div className="font-bold text-gray-800">INV-001</div>
            </div>
          </div>
          <div className="px-4 flex-1">
            <div className="flex justify-between mb-4 bg-gray-50 p-2">
              <div>
                <div className="font-bold text-gray-400 text-[6px] uppercase mb-1">Client</div>
                <div className="font-bold">Acme Corp</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-400 text-[6px] uppercase mb-1">Total Due</div>
                <div className="text-[10px] font-bold text-[#EA580C]">$1,200.00</div>
              </div>
            </div>
            <div className="flex border-b border-gray-200 py-1 mb-1 font-bold text-[6px] uppercase text-gray-400">
              <div className="flex-1">Work Done</div>
              <div className="w-12 text-right">Amount</div>
            </div>
            <div className="flex py-1 border-b border-gray-100">
              <div className="flex-1 font-bold">Design Services</div>
              <div className="w-12 text-right">$1,200</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="templates" className="py-24 bg-background px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-accent text-[12px] font-bold uppercase tracking-widest mb-3 block">Templates</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Start Free with Clean. Unlock the Rest with an Account.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Guests can jump straight into the <strong>Clean</strong> template and download PDFs instantly. Create a free account to unlock the rest of the <strong>invoice template</strong> library, saved invoices, and email sending.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {templates.map((template) => {
            const locked = !isAuthenticated && !isGuestTemplate(template.id);
            const cardClass = locked
              ? "group bg-white rounded-xl border border-amber-200 overflow-hidden transition-colors hover:border-amber-300 shadow-sm"
              : "group bg-white rounded-xl border border-border overflow-hidden transition-colors hover:border-primary shadow-sm";

            return (
              <motion.div
                key={template.id}
                whileHover={{ y: -4, scale: 1.01 }}
                className={cardClass}
              >
                <div className="p-6 bg-gray-50/50 border-b border-border flex justify-center items-center relative">
                  {locked ? (
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                      <LockKeyhole className="h-3.5 w-3.5" />
                      Account required
                    </div>
                  ) : null}
                  <div className="w-[240px] aspect-[3/4] bg-white shadow-md border border-gray-100 overflow-hidden origin-top scale-[0.85] group-hover:scale-[0.87] transition-transform duration-300">
                    {template.preview}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                      <span className="text-sm text-muted-foreground">{template.tag}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {template.features.map((feature) => (
                        <span key={feature} className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {locked ? (
                    <>
                      <p className="mb-4 text-sm leading-6 text-muted-foreground">
                        Create an account to use the <strong>{template.name}</strong> template and keep your invoices, customer details, and premium layouts in sync.
                      </p>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => onRequireAccount(template.id, "register")}
                          disabled={isSessionPending}
                          className="w-full h-12 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          Create Free Account <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRequireAccount(template.id, "login")}
                          disabled={isSessionPending}
                          className="w-full h-11 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/40 transition-colors disabled:opacity-60"
                        >
                          Already have an account? Sign in
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => onSelect(template.id)}
                      disabled={isSessionPending}
                      className="w-full h-12 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {template.id === "clean" && !isAuthenticated ? "Use Clean Template" : "Use This Template"}
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
