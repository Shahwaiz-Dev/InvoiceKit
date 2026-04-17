import type { Metadata } from "next";
import Script from "next/script";
import HomePage from "@/features/HomePage";

export const metadata: Metadata = {
  title: "Free Invoice Generator & Professional Invoice Templates",
  description:
    "Generate professional PDF invoices with our free invoice generator. Choose a free invoice template, customize, and download instantly. No sign up required, always free.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InvoiceKit",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "InvoiceKit is a free invoice generator that allows users to create professional PDF invoices using customizable invoice templates without signing up.",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is InvoiceKit really free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, InvoiceKit is 100% free with no trial periods or pro tiers.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, you never need to create an account. No email or password is required.",
        },
      },
      {
        "@type": "Question",
        name: "Will there be watermarks on my PDF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, there are zero watermarks on any invoices generated with InvoiceKit.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="invoicekit-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePage />
    </>
  );
}
