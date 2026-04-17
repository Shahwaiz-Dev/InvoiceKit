import { createAuthClient } from "better-auth/react";
import { multiSession } from "better-auth/plugins/multi-session";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    plugins: [
        multiSession()
    ]
});

export const { useSession, signIn, signUp, signOut } = authClient;
