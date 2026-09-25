import { db } from "@workspace/db";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export const dynamic = "force-dynamic";

function generateServerPdf(invoiceData: any): Buffer {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const currency = invoiceData.currency || "USD";
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;
  const num = invoiceData.invoiceNumber || "0001";
  const business = invoiceData.businessName || "Invoice-Sync";
  const client = invoiceData.clientName || "Valued Client";
  const issueDate = invoiceData.issueDate || new Date().toISOString().split("T")[0];
  const dueDate = invoiceData.dueDate || "Upon Receipt";
  const terms = invoiceData.terms || "Due on receipt";

  // Top header bar (Blue brand accent)
  doc.setFillColor(15, 119, 255);
  doc.rect(0, 0, 210, 6, "F");

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(9, 17, 53);
  doc.text(business, 20, 25);

  if (invoiceData.businessEmail) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(invoiceData.businessEmail, 20, 31);
  }
  if (invoiceData.businessAddress) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const addrLines = doc.splitTextToSize(invoiceData.businessAddress, 80);
    doc.text(addrLines, 20, 36);
  }

  // Invoice # and meta on the right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 119, 255);
  doc.text(`INVOICE #${num}`, 190, 25, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Date: ${issueDate}`, 190, 32, { align: "right" });
  doc.text(`Due: ${dueDate}`, 190, 37, { align: "right" });
  doc.text(`Terms: ${terms}`, 190, 42, { align: "right" });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 52, 190, 52);

  // Billed To
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("BILLED TO", 20, 60);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(client, 20, 66);

  if (invoiceData.clientEmail) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(15, 119, 255);
    doc.text(invoiceData.clientEmail, 20, 71);
  }
  if (invoiceData.clientAddress) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const cAddr = doc.splitTextToSize(invoiceData.clientAddress, 80);
    doc.text(cAddr, 20, 76);
  }

  // Line items table header
  let y = 92;
  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 8, "F");
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y + 8, 190, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("DESCRIPTION", 24, y + 5.5);
  doc.text("QTY", 125, y + 5.5, { align: "center" });
  doc.text("RATE", 155, y + 5.5, { align: "right" });
  doc.text("AMOUNT", 186, y + 5.5, { align: "right" });

  y += 10;
  const lineItems = Array.isArray(invoiceData.lineItems) ? invoiceData.lineItems : [];
  let subtotal = 0;

  for (const item of lineItems) {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.unitPrice) || 0;
    const amount = qty * price;
    subtotal += amount;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(item.description || "Service Item", 24, y + 4);
    doc.text(qty.toString(), 125, y + 4, { align: "center" });
    doc.text(`${symbol}${price.toFixed(2)}`, 155, y + 4, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(`${symbol}${amount.toFixed(2)}`, 186, y + 4, { align: "right" });

    y += 7;
    doc.setDrawColor(241, 245, 249);
    doc.line(20, y, 190, y);
    y += 2;
  }

  // Financial totals
  y = Math.max(y + 6, 150);
  const taxRate = Number(invoiceData.taxRate) || 0;
  const discountRate = Number(invoiceData.discount) || 0;
  const shipping = Number(invoiceData.shipping) || 0;
  const tax = subtotal * (taxRate / 100);
  const discount = subtotal * (discountRate / 100);
  const total = subtotal + tax - discount + shipping;
  const paid = Number(invoiceData.amountPaid) || 0;
  const balance = Math.max(0, total - paid);

  // Notes on left
  if (invoiceData.notes) {
    doc.setFillColor(250, 250, 249);
    doc.roundedRect(20, y, 80, 30, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 113, 108);
    doc.text("NOTES & TERMS", 24, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(68, 64, 60);
    const noteLines = doc.splitTextToSize(invoiceData.notes, 72);
    doc.text(noteLines, 24, y + 12);
  }

  // Totals box on right
  const rightX = 186;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", 140, y + 5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${symbol}${subtotal.toFixed(2)}`, rightX, y + 5, { align: "right" });

  let curY = y + 10;
  if (tax > 0) {
    doc.setTextColor(100, 116, 139);
    doc.text(`Tax (${taxRate}%):`, 140, curY);
    doc.setTextColor(15, 23, 42);
    doc.text(`+${symbol}${tax.toFixed(2)}`, rightX, curY, { align: "right" });
    curY += 5;
  }
  if (discount > 0) {
    doc.setTextColor(100, 116, 139);
    doc.text(`Discount (${discountRate}%):`, 140, curY);
    doc.setTextColor(16, 185, 129);
    doc.text(`-${symbol}${discount.toFixed(2)}`, rightX, curY, { align: "right" });
    curY += 5;
  }
  if (shipping > 0) {
    doc.setTextColor(100, 116, 139);
    doc.text("Shipping:", 140, curY);
    doc.setTextColor(15, 23, 42);
    doc.text(`+${symbol}${shipping.toFixed(2)}`, rightX, curY, { align: "right" });
    curY += 5;
  }

  // Total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Total:", 140, curY);
  doc.text(`${symbol}${total.toFixed(2)}`, rightX, curY, { align: "right" });
  curY += 5;

  if (paid > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Amount Paid:", 140, curY);
    doc.text(`-${symbol}${paid.toFixed(2)}`, rightX, curY, { align: "right" });
    curY += 6;
  }

  // Balance Due (Bold brand color)
  doc.setDrawColor(15, 119, 255);
  doc.setLineWidth(1);
  doc.line(135, curY, 190, curY);
  curY += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 119, 255);
  doc.text("Balance Due:", 140, curY);
  doc.text(`${symbol}${balance.toFixed(2)}`, rightX, curY, { align: "right" });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Invoice-Sync • Professional Invoicing", 105, 285, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new Response("Missing invoice token", { status: 400 });
    }

    const publicInvoice = await db.collection("public_invoices").findOne({ shareToken: token });

    if (!publicInvoice) {
      return new Response("Invoice not found or link expired", { status: 404 });
    }

    const invoiceNum = publicInvoice.invoiceData?.invoiceNumber || "0001";
    const filename = `Invoice-${invoiceNum}.pdf`;

    // 1. If high-res pre-rendered PDF base64 is available, return it directly
    if (publicInvoice.pdfBase64) {
      const pdfBuffer = Buffer.from(publicInvoice.pdfBase64, "base64");
      return new Response(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": pdfBuffer.length.toString(),
          "Cache-Control": "public, max-age=86400, immutable",
        },
      });
    }

    // 2. Always generate real PDF on-the-fly and return binary stream — never redirect to a webpage!
    const generatedBuffer = generateServerPdf(publicInvoice.invoiceData || {});
    return new Response(new Uint8Array(generatedBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": generatedBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    console.error("Download invoice error:", error);
    return new Response("Failed to generate invoice PDF", { status: 500 });
  }
}
