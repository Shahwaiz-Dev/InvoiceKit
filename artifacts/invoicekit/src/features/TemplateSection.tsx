"use client";

import { useRouter } from "next/navigation";
import { Templates } from "@/components/home/Templates";
import type { TemplateType } from "@/lib/schema";

/**
 * Thin client wrapper around the Templates section.
 * Only this component needs to be a Client Component — the rest of
 * HomePage (Header, Hero, HowItWorks, FAQ) can be Server Components.
 * Rule: bundle-dynamic-imports / bundle-barrel-imports
 */
export function TemplateSection() {
  const router = useRouter();

  const handleTemplateSelect = (template: TemplateType) => {
    router.push(`/editor?template=${template}`);
  };

  return <Templates onSelect={handleTemplateSelect} />;
}
