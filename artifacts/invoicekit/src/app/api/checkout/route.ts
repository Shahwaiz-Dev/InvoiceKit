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

  const { Polar } = await import("@polar-sh/sdk");

  const polar = new Polar({
    accessToken: polarAccessToken,
    server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
  });

  const productId = process.env.POLAR_PRODUCT_ID;
  if (!productId) {
    return NextResponse.json({ error: "Missing POLAR_PRODUCT_ID in environment" }, { status: 500 });
  }

  // Use the public URL (ngrok/production) — url.origin resolves to the internal server address (0.0.0.0)
  const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || `http://localhost:3000`;
  const successUrl = `${baseUrl}/dashboard/settings?checkout=success`;
  try {
    let finalUserId = "";
    if (typeof session.user.id === "string") {
      finalUserId = session.user.id;
    } else if (session.user.id && typeof session.user.id === "object") {
      // It's a stripped ObjectId holding a buffer
      const anyId = session.user.id as any;
      if (anyId.buffer) {
        finalUserId = Buffer.from(Object.values(anyId.buffer) as number[]).toString("hex");
      } else if (typeof anyId.toString === "function" && anyId.toString() !== "[object Object]") {
        finalUserId = anyId.toString();
      } else {
        finalUserId = String(session.user.id);
      }
    }

    // Polar SDK: `products` is an array of product ID strings
    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl,
      metadata: {
        userId: finalUserId,
      },
    });

    return NextResponse.redirect(checkout.url);
  } catch (error: any) {
    console.error("Error creating checkout:", error);
    return NextResponse.json({ 
      error: "Failed to create checkout session", 
      details: error?.message || error?.details || String(error),
      debug_info: {
        productId: process.env.POLAR_PRODUCT_ID ? "Set (ends in " + process.env.POLAR_PRODUCT_ID.slice(-4) + ")" : "Missing",
        nodeEnv: process.env.NODE_ENV,
        hasToken: !!process.env.POLAR_ACCESS_TOKEN
      }
    }, { status: 500 });
  }
};

