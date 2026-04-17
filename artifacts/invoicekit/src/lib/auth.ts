import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "@workspace/db";

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    user: {
        additionalFields: {
            polarCustomerId: { type: "string", required: false },
            subscriptionId: { type: "string", required: false },
            subscriptionStatus: { type: "string", required: false },
        }
    },
});

export type Session = typeof auth.$Infer.Session;
