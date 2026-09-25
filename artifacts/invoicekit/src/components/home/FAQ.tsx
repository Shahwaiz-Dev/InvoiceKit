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
      q: "Is this free invoice generator genuinely 100% free to use?",
      a: "Yes. InvoiceSync is a completely free online invoice maker. You can create and download unlimited professional PDF invoices with zero trial clocks, zero watermark penalties, and no credit card required.",
    },
    {
      q: "Can I use this online invoice maker without signing up?",
      a: "Yes! You can configure your invoice and generate production-ready PDFs immediately as a guest. Creating a free account is only required if you wish to save client profiles and access specialized invoice templates.",
    },
    {
      q: "Can I add my business logo and customize currencies in the free invoice maker?",
      a: "Yes. You can upload high-resolution PNG, SVG, or JPEG logos directly in our free invoice maker online. We support USD, EUR, GBP, CAD, AUD, JPY, INR, PKR, and all standard ISO currencies with localized symbols.",
    },
    {
      q: "Where is my client and billing data stored when creating invoices online?",
      a: "For guest users, all billing coordinates and financial figures remain strictly inside your browser's local storage. We never store, index, or sell your private client data.",
    },
    {
      q: "How does the PDF invoice download work?",
      a: "Invoices are rendered directly to vector print layouts conforming to standard A4 and US Letter specifications, ensuring crystal-clear text, exact math, and sharp logos on any screen or printer.",
    },
    {
      q: "What makes InvoiceSync the best free invoice generator online?",
      a: "Unlike typical billing tools that enforce monthly subscription paywalls or slap ugly watermarks on your PDFs, InvoiceSync delivers real-time calculation, modern templates, logo branding, and instant PDF download completely free.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#0f77ff] mb-2 block">
            Invoice Maker FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#091135] tracking-tight leading-tight">
            Frequently Asked Questions About Our Free Invoice Generator
          </h2>
          <p className="text-base text-[#36394a] max-w-lg mx-auto mt-2 tracking-normal">
            Everything you need to know about using our free online invoice maker, PDF export, and commercial data privacy.
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
