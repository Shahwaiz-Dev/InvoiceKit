import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { redirect } from "next/navigation";
import { InvoicesView } from "@/components/dashboard/InvoicesView";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch invoices on the server
  const invoices = await db.collection("invoices")
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  // Serialize MongoDB objects (ObjectId, Dates)
  const serializedInvoices = JSON.parse(JSON.stringify(invoices));

  return <InvoicesView initialInvoices={serializedInvoices} />;
}
