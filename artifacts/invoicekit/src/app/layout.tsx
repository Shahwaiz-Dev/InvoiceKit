import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  metadataBase: new URL("https://invoicekit.app"),
  title: {
    default: "Free Invoice Generator | Create Professional Invoice Templates Online",
    template: "%s | InvoiceKit",
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
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
