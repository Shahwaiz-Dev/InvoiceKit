import { Loader2 } from "lucide-react";

/**
 * Next.js App Router streaming loading state for /dashboard.
 * Shown immediately while the dashboard page chunk loads,
 * eliminating the blank-screen flash before the client hydrates.
 * Rule: async-suspense-boundaries
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
