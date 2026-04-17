import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "@workspace/db";

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            polarCustomerId: { type: "string", required: false },
            subscriptionId: { type: "string", required: false },
            subscriptionStatus: { type: "string", required: false },
        }
    },
    advanced: {
        generateId: false
    }
});
