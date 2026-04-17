"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export function FAQ() {
  const faqs = [
    { q: "Is this free invoice generator actually free?", a: "Yes, InvoiceKit is a 100% free invoice generator. No trial periods, no pro tiers, and no hidden fees." },
    { q: "Do I need to sign up for an invoice generator?", a: "You can use the Clean template and download PDFs without an account. Create a free account to unlock the rest of the template library, saved invoices, and email sending." },
    { q: "Can I choose my own invoice template?", a: "Yes. Guests can use the Clean template right away, and signed-in users can access the full collection of professional invoice templates." },
    { q: "Is my business data stored on your servers?", a: "No. Everything stays in your browser's private storage. We don't see or store your client data." },
    { q: "Can I add my own business logo to the free invoice template?", a: "Yes, the free Clean template supports high-quality logo uploads and customization, and so do the account-only templates." },
    { q: "Which currencies does the invoice maker support?", a: "We support USD, GBP, EUR, PKR, CAD, AUD, and many more for international billing." },
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[30px] font-bold text-foreground mb-12 text-center tracking-tight">
          Frequently Asked Questions about our Invoice Generator
        </h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.slice(0, 3).map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline hover:text-primary transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.slice(3, 6).map((faq, i) => (
                <AccordionItem key={i + 3} value={`item-${i + 3}`}>
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline hover:text-primary transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
