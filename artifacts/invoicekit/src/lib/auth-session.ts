import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Per-request memoized session getter.
 * React.cache() deduplicates repeated calls within the same request cycle,
 * so every API route calling getSession() only hits the DB once.
 * Rule: server-cache-react
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
