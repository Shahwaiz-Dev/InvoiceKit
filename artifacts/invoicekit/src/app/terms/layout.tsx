import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for InvoiceSync. Guidelines and terms governing your use of our free invoice generator and templates.",
  alternates: {
    canonical: "https://www.invoice-sync.com/terms",
  },
  openGraph: {
    title: "Terms of Service | InvoiceSync",
    description: "Read the Terms of Service for InvoiceSync. Guidelines and terms governing your use of our service.",
    url: "https://www.invoice-sync.com/terms",
    siteName: "InvoiceSync",
    type: "website",
    images: [
      {
        url: "https://www.invoice-sync.com/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "Terms of Service | InvoiceSync",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | InvoiceSync",
    description: "Read the Terms of Service for InvoiceSync. Guidelines and terms governing your use of our service.",
    images: ["https://www.invoice-sync.com/opengraph.jpg"],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
