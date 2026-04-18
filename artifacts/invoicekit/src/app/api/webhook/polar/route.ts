import { Webhooks } from "@polar-sh/nextjs";
import { db, ObjectId } from "@workspace/db";
import { getPlanFromProductId } from "@/lib/plans";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    try {
      const type = payload.type;
      console.log("[POLAR WEBHOOK] Received event type:", type);
      console.log("[POLAR WEBHOOK] Payload data:", JSON.stringify(payload.data, null, 2));
      
      if (type === "subscription.created") {
        const subscription = payload.data;
        const userId = subscription.metadata?.userId || subscription.customFieldData?.userId;
        const polarCustomerId = subscription.customerId;
        const subscriptionId = subscription.id;
        const productId = subscription.productId;
        const plan = getPlanFromProductId(productId);
        
        console.log(`[POLAR WEBHOOK] Extracted userId: ${userId}, customerId: ${polarCustomerId}, subStatus: ${subscription.status}`);
        if (userId) {
          await db.collection("user").updateOne(
            { _id: new ObjectId(userId as string) },
            {
              $set: {
                polarCustomerId: polarCustomerId,
                subscriptionId: subscriptionId,
                subscriptionStatus: subscription.status,
                subscriptionPlan: plan,
                subscriptionCurrentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toISOString() : undefined,
                subscriptionStartedAt: subscription.startedAt ? new Date(subscription.startedAt).toISOString() : undefined,
              }
            }
          );
          console.log(`[POLAR WEBHOOK] Successfully updated user ${userId} in MongoDB`);
        }
      }

      if (type === "order.created" || type === "order.updated") {
        const order = payload.data;
        const userId = order.metadata?.userId || order.customFieldData?.userId;
        const polarCustomerId = order.customerId;
        
        console.log(`[POLAR WEBHOOK] Order extracted. userId: ${userId}, customerId: ${polarCustomerId}`);
        if (userId) {
          await db.collection("user").updateOne(
            { _id: new ObjectId(userId as string) },
            {
              $set: {
                polarCustomerId: polarCustomerId,
              }
            }
          );
          console.log(`[POLAR WEBHOOK] Recorded customer mapping for user ${userId} via Order`);
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
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  },
});
