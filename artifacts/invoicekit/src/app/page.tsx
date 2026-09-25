import type { Metadata } from "next";
import HomePage from "@/features/HomePage";

export const metadata: Metadata = {
  title: "Free Invoice Generator (No Sign-Up) | Instant PDF Invoice Maker",
  description:
    "Create and download professional PDF invoices in seconds with zero sign-up required. 100% free in-browser invoice maker, no watermarks, instant PDF export, and multiple professional templates.",
  alternates: {
    canonical: "https://www.invoice-sync.com",
  },
  openGraph: {
    title: "Free Invoice Generator (No Sign-Up) | InvoiceSync",
    description: "Create and download professional invoices in seconds. No sign-up, no hidden fees, and zero watermarks.",
    url: "https://www.invoice-sync.com",
    siteName: "InvoiceSync",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.invoice-sync.com/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "InvoiceSync - Free Professional Invoice Generator",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator (No Sign-Up) | InvoiceSync",
    description: "Create and download professional invoices in seconds. No sign-up, no hidden fees, and zero watermarks.",
    images: ["https://www.invoice-sync.com/opengraph.jpg"],
  },
};

export default function Page() {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InvoiceSync",
    url: "https://www.invoice-sync.com",
    logo: "https://www.invoice-sync.com/Logo.png",
    description: "Free professional invoice generator for freelancers, contractors, and small businesses.",
  };

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InvoiceSync",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "InvoiceSync is a professional-grade free invoice generator that lets anyone create PDF invoices with zero watermarks.",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this free invoice generator genuinely 100% free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. InvoiceSync is a completely free online invoice maker. You can create and download unlimited professional PDF invoices with zero trial clocks, zero watermark penalties, and no credit card required.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this online invoice maker without signing up?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! You can configure your invoice and generate production-ready PDFs immediately as a guest. Creating a free account is only required if you wish to save client profiles and access specialized invoice templates.",
        },
      },
      {
        "@type": "Question",
        name: "Can I add my business logo and customize currencies in the free invoice maker?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can upload high-resolution PNG, SVG, or JPEG logos directly in our free invoice maker online. We support USD, EUR, GBP, CAD, AUD, JPY, INR, PKR, and all standard ISO currencies with localized symbols.",
        },
      },
      {
        "@type": "Question",
        name: "Where is my client and billing data stored when creating invoices online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For guest users, all billing coordinates and financial figures remain strictly inside your browser's local storage. We never store, index, or sell your private client data.",
        },
      },
      {
        "@type": "Question",
        name: "How does the PDF invoice download work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Invoices are rendered directly to vector print layouts conforming to standard A4 and US Letter specifications, ensuring crystal-clear text, exact math, and sharp logos on any screen or printer.",
        },
      },
      {
        "@type": "Question",
        name: "What makes InvoiceSync the best free invoice generator online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Unlike typical billing tools that enforce monthly subscription paywalls or slap ugly watermarks on your PDFs, InvoiceSync delivers real-time calculation, modern templates, logo branding, and instant PDF download completely free.",
        },
      },
    ],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.invoice-sync.com",
    name: "InvoiceSync",
    description: "Free professional invoice generator",
  };

  return (
    <>
      <script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        id="software-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePage />
    </>
  );
}
