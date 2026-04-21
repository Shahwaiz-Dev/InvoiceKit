import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { multiSession } from "better-auth/plugins/multi-session";
import { db, ObjectId } from "@workspace/db";
import { normalizeAuthId } from "./server-utils";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        const normalizedId = normalizeAuthId(user.id);
        if (!normalizedId) return;

        const userObjectId = ObjectId.isValid(normalizedId)
          ? new ObjectId(normalizedId)
          : null;

        // Create variants to cover both string and ObjectId storage formats
        const userIdVariants: unknown[] = [normalizedId];
        if (userObjectId) userIdVariants.push(userObjectId);
        if (user.id && typeof user.id === "object") {
          userIdVariants.push(user.id);
        }

        // Wipe user-related data across collections using all possible ID variants
        await db.collection("invoices").deleteMany({
          userId: { $in: userIdVariants },
        });
        await db.collection("userSettings").deleteMany({
          userId: { $in: userIdVariants },
        });
        await db.collection("account").deleteMany({
          userId: { $in: userIdVariants },
        });
        await db.collection("session").deleteMany({
          userId: { $in: userIdVariants },
        });
      },
    },
    additionalFields: {
      polarCustomerId: { type: "string", required: false },
      subscriptionId: { type: "string", required: false },
      subscriptionStatus: { type: "string", required: false },
      subscriptionPlan: { type: "string", required: false },
      subscriptionCurrentPeriodStart: { type: "string", required: false },
      subscriptionCurrentPeriodEnd: { type: "string", required: false },
      subscriptionStartedAt: { type: "string", required: false },
    },
  },
  plugins: [multiSession()],
});

export type Session = typeof auth.$Infer.Session;
