import { db } from "@workspace/db";
import { getLimitForPlan } from "@/lib/plans";

export async function getUserUsage(session: any) {
  if (!session) return { usage: 0, limit: 0, isPro: false, canManageCustomers: false };

  const isPro = session.user.subscriptionStatus === "active";
  const currentPeriodStart = session.user.subscriptionCurrentPeriodStart
    ? new Date(session.user.subscriptionCurrentPeriodStart)
    : null;
  const currentPeriodEnd = session.user.subscriptionCurrentPeriodEnd
    ? new Date(session.user.subscriptionCurrentPeriodEnd)
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
  const canManageCustomers = plan === "authority";

  const nextMonth = new Date(startOfMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const resetAt =
    isPro && currentPeriodEnd && !Number.isNaN(currentPeriodEnd.getTime())
      ? currentPeriodEnd.toISOString()
      : nextMonth.toISOString();
  const usageWindowLabel = isPro ? "billing period" : "month";

  return {
    usage,
    limit,
    isPro,
    plan,
    canManageCustomers,
    resetAt,
    usageWindowLabel,
  };
}
