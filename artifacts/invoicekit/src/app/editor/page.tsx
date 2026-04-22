"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useRef, useState, Suspense, useDeferredValue, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceData, TemplateType } from "@/lib/schema";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Preview } from "@/components/home/Preview";
import { useSession } from "@/lib/auth-client";

import { StandaloneEditor } from "@/features/editor/components/StandaloneEditor";
import { isTemplateType } from "@/lib/config";
import { DEFAULT_TEMPLATE } from "@/lib/config";

function EditorContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id");
  const requestedTemplate = searchParams.get("template");

  const template = isTemplateType(requestedTemplate) ? requestedTemplate : DEFAULT_TEMPLATE;

  return (
    <StandaloneEditor 
      initialTemplate={template} 
      invoiceId={invoiceId} 
      mode="full" 
    />
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Loading Editor...</p>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}

