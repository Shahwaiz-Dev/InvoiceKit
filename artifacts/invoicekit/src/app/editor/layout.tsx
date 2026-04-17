import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Editor | InvoiceKit",
  description: "Create and customize your professional invoice. Download as PDF or send directly to your client.",
  robots: { index: false, follow: false },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
