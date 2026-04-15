import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export function FAQ() {
  const faqs = [
    { q: "Is InvoiceKit really free?", a: "Yes, always. No trial, no pro tier." },
    { q: "Do I need to create an account?", a: "Never. No email, no password." },
    { q: "Will there be watermarks on my PDF?", a: "None. Zero. Not even a tiny footer." },
    { q: "Is my data stored anywhere?", a: "No. Everything stays in your browser." },
    { q: "Can I use my own logo?", a: "Yes, all 4 templates support logo upload." },
    { q: "What currencies are supported?", a: "USD, GBP, EUR, PKR, CAD, AUD, and more." },
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[30px] font-bold text-foreground mb-12 text-center tracking-tight">
          Questions? We've got them covered.
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
