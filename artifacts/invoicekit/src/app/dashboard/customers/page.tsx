import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { getUserUsage } from "@/lib/usage";
import { redirect } from "next/navigation";
import { CustomersView } from "@/components/dashboard/CustomersView";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [customers, usageData] = await Promise.all([
    db.collection("customers")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray(),
    getUserUsage(session)
  ]);

  // Serialize MongoDB objects
  const serializedCustomers = JSON.parse(JSON.stringify(customers));

  return (
    <CustomersView 
      initialCustomers={serializedCustomers} 
      initialUsage={usageData} 
    />
  );
}
