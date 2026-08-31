import { createAuthClient } from "better-auth/react";
import { multiSession } from "better-auth/plugins/multi-session";

function cleanUrl(url?: string): string | undefined {
    if (!url) return undefined;
    const cleaned = url.trim().replace(/^["']|["']$/g, "").trim().replace(/\/+$/, "");
    try {
        new URL(cleaned);
        return cleaned;
    } catch {
        return undefined;
    }
}

const getBaseURL = () => {
    const envUrl = cleanUrl(process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL);
    if (envUrl) return envUrl;
    if (typeof window !== "undefined") return window.location.origin;
    return "https://www.invoice-sync.com";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [
        multiSession()
    ],
    inferAdditionalFields: true
});

export const { useSession, signIn, signUp, signOut } = authClient;
