import type { Metadata } from "next";
import Script from "next/script";
import HomePage from "@/features/HomePage";

export const metadata: Metadata = {
  title: "Free Invoice Generator | Create Professional Invoice Templates Online",
  description:
    "Generate professional PDF invoices instantly with our free invoice generator. Choose from multiple professional templates, no watermarks, and zero sign-up required. Secure, fast, and easy to use.",
  alternates: {
    canonical: "https://www.invoice-sync.com",
  },
  openGraph: {
    title: "100% Free Invoice Generator | InvoiceKit",
    description: "Create and download professional invoices in seconds. No sign-up, no hidden fees, and zero watermarks.",
    url: "https://www.invoice-sync.com",
    siteName: "InvoiceKit",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InvoiceKit",
    url: "https://www.invoice-sync.com",
    logo: "https://www.invoice-sync.com/favicon.svg",
    description: "Free professional invoice generator for freelancers, contractors, and small businesses.",
  };

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
    description:
      "InvoiceKit is a professional-grade free invoice generator that lets anyone create PDF invoices with zero watermarks.",
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
          text: "Yes, InvoiceKit is a 100% free invoice generator. No trial periods, no pro tiers, and no hidden fees.",
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
    name: "InvoiceKit",
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
