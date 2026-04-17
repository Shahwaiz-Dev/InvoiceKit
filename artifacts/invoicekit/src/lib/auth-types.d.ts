import { User as BetterAuthUser } from "better-auth";

declare module "better-auth" {
    interface User {
        polarCustomerId?: string;
        subscriptionId?: string;
        subscriptionStatus?: string;
        subscriptionCurrentPeriodEnd?: string;
        subscriptionStartedAt?: string;
    }
}
