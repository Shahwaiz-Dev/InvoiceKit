import { getSession } from "@/lib/auth-session";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;
    if (!polarAccessToken) {
      return NextResponse.json({ error: "Missing POLAR_ACCESS_TOKEN in environment" }, { status: 500 });
    }

    // Use the SDK directly to get the customer portal using the mapped polarCustomerId
    const polarCustomerId = (session.user as any).polarCustomerId;
    
    if (!polarCustomerId) {
      return NextResponse.json({ 
        error: "No billing profile found for this user",
        message: "You must have an active or past subscription to access the billing portal."
      }, { status: 400 });
    }

    const { Polar } = await import("@polar-sh/sdk");
    
    // Improved Environment Detection: 
    // Defaults to sandbox in development unless a production server is specified.
    // Sandbox tokens (polar_s_) always use the sandbox server.
    const isSandboxToken = polarAccessToken.startsWith("polar_s_");
    const isDev = process.env.NODE_ENV !== "production";
    const server = (process.env.POLAR_SERVER as "sandbox" | "production") || (isSandboxToken || isDev ? "sandbox" : "production");

    console.log(`[POLAR PORTAL] Using server: ${server} (isDev: ${isDev}, isSandboxToken: ${isSandboxToken})`);

    const polar = new Polar({
      accessToken: polarAccessToken,
      server,
    });

    try {
      const portalSession = await polar.customerSessions.create({
        customerId: polarCustomerId as string,
      });

      if (!portalSession.customerPortalUrl) {
        throw new Error("Polar API did not return a customer portal URL");
      }

      return NextResponse.redirect(portalSession.customerPortalUrl);
    } catch (error: any) {
      console.error("Error creating portal session:", error);
      return NextResponse.json({ 
        error: "Failed to create portal session",
        details: error?.message || error?.details || String(error),
        debug_info: {
          hasCustomerId: !!polarCustomerId,
          nodeEnv: process.env.NODE_ENV,
          polarServer: server,
          hasToken: !!polarAccessToken
        }
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Critical error in customer-portal handler:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error?.message || String(error) 
    }, { status: 500 });
  }
};
