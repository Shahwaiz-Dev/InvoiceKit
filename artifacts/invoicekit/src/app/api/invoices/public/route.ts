import { db } from "@workspace/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing invoice token" }, { status: 400 });
    }

    const publicInvoice = await db.collection("public_invoices").findOne({ shareToken: token });

    if (!publicInvoice) {
      return NextResponse.json({ error: "Invoice not found or expired" }, { status: 404 });
    }

    return NextResponse.json({
      invoiceData: publicInvoice.invoiceData,
      hasPdf: Boolean(publicInvoice.pdfBase64),
      createdAt: publicInvoice.createdAt,
    });
  } catch (error) {
    console.error("Public invoice fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}
