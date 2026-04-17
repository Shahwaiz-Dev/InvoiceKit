"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Templates } from "@/components/home/Templates";
import type { TemplateType } from "@/lib/schema";
import { isGuestTemplate } from "@/lib/config";

/**
 * Thin client wrapper around the Templates section.
 * Only this component needs to be a Client Component — the rest of
 * HomePage (Header, Hero, HowItWorks, FAQ) can be Server Components.
 * Rule: bundle-dynamic-imports / bundle-barrel-imports
 */
export function TemplateSection() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const getCallbackUrl = (template: TemplateType) =>
    `/editor?template=${encodeURIComponent(template)}`;

  const handleTemplateSelect = (template: TemplateType) => {
    if (!session && !isGuestTemplate(template)) {
      router.push(`/register?callbackUrl=${encodeURIComponent(getCallbackUrl(template))}` as any);
      return;
    }

    router.push(getCallbackUrl(template) as any);
  };

  const handleAuthCta = (template: TemplateType, mode: "login" | "register") => {
    router.push(`/${mode}?callbackUrl=${encodeURIComponent(getCallbackUrl(template))}` as any);
  };

  return (
    <Templates
      isAuthenticated={Boolean(session)}
      isSessionPending={isPending}
      onRequireAccount={handleAuthCta}
      onSelect={handleTemplateSelect}
    />
  );
}
