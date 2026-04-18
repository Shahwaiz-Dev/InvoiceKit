import { getSession } from "@/lib/auth-session";
import { db, ObjectId } from "@workspace/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const result = await db.collection("customers").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Customer deleted" });
}
