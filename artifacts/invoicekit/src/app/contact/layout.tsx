import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have questions about InvoiceSync? Contact our support team for help with our free invoice generator and professional templates.",
  alternates: {
    canonical: "https://www.invoice-sync.com/contact",
  },
  openGraph: {
    title: "Contact Us | InvoiceSync",
    description: "Have questions about InvoiceSync? Contact our support team for help with our free invoice generator and professional templates.",
    url: "https://www.invoice-sync.com/contact",
    siteName: "InvoiceSync",
    type: "website",
    images: [
      {
        url: "/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "Contact InvoiceSync Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | InvoiceSync",
    description: "Have questions about InvoiceSync? Contact our support team for help with our free invoice generator and professional templates.",
    images: ["/opengraph.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
