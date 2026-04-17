import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  metadataBase: new URL("https://invoicekit.app"),
  title: {
    default: "InvoiceKit | Free Professional Invoice Generator (No Sign Up)",
    template: "%s | InvoiceKit",
  },
  description:
    "Generate professional PDF invoices in seconds with our free online invoice maker. No account required, no watermarks, 100% free for freelancers and small businesses.",
  keywords: [
    "free invoice generator",
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
    title: "InvoiceKit | Free Professional Invoice Generator (No Sign Up)",
    description:
      "Create and download professional PDF invoices instantly. No account, no watermarks, completely free online invoice maker.",
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
    title: "InvoiceKit | Free Professional Invoice Generator (No Sign Up)",
    description:
      "Create and download professional PDF invoices instantly. No account, no watermarks, completely free.",
    images: ["/opengraph.jpg"],
  },
  alternates: {
    canonical: "/",
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
