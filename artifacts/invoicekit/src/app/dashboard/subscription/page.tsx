import { getSession } from "@/lib/auth-session";
import { getUserUsage } from "@/lib/usage";
import { redirect } from "next/navigation";
import { SubscriptionView } from "@/components/dashboard/SubscriptionView";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const usageData = await getUserUsage(session);

  return <SubscriptionView initialUsage={usageData} />;
}
