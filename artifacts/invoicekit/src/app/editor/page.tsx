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

// Refactored Components & Hooks
import { EditorSidebar } from "@/features/editor/components/EditorSidebar";
import { EditorHeader } from "@/features/editor/components/EditorHeader";
import { DraftBanner } from "@/features/editor/components/DraftBanner";
import { UpsellDialog } from "@/features/editor/components/UpsellDialog";
import { useInvoiceActions } from "@/features/editor/hooks/use-invoice-actions";
import { useEditorSync } from "@/features/editor/hooks/use-editor-sync";
import { getLabels, getDefaultInvoiceData } from "@/features/editor/lib/editor-utils";
import {
  DEFAULT_TEMPLATE,
  INVOICE_TEMPLATES,
  getAvailableTemplates,
  isGuestTemplate,
  isTemplateType,
} from "@/lib/config";

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: authSession, isPending: isSessionPending } = useSession();
  const invoiceId = searchParams.get("id");
  const requestedTemplate = searchParams.get("template");

  // Basic States
  const [template, setTemplate] = useState<TemplateType>(
    isTemplateType(requestedTemplate) ? requestedTemplate : DEFAULT_TEMPLATE
  );
  const [data, setData] = useState<InvoiceData>(() => getDefaultInvoiceData());
  const deferredData = useDeferredValue(data);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [blockedTemplateLabel, setBlockedTemplateLabel] = useState<string | null>(null);

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

  // Check for draft on mount
  useEffect(() => {
    if (hasDraft && !invoiceId) {
      setShowDraftBanner(true);
    }
  }, [hasDraft, invoiceId]);

  useEffect(() => {
    if (isSessionPending || authSession || !isTemplateType(requestedTemplate) || isGuestTemplate(requestedTemplate)) {
      return;
    }

    const requestedTemplateLabel =
      INVOICE_TEMPLATES.find((templateOption) => templateOption.value === requestedTemplate)?.label ??
      requestedTemplate;

    setBlockedTemplateLabel(requestedTemplateLabel);
    setTemplate(DEFAULT_TEMPLATE);

    const params = new URLSearchParams(searchParams.toString());
    params.set("template", DEFAULT_TEMPLATE);
    router.replace(`/editor?${params.toString()}`);
  }, [authSession, isSessionPending, requestedTemplate, router, searchParams]);

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
    enabled: !!session && usageData?.canManageCustomers,
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

  const authTargetTemplate =
    !session && isTemplateType(requestedTemplate) && !isGuestTemplate(requestedTemplate)
      ? requestedTemplate
      : template;
  const guestAuthHref = `/register?callbackUrl=${encodeURIComponent(`/editor?template=${authTargetTemplate}`)}`;
  const guestLoginHref = `/login?callbackUrl=${encodeURIComponent(`/editor?template=${authTargetTemplate}`)}`;

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

      {!isSessionPending && !session ? (
        <div className="border-b border-amber-200 bg-amber-50/80 px-4 py-3">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-amber-900 md:flex-row md:items-center md:justify-between">
            <p className="leading-6">
              {blockedTemplateLabel
                ? `${blockedTemplateLabel} is available for signed-in users only. You can keep working in Clean right now, or create an account to unlock the full template library.`
                : "Guests can use the Clean template for free. Create an account to unlock every other template, saved drafts, and email sending."}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={guestLoginHref as any}
                className="inline-flex h-10 items-center justify-center rounded-md border border-amber-300 bg-white px-4 text-sm font-medium text-amber-950 transition-colors hover:bg-amber-100"
              >
                Sign In
              </Link>
              <Link
                href={guestAuthHref as any}
                className="inline-flex h-10 items-center justify-center rounded-md bg-amber-500 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      ) : null}

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
          customers={customers}
          canManageCustomers={usageData?.canManageCustomers}
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
