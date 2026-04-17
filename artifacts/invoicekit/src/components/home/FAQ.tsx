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
    { q: "Is this online invoice maker really free?", a: "Yes, InvoiceKit is 100% free. No trial periods, no pro tiers, and no hidden fees." },
    { q: "Do I need to sign up to use the invoice generator?", a: "No, you never need to create an account. No email or password is required to generate your PDF invoices." },
    { q: "Will there be watermarks on my PDF invoices?", a: "None at all. We provide professional PDF invoices with zero branding or watermarks." },
    { q: "Is my business data stored on your servers?", a: "No. Everything stays in your browser's private storage. We don't see or store your client data." },
    { q: "Can I add my own business logo to the templates?", a: "Yes, all 4 of our professional invoice templates support high-quality logo uploads." },
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
