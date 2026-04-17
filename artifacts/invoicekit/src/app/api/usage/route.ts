import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ usage: 0, limit: 0, isPro: false });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usage = await db.collection("invoices").countDocuments({
    userId: session.user.id,
    createdAt: { $gte: startOfMonth },
  });

  const isPro = session.user.subscriptionStatus === "active";
  const limit = isPro ? 20 : 1;

  return NextResponse.json({ usage, limit, isPro });
}
