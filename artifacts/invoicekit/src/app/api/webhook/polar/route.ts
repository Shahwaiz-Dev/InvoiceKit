import { Webhooks } from "@polar-sh/nextjs";
import { db, ObjectId } from "@workspace/db";
import { getPlanFromProductId } from "@/lib/plans";
import { safeObjectId } from "@/lib/server-utils";
import { handleApiError, badRequestResponse } from "@/lib/api-errors";
import { NextResponse } from "next/server";

const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error("[POLAR WEBHOOK] Missing POLAR_WEBHOOK_SECRET environment variable");
    return NextResponse.json({ error: "Webhook configuration error" }, { status: 500 });
  }

  try {
    const handler = Webhooks({
      webhookSecret,
      onPayload: async (payload) => {
        const type = payload.type;
        console.log("[POLAR WEBHOOK] Received event type:", type);
        
        if (type === "subscription.created") {
          const subscription = payload.data;
          const userId = subscription.metadata?.userId || subscription.customFieldData?.userId;
          const polarCustomerId = subscription.customerId;
          const subscriptionId = subscription.id;
          const productId = subscription.productId;
          const plan = getPlanFromProductId(productId);
          
          const userObjectId = safeObjectId(userId as string);
          if (userObjectId) {
            await db.collection("user").updateOne(
              { _id: userObjectId },
              {
                $set: {
                  polarCustomerId,
                  subscriptionId,
                  subscriptionStatus: subscription.status,
                  subscriptionPlan: plan,
                  subscriptionCurrentPeriodStart: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).toISOString() : undefined,
                  subscriptionCurrentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toISOString() : undefined,
                  subscriptionStartedAt: subscription.startedAt ? new Date(subscription.startedAt).toISOString() : undefined,
                }
              }
            );
          }
        }

        if (type === "order.created" || type === "order.updated") {
          const order = payload.data;
          const userId = order.metadata?.userId || order.customFieldData?.userId;
          const polarCustomerId = order.customerId;
          
          const userObjectId = safeObjectId(userId as string);
          if (userObjectId) {
            await db.collection("user").updateOne(
              { _id: userObjectId },
              {
                $set: {
                  polarCustomerId,
                }
              }
            );
          }
        }

        if (type === "subscription.updated") {
          const subscription = payload.data;
          const plan = getPlanFromProductId(subscription.productId);
          await db.collection("user").updateOne(
            { subscriptionId: subscription.id },
            {
              $set: {
                subscriptionStatus: subscription.status,
                subscriptionPlan: plan,
                subscriptionCurrentPeriodStart: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).toISOString() : undefined,
                subscriptionCurrentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toISOString() : undefined,
              }
            }
          );
        }

        if (type === "subscription.revoked" || type === "subscription.canceled") {
          const subscription = payload.data;
          await db.collection("user").updateOne(
            { subscriptionId: subscription.id },
            {
              $set: {
                subscriptionStatus: "canceled",
              }
            }
          );
        }
      },
    });

    return await handler(req);
  } catch (error) {
    return handleApiError(error);
  }
}
