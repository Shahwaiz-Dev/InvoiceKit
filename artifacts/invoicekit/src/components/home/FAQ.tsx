"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      q: "Is InvoiceKit genuinely free to use?",
      a: "Yes. The Clean template is 100% free with no trial clocks, no watermark penalties, and no credit card requirements.",
    },
    {
      q: "Do I need an account to download an invoice?",
      a: "No. You can configure your invoice and generate production-ready PDFs as a guest immediately. Signing up is only required if you wish to persist client profiles or access additional templates.",
    },
    {
      q: "Can I add custom brand logos?",
      a: "Yes. You can upload high-resolution PNG, SVG, or JPEG logos directly in the browser editor. Logos are rendered sharply in the exported PDF.",
    },
    {
      q: "Where is my client and billing data stored?",
      a: "For guests, all data stays securely within your browser's private local storage. We do not transmit or index your commercial figures on external databases without your authenticated intent.",
    },
    {
      q: "Which international currencies are supported?",
      a: "InvoiceKit supports USD, EUR, GBP, CAD, AUD, JPY, INR, PKR, and all standard ISO currency codes with proper localized symbol placement.",
    },
    {
      q: "How does the PDF export work?",
      a: "Invoices are converted directly to vector print layouts matching A4 and US Letter standards, ensuring crystal-clear text and lines on any screen or printer.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[13px] font-medium uppercase tracking-[0.004em] text-[#091135] mb-2 block">
            Knowledge base
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#091135] tracking-[0.512px] leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[#36394a] max-w-lg mx-auto mt-2 tracking-[0.128px]">
            Key facts regarding privacy boundaries, PDF vector export, and template unlocks.
          </p>
        </div>

        <div className="rounded-xl border border-[#e1e9f0] bg-white divide-y divide-[#e1e9f0]">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-[#e1e9f0] last:border-b-0 px-6">
                <AccordionTrigger className="text-left font-medium text-[16px] text-[#091135] hover:no-underline py-5 hover:text-[#0f77ff] transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-[#36394a] leading-relaxed pb-5 tracking-[0.056px]">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
