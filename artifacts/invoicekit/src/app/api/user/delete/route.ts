import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // 1. Delete all invoices
    await db.collection("invoices").deleteMany({ userId });

    // 2. Delete user settings
    await db.collection("userSettings").deleteOne({ userId });

  // 3. Delete user from Better Auth (this handles sessions/accounts automatically)
  // We pass headers so Better Auth can verify the session of the requester
  await (auth.api as any).deleteUser({
      headers: req.headers,
      body: {
          userId: userId
      }
  });

    console.log(`[DELETE ACCOUNT] Successfully wiped data for user: ${userId}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE ACCOUNT] Error during account deletion:", error);
    return NextResponse.json(
        { error: "Failed to delete account. Please try again or contact support." },
        { status: 500 }
    );
  }
}
