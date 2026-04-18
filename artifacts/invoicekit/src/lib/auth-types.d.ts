import { User as BetterAuthUser } from "better-auth";

declare module "better-auth" {
    interface User {
        polarCustomerId?: string;
        subscriptionId?: string;
        subscriptionStatus?: string;
        subscriptionPlan?: string;
        subscriptionCurrentPeriodStart?: string;
        subscriptionCurrentPeriodEnd?: string;
        subscriptionStartedAt?: string;
    }

    interface Session {
        user: User;
    }
}
