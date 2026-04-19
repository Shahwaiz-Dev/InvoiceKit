import { getSession } from "@/lib/auth-session";
import { getUserUsage } from "@/lib/usage";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  const usageData = await getUserUsage(session);
  return NextResponse.json(usageData);
}
