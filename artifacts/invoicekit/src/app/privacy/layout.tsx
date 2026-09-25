import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy for InvoiceSync. Understand how we protect your information, invoice data, and respect your privacy.",
  alternates: {
    canonical: "https://www.invoice-sync.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | InvoiceSync",
    description: "Read the Privacy Policy for InvoiceSync. Understand how we protect your information and respect your privacy.",
    url: "https://www.invoice-sync.com/privacy",
    siteName: "InvoiceSync",
    type: "website",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
