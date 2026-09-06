import type { Metadata } from "next";
import Script from "next/script";
import HomePage from "@/features/HomePage";

export const metadata: Metadata = {
  title: "Free Invoice Generator (No Sign-Up) | Instant PDF Invoice Maker",
  description:
    "Create and download professional PDF invoices in seconds with zero sign-up required. 100% free in-browser invoice maker, no watermarks, instant PDF export, and multiple professional templates.",
  alternates: {
    canonical: "https://www.invoice-sync.com",
  },
  openGraph: {
    title: "Free Invoice Generator (No Sign-Up) | InvoiceBro",
    description: "Create and download professional invoices in seconds. No sign-up, no hidden fees, and zero watermarks.",
    url: "https://www.invoice-sync.com",
    siteName: "InvoiceBro",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InvoiceBro",
    url: "https://www.invoice-sync.com",
    logo: "https://www.invoice-sync.com/favicon.svg",
    description: "Free professional invoice generator for freelancers, contractors, and small businesses.",
  };

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InvoiceBro",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "InvoiceBro is a professional-grade free invoice generator that lets anyone create PDF invoices with zero watermarks.",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this free invoice generator actually free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, InvoiceBro is a 100% free invoice generator. No trial periods, no pro tiers, and no hidden fees.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to sign up for an invoice generator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can use the Clean template and download PDFs without an account. Create a free account to unlock the rest of the template library, saved invoices, and email sending.",
        },
      },
      {
        "@type": "Question",
        name: "Can I choose my own invoice template?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Guests can use the Clean template right away, and signed-in users can access the full collection of professional invoice templates.",
        },
      },
      {
        "@type": "Question",
        name: "Is my business data stored on your servers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Everything stays in your browser's private storage. We don't see or store your client data.",
        },
      },
      {
        "@type": "Question",
        name: "Can I add my own business logo to the free invoice template?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the free Clean template supports high-quality logo uploads and customization, and so do the account-only templates.",
        },
      },
      {
        "@type": "Question",
        name: "Which currencies does the invoice maker support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We support USD, GBP, EUR, PKR, CAD, AUD, and many more for international billing.",
        },
      },
    ],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.invoice-sync.com",
    name: "InvoiceBro",
    description: "Free professional invoice generator",
  };

  return (
    <>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
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
      <HomePage />
    </>
  );
}
