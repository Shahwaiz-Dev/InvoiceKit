"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Loader2, Pencil, Eye, Download } from "lucide-react";

import { invoiceSchema, InvoiceData, TemplateType } from "@/lib/schema";
import { Preview } from "@/components/home/Preview";
import { cn } from "@/lib/utils";
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

  // Responsive mobile/desktop preview & scale states
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [scale, setScale] = useState(0.85);
  const [paperHeight, setPaperHeight] = useState(1046);
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      if (el.clientWidth === 0) return;
      const pad = el.clientWidth < 640 ? 24 : 48;
      const availW = el.clientWidth - pad;
      if (availW <= 0) return;
      const baseW = 740;
      const calculatedScale = Math.min(1.0, Math.max(0.35, availW / baseW));
      setScale(calculatedScale);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeTab]);

  useEffect(() => {
    const p = paperRef.current;
    if (!p) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === p) {
          setPaperHeight(Math.max(1046, p.scrollHeight || 1046));
        }
      }
    });
    ro.observe(p);
    return () => ro.disconnect();
  }, [deferredData]);

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
    ? "fixed inset-0 bg-white flex flex-col overflow-hidden" 
    : "relative w-full bg-white flex flex-col overflow-hidden h-[740px] sm:h-[800px] lg:h-[840px]";

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
        mode={mode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {loadingExisting && (
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#0f77ff]" />
            <p className="text-sm text-[#36394a] font-medium">Loading draft...</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Responsive Invoice Preview Pane */}
        <div
          ref={containerRef}
          className={cn(
            "bg-slate-50/80 overflow-y-auto overflow-x-hidden p-3 sm:p-6 flex-col items-center justify-start border-r border-slate-200/80",
            // Desktop: always visible side-by-side
            "lg:flex lg:flex-1 lg:static lg:opacity-100 lg:pointer-events-auto",
            // Mobile: full-width when preview active, or kept in DOM offscreen for seamless PDF downloads
            activeTab === "preview"
              ? "flex flex-1 w-full opacity-100 relative z-10"
              : "fixed -left-[9999px] -top-[9999px] w-[740px] opacity-0 pointer-events-none"
          )}
        >
          <div
            style={{
              width: `${Math.round(740 * scale)}px`,
              height: `${Math.round(paperHeight * scale)}px`,
            }}
            className="relative shrink-0 transition-transform duration-75 my-auto shadow-xl shadow-slate-900/5 rounded-sm"
          >
            <div
              ref={paperRef}
              style={{
                width: "740px",
                minHeight: "1046px",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              className="bg-white border border-slate-200/90 rounded-sm overflow-hidden"
            >
              <div id="print-area" className="w-full h-full text-[12px]">
                <Preview template={template} data={deferredData} />
              </div>
            </div>
          </div>

          {/* Mobile Bottom Action Bar when viewing Preview */}
          <div className="lg:hidden w-full p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0 sticky bottom-0 mt-auto z-20 rounded-t-lg shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className="flex-1 h-10 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Pencil className="w-3.5 h-3.5 text-blue-600" />
              Edit Details
            </button>
            <button
              type="button"
              onClick={onDownloadHandler}
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Sidebar Form */}
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
          mode={mode}
          className={cn(
            activeTab === "edit" ? "flex" : "hidden lg:flex"
          )}
        />
      </div>
    </div>
  );
}
