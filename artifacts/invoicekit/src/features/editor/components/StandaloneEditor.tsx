"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { invoiceSchema, InvoiceData, TemplateType } from "@/lib/schema";
import { Preview } from "@/components/home/Preview";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { DraftBanner } from "./DraftBanner";
import { UpsellDialog } from "./UpsellDialog";
import { InvoiceActionBar } from "./canvas/InvoiceActionBar";
import { InvoiceMakerCanvas } from "./canvas/InvoiceMakerCanvas";
import { SendEmailDialog } from "./canvas/SendEmailDialog";
import { useInvoiceActions } from "../hooks/use-invoice-actions";
import { useEditorSync } from "../hooks/use-editor-sync";
import { 
  getDefaultInvoiceData, 
  getNextInvoiceNumber, 
  toInputDate, 
  calculateDueDateByTerms 
} from "../lib/editor-utils";
import {
  DEFAULT_TEMPLATE,
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
  const { data: authSession } = useSession();

  // Basic States
  const [template, setTemplate] = useState<TemplateType>(initialTemplate);
  const [data, setData] = useState<InvoiceData>(() => getDefaultInvoiceData());
  const deferredData = useDeferredValue(data);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // View state: "canvas" (direct document maker) vs "preview" (rendered printable A4)
  const [activeView, setActiveView] = useState<"canvas" | "preview">("canvas");
  const [scale, setScale] = useState(0.85);
  const [paperHeight, setPaperHeight] = useState(1046);
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  // Measure and scale A4 sheet for preview
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
  }, [activeView]);

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

  const { handleDownload, handleSendEmail, isSending } = useInvoiceActions();

  const form = useForm<InvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: data,
    mode: "onChange",
  });

  // Editor Sync logic (local draft + database save)
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

  useEffect(() => {
    if (hasDraft && !invoiceId) {
      setShowDraftBanner(true);
    }
  }, [hasDraft, invoiceId]);

  // Pre-fill business profile for logged-in users
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

  const { data: usageData } = useQuery<{ usage: number; limit: number; isPro: boolean; canManageCustomers?: boolean }>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    enabled: !!session,
  });

  const { data: customers = [] } = useQuery<any[]>({
    queryKey: ["customers"],
    queryFn: () => fetch("/api/customers").then((r) => r.json()),
    enabled: !!session && (session.user as any)?.subscriptionPlan === "authority",
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
      if (current === "0001" || current === "INV-001") {
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

  // Download PDF flow
  const onDownloadHandler = async () => {
    setIsDownloading(true);
    try {
      const currentValues = form.getValues();
      const success = await handleDownload(
        currentValues,
        setData,
        session,
        usageData ?? null,
        invoiceId,
        saveInvoiceToDB
      );
      if (success) {
        toast.success("Invoice PDF generated successfully!");
        if (!session) setShowUpsell(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  // Email sending flow from dialog
  const onSendEmailHandler = async (recipientEmail: string, customMessage?: string) => {
    const currentValues = form.getValues();
    await handleSendEmail(currentValues, session, recipientEmail, customMessage);
    if (session) await saveInvoiceToDB(currentValues, "sent");
  };

  // Reset to Blank
  const onResetHandler = () => {
    const blank = getDefaultInvoiceData();
    form.reset(blank);
    setData(blank);
    toast.info("Invoice reset to blank");
  };

  const filteredTemplates = useMemo(
    () => getAvailableTemplates(Boolean(session)),
    [session]
  );

  const containerClasses = mode === "full" 
    ? "fixed inset-0 bg-slate-50 flex flex-col overflow-hidden" 
    : "relative w-full bg-slate-50/60 flex flex-col overflow-hidden min-h-[760px] sm:min-h-[840px]";

  return (
    <div className={containerClasses}>
      {/* Pro Upsell Modal */}
      {showUpsell && <UpsellDialog onClose={() => setShowUpsell(false)} />}

      {/* Send Email Modal */}
      <SendEmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        data={form.getValues()}
        onSend={onSendEmailHandler}
        isSending={isSending}
      />

      {/* Top Invoice Action & Navigation Bar */}
      <InvoiceActionBar
        template={template}
        setTemplate={setTemplate}
        templates={filteredTemplates}
        activeView={activeView}
        setActiveView={setActiveView}
        onDownload={onDownloadHandler}
        isDownloading={isDownloading}
        onOpenEmail={() => setShowEmailDialog(true)}
        onReset={onResetHandler}
        onSave={session ? form.handleSubmit((v) => saveInvoiceToDB(v, "draft")) : undefined}
        isSavingToDb={isSavingToDb}
        session={session}
        mode={mode}
      />


      {/* Loading Overlay */}
      {loadingExisting && (
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-slate-700 font-medium">Loading draft...</p>
          </div>
        </div>
      )}

      {/* Main Flow Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* VIEW 1: The Interactive Invoice Maker Canvas (Matches user reference image) */}
        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-10 flex flex-col items-center justify-start",
            activeView === "canvas" ? "flex" : "hidden"
          )}
        >
          <InvoiceMakerCanvas
            form={form}
            data={deferredData}
            customers={customers}
            canManageCustomers={usageData?.canManageCustomers}
          />
        </div>

        {/* VIEW 2: Rendered Printable A4 Sheet Preview */}
        <div
          ref={containerRef}
          className={cn(
            "bg-slate-100/80 overflow-y-auto overflow-x-hidden p-3 sm:p-6 flex-col items-center justify-start border-r border-slate-200/80",
            // Visible when preview view is active
            activeView === "preview"
              ? "flex flex-1 w-full opacity-100 relative z-10"
              // Offscreen when canvas view is active so html2pdf can seamlessly clone #print-area!
              : "fixed -left-[9999px] -top-[9999px] w-[740px] opacity-0 pointer-events-none"
          )}
        >
          <div
            style={{
              width: `${Math.round(740 * scale)}px`,
              height: `${Math.round(paperHeight * scale)}px`,
            }}
            className="relative shrink-0 transition-transform duration-75 my-auto shadow-2xl shadow-slate-900/10 rounded-sm"
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
        </div>
      </div>
    </div>
  );
}
