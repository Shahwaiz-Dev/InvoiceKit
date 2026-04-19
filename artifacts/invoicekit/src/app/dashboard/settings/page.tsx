import { getSession } from "@/lib/auth-session";
import { getUserUsage } from "@/lib/usage";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/dashboard/SettingsView";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const usageData = await getUserUsage(session);

  return <SettingsView initialUsage={usageData} />;
}
