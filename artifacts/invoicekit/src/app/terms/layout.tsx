import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for InvoiceKit. Guidelines and terms governing your use of our free invoice generator and templates.",
  alternates: {
    canonical: "https://www.invoice-sync.com/terms",
  },
  openGraph: {
    title: "Terms of Service | InvoiceKit",
    description: "Read the Terms of Service for InvoiceKit. Guidelines and terms governing your use of our service.",
    url: "https://www.invoice-sync.com/terms",
    siteName: "InvoiceKit",
    type: "website",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
