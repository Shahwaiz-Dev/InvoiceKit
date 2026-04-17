import { Loader2 } from "lucide-react";

/**
 * Next.js App Router streaming loading state for /settings.
 * Shown immediately while the settings page chunk loads.
 * Rule: async-suspense-boundaries
 */
export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
