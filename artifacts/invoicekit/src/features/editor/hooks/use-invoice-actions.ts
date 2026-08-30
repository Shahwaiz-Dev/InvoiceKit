import { useState } from "react";
import { InvoiceData } from "@/lib/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { resolveModernColor } from "../lib/editor-utils";

interface UsageData {
  usage: number;
  limit: number;
  isPro: boolean;
}

export function useInvoiceActions() {
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleDownload = async (
    values: InvoiceData,
    setData: (data: InvoiceData) => void,
    session: any,
    usageData: UsageData | null,
    invoiceId: string | null,
    saveInvoiceToDB: (values: InvoiceData, status: "draft" | "sent") => Promise<void>
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

    // Small delay to ensure any pending state updates are flushed and fonts are ready
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }
    } catch {
      // Ignore font readiness errors
    }

    const element = document.getElementById("print-area");
    if (!element) {
      toast.error("Could not find print area");
      return;
    }

    const html2pdf = (await import("html2pdf.js")).default;
    const opt = {
      margin: 0,
      filename: `invoice-${values.invoiceNumber || "001"}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        scrollX: 0,
        windowWidth: 794,
        logging: false,
        onclone: (clonedDoc: Document) => {
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700;800;900&family=Great+Vibes&family=Pacifico&family=Dancing+Script:wght@400;700&family=Roboto+Mono:wght@400;500;700&display=swap');
            
            :root, html, body {
              --font-signature-1: 'Great Vibes', cursive !important;
              --font-signature-2: 'Pacifico', cursive !important;
              --font-signature-3: 'Dancing Script', cursive !important;
              --app-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              --font-geist-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              --app-font-serif: 'DM Serif Display', Georgia, serif !important;
              --font-serif: 'DM Serif Display', Georgia, serif !important;
              --app-font-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, monospace !important;
              --font-geist-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, monospace !important;
              --font-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, monospace !important;
            }

            .font-serif {
              font-family: 'DM Serif Display', Georgia, serif !important;
            }

            .font-mono {
              font-family: 'Roboto Mono', ui-monospace, SFMono-Regular, monospace !important;
            }

            .font-sans {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
          `;
          clonedDoc.head.appendChild(style);

          // Handle signatures explicitly
          const sigElements = clonedDoc.querySelectorAll(".signature-font");
          sigElements.forEach((el) => {
            const node = el as HTMLElement;
            const sigFont = node.getAttribute("data-sigfont") || "";
            if (sigFont.includes("signature-1") || sigFont.toLowerCase().includes("great vibes")) {
              node.style.setProperty("font-family", "'Great Vibes', cursive", "important");
            } else if (sigFont.includes("signature-2") || sigFont.toLowerCase().includes("pacifico")) {
              node.style.setProperty("font-family", "'Pacifico', cursive", "important");
            } else if (sigFont.includes("signature-3") || sigFont.toLowerCase().includes("dancing script")) {
              node.style.setProperty("font-family", "'Dancing Script', cursive", "important");
            } else if (sigFont) {
              node.style.setProperty("font-family", `${sigFont}, cursive`, "important");
            }
          });

          // Fix any background-clip text for html2canvas compatibility
          const gradientTexts = clonedDoc.querySelectorAll(".bg-clip-text, [class*='bg-clip-text']");
          gradientTexts.forEach((el) => {
            const node = el as HTMLElement;
            node.style.webkitBackgroundClip = "initial";
            node.style.backgroundClip = "initial";
            node.style.color = "#c026d3";
            node.style.backgroundImage = "none";
          });

          const elements = clonedDoc.querySelectorAll("*");
          elements.forEach((el) => {
            const node = el as HTMLElement;
            const computedStyle = window.getComputedStyle(node);
            if (node.classList.contains('tracking-tighter')) {
              node.style.letterSpacing = '-0.02em';
            }

            const colorProps = [
              "color", 
              "backgroundColor", 
              "borderColor", 
              "borderTopColor", 
              "borderBottomColor", 
              "borderLeftColor", 
              "borderRightColor", 
              "outlineColor", 
              "fill", 
              "stroke",
              "boxShadow",
              "background",
              "backgroundImage",
              "border",
              "outline"
            ];
            colorProps.forEach((prop) => {
              const cssProperty = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
              const val = node.style.getPropertyValue(cssProperty) || computedStyle.getPropertyValue(cssProperty);

              const isModernColor = val && (val.includes("oklch") || val.includes("oklab") || val.includes("lab") || val.includes("lch") || val.includes("hwb") || val.includes("from") || val.includes("color-mix"));
              if (isModernColor) {
                node.style.setProperty(cssProperty, resolveModernColor(val));
              }
            });
          });

          const printArea = clonedDoc.getElementById("print-area");
          if (printArea) {
            printArea.style.width = "794px";
            printArea.style.minHeight = "1123px";
            printArea.style.height = "auto";
            printArea.style.transform = "none";
            printArea.style.margin = "0";
            printArea.style.boxSizing = "border-box";
            printArea.style.fontSize = "14px";
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
      toast.error("PDF generation failed. Use browser print instead.");
      window.print();
      return false;
    }
  };

  const handleSendEmail = async (values: InvoiceData, session: any) => {
    if (!session) {
      const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
      toast.error("Please login to send invoices via email", {
        action: { 
          label: "Login", 
          onClick: () => router.push(`/login?callbackUrl=${callbackUrl}` as any) 
        },
      });
      return;
    }

    if (!values.clientEmail) {
      toast.error("Please provide a client email address");
      return;
    }

    setIsSending(true);
    
    const sendPromise = async () => {
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
      if (!response.ok) throw new Error(result.error || "Failed to send email");
      return result;
    };

    toast.promise(sendPromise(), {
      loading: "Sending invoice...",
      success: () => {
        setIsSending(false);
        return `Invoice sent to ${values.clientEmail}`;
      },
      error: (err) => {
        setIsSending(false);
        return err.message;
      }
    });
  };

  return {
    handleDownload,
    handleSendEmail,
    isSending,
  };
}
