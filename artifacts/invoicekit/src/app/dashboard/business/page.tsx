import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { redirect } from "next/navigation";
import { BusinessView } from "@/components/dashboard/BusinessView";

export const dynamic = "force-dynamic";

export default async function BusinessProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const settings = await db.collection("settings").findOne({ userId: session.user.id });

  // Serialize MongoDB object
  const serializedSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return <BusinessView initialSettings={serializedSettings} />;
}
