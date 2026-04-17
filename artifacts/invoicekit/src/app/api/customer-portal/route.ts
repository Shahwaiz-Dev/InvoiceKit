import { getSession } from "@/lib/auth-session";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!polarAccessToken) {
    return NextResponse.json({ error: "Missing POLAR_ACCESS_TOKEN in environment" }, { status: 500 });
  }

  // Use the SDK directly to get the customer portal using the mapped polarCustomerId
  const polarCustomerId = session.user.polarCustomerId;
  
  if (!polarCustomerId) {
    return NextResponse.json({ error: "No billing profile found for this user" }, { status: 400 });
  }

  const { Polar } = await import("@polar-sh/sdk");
  
  const polar = new Polar({
    accessToken: polarAccessToken,
    server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
  });

  try {
    const portalSession = await polar.customerSessions.create({
      customerId: polarCustomerId as string,
    });

    return NextResponse.redirect(portalSession.customerPortalUrl);
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
};
