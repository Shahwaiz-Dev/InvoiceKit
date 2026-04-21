import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Great_Vibes, Pacifico, Dancing_Script } from "next/font/google";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature-1",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature-2",
});

const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-signature-3",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://invoicekit.app"),
  title: {
    default: "Free Invoice Generator | Create Professional Invoice Templates Online",
    template: "%s | Professional Invoice Templates | InvoiceKit",
  },
  description:
    "InvoiceKit is a free invoice generator for creating professional PDF invoices instantly. Use the Clean template without signing up, then create an account to unlock the full template library.",
  keywords: [
    "invoice generator",
    "invoice template",
    "free invoice generator",
    "invoice generator free",
    "online invoice maker",
    "free invoice generator no sign up",
    "pdf invoice templates",
    "freelance billing tool",
    "simple invoice creator",
    "business invoice generator",
    "free invoice software",
    "no login invoice generator",
  ],
  openGraph: {
    title: "InvoiceKit | Free Professional Invoice Generator",
    description:
      "Create and download professional PDF invoices instantly. Start with the Clean template for free and unlock the full library with an account.",
    type: "website",
    url: "https://invoicekit.app",
    siteName: "InvoiceKit",
    images: [
      {
        url: "/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "InvoiceKit Free Professional Invoice Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoiceKit | Free Professional Invoice Generator",
    description:
      "Create and download professional PDF invoices instantly. Clean is free for everyone, with more templates unlocked by account.",
    images: ["/opengraph.jpg"],
  },
  alternates: {
    canonical: "https://invoicekit.app",
    languages: {
      "en-US": "https://invoicekit.app",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://invoicekit.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Templates",
        item: "https://invoicekit.app/templates",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${greatVibes.variable} ${pacifico.variable} ${dancingScript.variable}`}
    >
      <body suppressHydrationWarning className="font-sans antialiased">
        <Script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <Providers>
          {children}
          {/* Preload/warm-up for fonts used in invoices and dashboard numbers */}
          <div className="font-mono invisible h-0 w-0 overflow-hidden" aria-hidden="true">.</div>
        </Providers>
      </body>
    </html>
  );
}
