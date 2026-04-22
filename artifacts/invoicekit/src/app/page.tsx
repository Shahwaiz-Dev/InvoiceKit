import type { Metadata } from "next";
import Script from "next/script";
import HomePage from "@/features/HomePage";

export const metadata: Metadata = {
  title: "Free Invoice Generator | Create Professional Invoice Templates Online",
  description:
    "Generate professional PDF invoices instantly with our free invoice generator. Choose from multiple professional templates, no watermarks, and zero sign-up required. Secure, fast, and easy to use.",
  alternates: {
    canonical: "https://invoicekit.app",
  },
  openGraph: {
    title: "100% Free Invoice Generator | InvoiceKit",
    description: "Create and download professional invoices in seconds. No sign-up, no hidden fees, and zero watermarks.",
    url: "https://invoicekit.app",
    siteName: "InvoiceKit",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  const softwareLd = {
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1250",
    },
    description:
      "InvoiceKit is a professional-grade free invoice generator that lets anyone create PDF invoices with zero watermarks.",
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
          text: "Yes, InvoiceKit is 100% free with no trial periods, hidden fees, or pro tiers for basic generation.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account to make an invoice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No account is required to generate invoices using our Clean template. You can download your PDF instantly.",
        },
      },
      {
        "@type": "Question",
        name: "Will there be watermarks on my PDF invoices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely not. Every invoice generated with InvoiceKit is watermark-free, regardless of which template you choose.",
        },
      },
      {
        "@type": "Question",
        name: "What file format are the invoices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All invoices are generated as high-quality, print-ready PDF documents.",
        },
      },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://invoicekit.app",
      },
    ],
  };

  return (
    <>
      <Script
        id="software-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <HomePage />
    </>
  );
}
