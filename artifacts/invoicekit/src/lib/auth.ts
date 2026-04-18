import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { multiSession } from "better-auth/plugins/multi-session";
import { db } from "@workspace/db";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing Google OAuth environment variables");
  }
}

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
        await db.collection("invoices").deleteMany({ userId: user.id });
        await db.collection("userSettings").deleteOne({ userId: user.id });
      },
    },
    additionalFields: {
      polarCustomerId: { type: "string", required: false },
      subscriptionId: { type: "string", required: false },
      subscriptionStatus: { type: "string", required: false },
      subscriptionPlan: { type: "string", required: false },
      subscriptionCurrentPeriodEnd: { type: "string", required: false },
      subscriptionStartedAt: { type: "string", required: false },
    },
  },
  plugins: [multiSession()],
});

export type Session = typeof auth.$Infer.Session;
