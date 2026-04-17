import { getSession } from "@/lib/auth-session";
import { db, ObjectId } from "@workspace/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const invoice = await db.collection("invoices").findOne({
    _id: objectId,
    userId: session.user.id,
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(invoice);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const result = await db.collection("invoices").findOneAndUpdate(
    { _id: objectId, userId: session.user.id },
    { $set: { ...body, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!result) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const result = await db
    .collection("invoices")
    .deleteOne({ _id: objectId, userId: session.user.id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
