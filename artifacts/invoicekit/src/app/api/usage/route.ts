import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { getLimitForPlan } from "@/lib/plans";
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
  const plan = session.user.subscriptionPlan;
  
  const limit = getLimitForPlan(plan);
  const canManageCustomers = plan === "authority";

  return NextResponse.json({ usage, limit, isPro, plan, canManageCustomers });
}
