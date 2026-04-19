import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { getLimitForPlan } from "@/lib/plans";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Parallel data fetching on the server
  const [invoices, usageData] = await Promise.all([
    db.collection("invoices")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray(),
    getUsage(session)
  ]);

  // Serialize MongoDB objects (ObjectId, Dates)
  const serializedInvoices = JSON.parse(JSON.stringify(invoices));

  return (
    <DashboardView 
      initialInvoices={serializedInvoices} 
      initialUsage={usageData}
      userName={session.user.name || "User"} 
    />
  );
}

async function getUsage(session: any) {
  const isPro = session.user.subscriptionStatus === "active";
  const currentPeriodStart = session.user.subscriptionCurrentPeriodStart
    ? new Date(session.user.subscriptionCurrentPeriodStart)
    : null;
  const startedAt = session.user.subscriptionStartedAt
    ? new Date(session.user.subscriptionStartedAt)
    : null;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usagePeriodStart =
    isPro && currentPeriodStart && !Number.isNaN(currentPeriodStart.getTime())
      ? currentPeriodStart
      : isPro && startedAt && !Number.isNaN(startedAt.getTime())
        ? startedAt
        : startOfMonth;

  const usage = await db.collection("invoices").countDocuments({
    userId: session.user.id,
    createdAt: { $gte: usagePeriodStart },
  });

  const plan = session.user.subscriptionPlan;
  const limit = getLimitForPlan(plan);
  const usageWindowLabel = isPro ? "billing period" : "month";

  return {
    usage,
    limit,
    isPro,
    plan,
    usageWindowLabel,
  };
}
