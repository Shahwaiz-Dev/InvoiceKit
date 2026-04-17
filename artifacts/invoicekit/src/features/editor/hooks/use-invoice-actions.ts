import { useState } from "react";
import { InvoiceData, TemplateType } from "@/lib/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { resolveOklchColor } from "../lib/editor-utils";

export function useInvoiceActions() {
  const [isSending, setIsSending] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const router = useRouter();

  const handleDownload = async (
    values: InvoiceData,
    setData: (data: InvoiceData) => void,
    session: any,
    usageData: any,
    invoiceId: string | null,
    saveInvoiceToDB: (values: InvoiceData, status: string) => Promise<string | undefined>
  ) => {
    if (session && usageData) {
      if (usageData.usage >= usageData.limit) {
        toast.error("Monthly usage limit reached. Please upgrade to Pro.");
        router.push("/dashboard");
        return;
      }
      if (!invoiceId) {
        await saveInvoiceToDB(values, "draft");
      }
    }

    setData(values);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const element = document.getElementById("print-area");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;
    const opt = {
      margin: 0,
      filename: `invoice-${values.invoiceNumber || "001"}.pdf`,
      image: { type: "jpeg" as const, quality: 1.0 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        letterRendering: true,
        scrollY: -window.scrollY,
        logging: false,
        onclone: (clonedDoc: Document) => {
          const elements = clonedDoc.querySelectorAll(
            '[style*="oklch"], [style*="oklab"], [class*="bg-"], [class*="text-"], [class*="border-"], [class*="font-"]'
          );

          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            * { font-family: 'Inter', system-ui, -apple-system, sans-serif !important; }
          `;
          clonedDoc.head.appendChild(style);

          elements.forEach((el) => {
            const node = el as HTMLElement;
            const computedStyle = window.getComputedStyle(node);
            if (node.classList.contains('tracking-tighter')) {
              node.style.letterSpacing = '-0.02em';
            }

            const colorProps = ["color", "backgroundColor", "borderColor", "borderTopColor", "borderBottomColor", "borderLeftColor", "borderRightColor"];
            colorProps.forEach((prop) => {
              const cssProperty = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
              const val = node.style.getPropertyValue(cssProperty) || computedStyle.getPropertyValue(cssProperty);

              if (val && (val.includes("oklab") || val.includes("oklch") || val.includes("from"))) {
                node.style.setProperty(cssProperty, resolveOklchColor(val));
              }
            });
          });

          const printArea = clonedDoc.getElementById("print-area");
          if (printArea) {
            printArea.style.width = "210mm";
            printArea.style.height = "297mm";
            printArea.style.transform = "none";
          }

          const heavyEffects = clonedDoc.querySelectorAll(".blur-\\[120px\\], .absolute.rounded-full.opacity-20, .shadow-xl, .shadow-2xl");
          heavyEffects.forEach((el) => {
            const node = el as HTMLElement;
            if (node.classList.contains('blur-[120px]')) node.style.display = "none";
            else node.style.boxShadow = "none";
          });
          
          const images = clonedDoc.querySelectorAll("img");
          images.forEach(img => {
            if (!img.src.startsWith('data:')) img.crossOrigin = "anonymous";
          });
        },
      },
      jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const, compress: true },
    };

    try {
      await html2pdf().set(opt).from(element).save();
      return true;
    } catch (error) {
      console.error("PDF generation failed:", error);
      window.print();
      return false;
    }
  };

  const handleSendEmail = async (values: InvoiceData, session: any) => {
    if (!session) {
      toast.error("Please login to send invoices via email", {
        action: { label: "Login", onClick: () => router.push("/login") },
      });
      return;
    }

    if (!values.clientEmail) {
      toast.error("Please provide a client email address");
      return;
    }

    setIsSending(true);
    try {
      const subtotal = values.lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      const taxAmount = subtotal * (values.taxRate / 100);
      const discountAmount = subtotal * (values.discount / 100);
      const total = subtotal + taxAmount - discountAmount;

      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: values.clientEmail,
          invoiceData: {
            ...values,
            totalAmount: total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(`Invoice sent to ${values.clientEmail}`);
      } else {
        toast.error(result.error || "Failed to send email");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  return {
    handleDownload,
    handleSendEmail,
    isSending,
    isSavingToDb,
    setIsSavingToDb,
  };
}
