import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { invoiceSchema, baseInvoiceSchema } from "@/lib/schema";

/** Extended schema for POST — adds status + template on top of InvoiceData */
const postInvoiceSchema = baseInvoiceSchema.extend({
  status: z.enum(["draft", "sent", "paid"]).optional().default("draft"),
  template: z.string().trim().optional().default("clean"),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await db
    .collection("invoices")
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate & sanitize — prevents arbitrary field injection into MongoDB
  const parsed = postInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Monthly Limit Check
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const invoiceCount = await db.collection("invoices").countDocuments({
    userId: session.user.id,
    createdAt: { $gte: startOfMonth },
  });

  const isPro = session.user.subscriptionStatus === "active";
  const limit = isPro ? 20 : 1;

  if (invoiceCount >= limit) {
    return NextResponse.json(
        { error: "Monthly invoice limit reached. Please upgrade to Pro." },
        { status: 403 }
    );
  }

  const doc = {
    ...parsed.data,
    userId: session.user.id, // always overwrite userId from session — never trust client
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("invoices").insertOne(doc);
  return NextResponse.json(
    { id: result.insertedId.toString(), ...doc },
    { status: 201 },
  );
}
