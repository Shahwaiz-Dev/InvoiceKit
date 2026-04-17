"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, Suspense, useDeferredValue, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceData, TemplateType } from "@/lib/schema";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Preview } from "@/components/home/Preview";

// Refactored Components & Hooks
import { EditorSidebar } from "@/features/editor/components/EditorSidebar";
import { EditorHeader } from "@/features/editor/components/EditorHeader";
import { DraftBanner } from "@/features/editor/components/DraftBanner";
import { UpsellDialog } from "@/features/editor/components/UpsellDialog";
import { useInvoiceActions } from "@/features/editor/hooks/use-invoice-actions";
import { useEditorSync } from "@/features/editor/hooks/use-editor-sync";
import { getLabels, getDefaultInvoiceData } from "@/features/editor/lib/editor-utils";
import { INVOICE_TEMPLATES, GUEST_TEMPLATES } from "@/lib/config";

function EditorContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id");

  // Basic States
  const [template, setTemplate] = useState<TemplateType>(
    (searchParams.get("template") as TemplateType) ?? "clean"
  );
  const [data, setData] = useState<InvoiceData>(() => getDefaultInvoiceData());
  const deferredData = useDeferredValue(data);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const labels = useMemo(() => getLabels(template), [template]);
  const { handleDownload, handleSendEmail, isSending } = useInvoiceActions();

  const form = useForm<InvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: data,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Editor Sync logic extracted to hook
  const { isSavingToDb, saveInvoiceToDB, handleRestoreDraft, hasDraft, session } = useEditorSync({
    form,
    template,
    invoiceId,
    setData,
    setTemplate,
  });

  // Load existing invoice if ID is provided
  const { data: existingInvoice, isLoading: loadingExisting } = useQuery<any>({
    queryKey: ["invoice", invoiceId],
    queryFn: () =>
      fetch(`/api/invoices/${invoiceId}`).then((r) => {
        if (!r.ok) throw new Error("Failed to load invoice");
        return r.json();
      }),
    enabled: !!invoiceId && !!session,
  });

  // Sync form with existing invoice
  useEffect(() => {
    if (existingInvoice) {
      const { _id, userId, createdAt, updatedAt, ...cleanData } = existingInvoice;
      form.reset(cleanData);
      setData(cleanData);
      if (existingInvoice.template) {
        setTemplate(existingInvoice.template as TemplateType);
      }
    }
  }, [existingInvoice, form]);

  // Check for draft on mount (only for guests)
  useEffect(() => {
    if (!session && hasDraft) {
      setShowDraftBanner(true);
    }
  }, [session, hasDraft]);

  // Pre-fill business profile
  const { data: settingsData } = useQuery<{
    businessName?: string;
    businessEmail?: string;
    businessAddress?: string;
    logoUrl?: string;
  } | null>({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then((r) => (r.ok ? r.json() : null)),
    enabled: !!session && !invoiceId,
    staleTime: 5 * 60_000,
  });

  const { data: usageData } = useQuery<{ usage: number, limit: number, isPro: boolean }>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    enabled: !!session,
  });

  useEffect(() => {
    if (settingsData && !profileLoaded) {
      setProfileLoaded(true);
      const current = form.getValues();
      form.reset({
        ...current,
        businessName: settingsData.businessName || current.businessName,
        businessEmail: settingsData.businessEmail || current.businessEmail,
        businessAddress: settingsData.businessAddress || current.businessAddress,
        logoUrl: settingsData.logoUrl || current.logoUrl,
      });
      setData(form.getValues());
    }
  }, [settingsData, profileLoaded, form]);

  const onDownloadHandler = form.handleSubmit(async (v) => {
    const success = await handleDownload(v, setData, session, usageData ?? null, invoiceId, saveInvoiceToDB);
    if (success) {
      if (!session) setShowUpsell(true);
    }
  });

  const onSendEmailHandler = form.handleSubmit(async (v) => {
    await handleSendEmail(v, session);
    if (session) await saveInvoiceToDB(v, "sent");
  });

  const filteredTemplates = useMemo(() => 
    session 
      ? INVOICE_TEMPLATES 
      : INVOICE_TEMPLATES.filter(t => GUEST_TEMPLATES.includes(t.value)),
    [session]
  );

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      <AnimatePresence>
        {showDraftBanner && (
          <DraftBanner 
            onRestore={() => { handleRestoreDraft(); setShowDraftBanner(false); }} 
            onDiscard={() => setShowDraftBanner(false)} 
          />
        )}
      </AnimatePresence>

      {showUpsell && <UpsellDialog onClose={() => setShowUpsell(false)} />}

      <EditorHeader
        template={template}
        setTemplate={setTemplate}
        session={session}
        isSavingToDb={isSavingToDb}
        onSave={form.handleSubmit((v) => saveInvoiceToDB(v, "draft"))}
        templates={filteredTemplates}
      />

      {loadingExisting && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Loading draft...</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex flex-1 bg-muted/30 overflow-auto p-10 justify-center items-start">
          <div className="relative">
            <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-white border border-border rounded-full shadow-sm text-xs font-medium text-muted-foreground print:hidden">
              A4 · Portrait
            </div>
            <div className="w-[700px] aspect-[1/1.414] bg-white shadow-2xl">
              <div id="print-area" className="w-full h-full">
                <Preview template={template} data={deferredData} />
              </div>
            </div>
          </div>
        </div>

        <EditorSidebar
          form={form}
          template={template}
          labels={labels}
          onClose={() => setTemplate("clean")}
          onDownload={onDownloadHandler}
          onSendEmail={onSendEmailHandler}
          isSending={isSending}
          session={session}
        />
      </div>
    </div>
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
