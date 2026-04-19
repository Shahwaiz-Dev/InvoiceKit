import { getSession } from "@/lib/auth-session";
import { db, ObjectId } from "@workspace/db";
import { NextResponse } from "next/server";
import { safeObjectId } from "@/lib/server-utils";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await db.collection("customers").find({
    userId: session.user.id,
  }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Gate check: Only Authority plan can create customers
  const isAuthority = session.user.subscriptionPlan === "authority";
  if (!isAuthority) {
    return NextResponse.json({ error: "Customer Management is an Authority plan feature." }, { status: 403 });
  }

  const data = await req.json();
  const { name, email, address, phone, taxId, website, _id } = data;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
  }

  const customerData = {
    userId: session.user.id,
    name,
    email,
    address: address || "",
    phone: phone || "",
    taxId: taxId || "",
    website: website || "",
    updatedAt: new Date(),
  };

  if (_id) {
    const customerObjectId = safeObjectId(_id);
    if (!customerObjectId) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
    }
    await db.collection("customers").updateOne(
      { _id: customerObjectId, userId: session.user.id },
      { $set: customerData }
    );
    return NextResponse.json({ success: true, message: "Customer updated" });
  } else {
    const result = await db.collection("customers").insertOne({
      ...customerData,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true, customerId: result.insertedId });
  }
}
