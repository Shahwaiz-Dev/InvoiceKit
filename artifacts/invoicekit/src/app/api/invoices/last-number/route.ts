import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lastInvoice = await db
      .collection("invoices")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .project({ invoiceNumber: 1 })
      .limit(1)
      .next();

    return NextResponse.json({ 
      lastNumber: lastInvoice?.invoiceNumber || null 
    });
  } catch (error) {
    console.error("Failed to fetch last invoice number:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
