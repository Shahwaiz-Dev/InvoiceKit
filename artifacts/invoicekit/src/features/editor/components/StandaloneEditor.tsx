"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { invoiceSchema, InvoiceData, TemplateType } from "@/lib/schema";
import { Preview } from "@/components/home/Preview";
import { useSession } from "@/lib/auth-client";
import { EditorSidebar } from "./EditorSidebar";
import { EditorHeader } from "./EditorHeader";
import { DraftBanner } from "./DraftBanner";
import { UpsellDialog } from "./UpsellDialog";
import { useInvoiceActions } from "../hooks/use-invoice-actions";
import { useEditorSync } from "../hooks/use-editor-sync";
import { getLabels, getDefaultInvoiceData, getNextInvoiceNumber } from "../lib/editor-utils";
import {
  DEFAULT_TEMPLATE,
  INVOICE_TEMPLATES,
  getAvailableTemplates,
} from "@/lib/config";

interface StandaloneEditorProps {
  initialTemplate?: TemplateType;
  invoiceId?: string | null;
  mode?: "full" | "embedded";
}

export function StandaloneEditor({
  initialTemplate = DEFAULT_TEMPLATE,
  invoiceId = null,
  mode = "full",
}: StandaloneEditorProps) {
  const { data: authSession, isPending: isSessionPending } = useSession();
  
  // Basic States
  const [template, setTemplate] = useState<TemplateType>(initialTemplate);
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

  // Editor Sync logic
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

  // Check for draft on mount
  useEffect(() => {
    if (hasDraft && !invoiceId) {
      setShowDraftBanner(true);
    }
  }, [hasDraft, invoiceId]);

  // Pre-fill business profile
  const { data: settingsData } = useQuery<{
    businessName?: string;
    businessEmail?: string;
    businessAddress?: string;
    logoUrl?: string;
    taxId?: string;
    website?: string;
    phone?: string;
  } | null>({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then((r) => (r.ok ? r.json() : null)),
    enabled: !!session && !invoiceId,
    staleTime: 5 * 60_000,
  });

  const { data: usageData } = useQuery<{ usage: number, limit: number, isPro: boolean, canManageCustomers?: boolean }>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    enabled: !!session,
  });

  const { data: customers = [] } = useQuery<any[]>({
    queryKey: ["customers"],
    queryFn: () => fetch("/api/customers").then((r) => r.json()),
    enabled: !!session && (session.user as any).subscriptionPlan === "authority",
  });

  const { data: lastNumberData } = useQuery<{ lastNumber: string | null }>({
    queryKey: ["last-invoice-number"],
    queryFn: () => fetch("/api/invoices/last-number").then((r) => r.json()),
    enabled: !!session && !invoiceId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (lastNumberData && lastNumberData.lastNumber && !invoiceId) {
      const nextNumber = getNextInvoiceNumber(lastNumberData.lastNumber);
      const current = form.getValues("invoiceNumber");
      if (current === "INV-001") {
        form.setValue("invoiceNumber", nextNumber);
        setData((prev) => ({ ...prev, invoiceNumber: nextNumber }));
      }
    }
  }, [lastNumberData, invoiceId, form]);

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
        taxId: settingsData.taxId || current.taxId,
        website: settingsData.website || current.website,
        phone: settingsData.phone || current.phone,
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
    getAvailableTemplates(Boolean(session)),
    [session]
  );

  const containerClasses = mode === "full" 
    ? "fixed inset-0 bg-background flex flex-col overflow-hidden" 
    : "relative w-full bg-background flex flex-col overflow-hidden rounded-xl border border-border shadow-2xl h-[800px]";

  return (
    <div className={containerClasses}>
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
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Loading draft...</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex flex-1 bg-muted/30 overflow-auto p-4 md:p-10 justify-center items-start">
          <div className="relative">

            <div className="w-[600px] xl:w-[700px] aspect-[1/1.414] bg-white shadow-2xl">
              <div id="print-area" className="w-full h-full text-[12px]">
                <Preview template={template} data={deferredData} />
              </div>
            </div>
          </div>
        </div>

        <EditorSidebar
          form={form}
          template={template}
          labels={labels}
          onDownload={onDownloadHandler}
          onSendEmail={onSendEmailHandler}
          isSending={isSending}
          session={session}
          customers={customers}
          canManageCustomers={usageData?.canManageCustomers}
        />
      </div>
    </div>
  );
}
