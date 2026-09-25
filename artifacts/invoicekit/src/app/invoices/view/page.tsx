"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Printer, CheckCircle, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

function InvoiceViewerContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const autoDownload = searchParams.get("download") === "1";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const autoDownloadedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setError("No invoice token provided");
      setLoading(false);
      return;
    }

    fetch(`/api/invoices/public?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invoice not found or expired");
        return res.json();
      })
      .then((data) => {
        setInvoice(data.invoiceData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load invoice");
        setLoading(false);
      });
  }, [token]);

  const handleDownload = async () => {
    if (!token) return;
    setIsDownloading(true);
    try {
      // Direct binary download from our API
      const res = await fetch(`/api/invoices/download?token=${encodeURIComponent(token)}`);
      if (res.ok && res.headers.get("Content-Type")?.includes("pdf")) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Invoice-${invoice?.invoiceNumber || "0001"}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Invoice downloaded successfully!");
        return;
      }

      // Fallback: render to PDF in browser
      const element = document.getElementById("public-invoice-paper");
      if (!element) {
        window.print();
        return;
      }
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0,
        filename: `Invoice-${invoice?.invoiceNumber || "0001"}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0 },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
      };
      await html2pdf().set(opt).from(element).save();
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Download failed. Use browser print instead.");
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (!loading && invoice && autoDownload && !autoDownloadedRef.current) {
      autoDownloadedRef.current = true;
      handleDownload();
    }
  }, [loading, invoice, autoDownload]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-600">Loading invoice details...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-slate-900 mb-2">Invoice Not Found</h1>
          <p className="text-sm text-slate-600 mb-6">
            {error || "This invoice link may have expired or is invalid. Please contact the sender for a new copy."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Go to Invoice-Sync
          </Link>
        </div>
      </div>
    );
  }

  const currency = invoice.currency || "USD";
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;
  const lineItems = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
  const subtotal = lineItems.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const taxAmount = subtotal * ((Number(invoice.taxRate) || 0) / 100);
  const discountAmount = subtotal * ((Number(invoice.discount) || 0) / 100);
  const shippingAmount = Number(invoice.shipping) || 0;
  const total = subtotal + taxAmount - discountAmount + shippingAmount;
  const amountPaid = Number(invoice.amountPaid) || 0;
  const balanceDue = Math.max(0, total - amountPaid);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-12">
      {/* Top Floating Control Bar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
              Invoice-Sync
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified Invoice
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-medium border-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </Button>

            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              size="sm"
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download Invoice
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Invoice Document Preview Container */}
      <main className="w-full max-w-[820px] px-4 pt-6 sm:pt-10">
        <div
          id="public-invoice-paper"
          className="bg-white rounded-xl shadow-lg border border-slate-200/80 p-8 sm:p-12 transition-all"
          style={{ minHeight: "1000px" }}
        >
          {/* Header Row: Logo & Invoice Details */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              {invoice.logoUrl ? (
                <img
                  src={invoice.logoUrl}
                  alt={invoice.businessName || "Business Logo"}
                  className="max-h-16 max-w-[200px] object-contain mb-3"
                />
              ) : null}
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {invoice.businessName || "Invoice"}
              </h1>
              {invoice.businessEmail && (
                <p className="text-xs text-slate-500 mt-0.5">{invoice.businessEmail}</p>
              )}
              {invoice.businessAddress && (
                <p className="text-xs text-slate-500 whitespace-pre-line mt-1">{invoice.businessAddress}</p>
              )}
              {invoice.taxId && (
                <p className="text-xs text-slate-400 mt-1">Tax ID: {invoice.taxId}</p>
              )}
            </div>

            <div className="text-left sm:text-right bg-slate-50/80 sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                INVOICE
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                #{invoice.invoiceNumber || "0001"}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                <span className="font-semibold text-slate-700">Date:</span> {invoice.issueDate || "—"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">Due:</span> {invoice.dueDate || "Upon Receipt"}
              </div>
              {invoice.terms && (
                <div className="text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">Terms:</span> {invoice.terms}
                </div>
              )}
            </div>
          </div>

          {/* Bill To Card */}
          <div className="py-6 border-b border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Billed To
            </div>
            <div className="text-base font-bold text-slate-900">
              {invoice.clientName || "Valued Client"}
            </div>
            {invoice.clientEmail && (
              <p className="text-xs text-blue-600 mt-0.5">{invoice.clientEmail}</p>
            )}
            {invoice.clientAddress && (
              <p className="text-xs text-slate-500 whitespace-pre-line mt-1">{invoice.clientAddress}</p>
            )}
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3 pr-4">Description</th>
                  <th className="py-3 px-3 text-center w-16">Qty</th>
                  <th className="py-3 px-3 text-right w-28">Rate</th>
                  <th className="py-3 pl-3 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {lineItems.map((item: any, index: number) => {
                  const qty = Number(item.quantity) || 1;
                  const price = Number(item.unitPrice) || 0;
                  const amount = qty * price;
                  return (
                    <tr key={index}>
                      <td className="py-3.5 pr-4 font-medium text-slate-900">
                        {item.description || "Service Item"}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-500">{qty}</td>
                      <td className="py-3.5 px-3 text-right text-slate-600">
                        {currencySymbol}{price.toFixed(2)}
                      </td>
                      <td className="py-3.5 pl-3 text-right font-bold text-slate-900">
                        {currencySymbol}{amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes Section */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            {/* Notes */}
            <div>
              {invoice.notes && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Notes & Terms
                  </div>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Financial Calculations */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span className="font-semibold text-slate-900">+{currencySymbol}{taxAmount.toFixed(2)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({invoice.discount}%)</span>
                  <span className="font-semibold">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {shippingAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">+{currencySymbol}{shippingAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>{currencySymbol}{total.toFixed(2)}</span>
              </div>
              {amountPaid > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Amount Paid</span>
                  <span>-{currencySymbol}{amountPaid.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-blue-600 pt-2 border-t-2 border-blue-600">
                <span>Balance Due</span>
                <span>{currencySymbol}{balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PublicInvoiceViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <InvoiceViewerContent />
    </Suspense>
  );
}
