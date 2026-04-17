"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceData, TemplateType } from "@/lib/schema";
import {
  Loader2,
  Save,
  LayoutTemplate,
  User,
  ArrowLeft,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocalDraft } from "@/hooks/use-local-draft";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Preview } from "@/components/home/Preview";

// Refactored Components
import { EditorSidebar } from "@/features/editor/components/EditorSidebar";
import { DraftBanner } from "@/features/editor/components/DraftBanner";
import { UpsellDialog } from "@/features/editor/components/UpsellDialog";
import { useInvoiceActions } from "@/features/editor/hooks/use-invoice-actions";
import { getLabels, getDefaultInvoiceData } from "@/features/editor/lib/editor-utils";

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { saveDraft, loadDraft, clearDraft, hasDraft } = useLocalDraft();

  const [template, setTemplate] = useState<TemplateType>(
    (searchParams.get("template") as TemplateType) ?? "clean"
  );
  const [data, setData] = useState<InvoiceData>(() => getDefaultInvoiceData());
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const labels = getLabels(template);
  const { handleDownload, handleSendEmail, isSending, isSavingToDb, setIsSavingToDb } = useInvoiceActions();

  const form = useForm<InvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: data,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const invoiceId = searchParams.get("id");

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

  const templateRef = useRef(template);
  useEffect(() => { templateRef.current = template; }, [template]);

  // Check for draft on mount (only for guests)
  useEffect(() => {
    if (!session && hasDraft()) {
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

  // Auto-save draft
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = form.watch((val) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setData(val as InvoiceData);
        if (!session) {
          saveDraft(val as InvoiceData, template);
        }
      }, 120);
    });
    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form, session, template, saveDraft]);

  const saveInvoiceToDB = useCallback(async (values: InvoiceData, status: "draft" | "sent" = "draft") => {
    if (!session) return;
    setIsSavingToDb(true);
    try {
      const url = invoiceId ? `/api/invoices/${invoiceId}` : "/api/invoices";
      const method = invoiceId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, template: templateRef.current, status }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success(status === "sent" ? "Invoice sent & saved" : "Invoice saved to dashboard");

      if (!invoiceId) {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to save invoice");
    } finally {
      setIsSavingToDb(false);
    }
  }, [session, invoiceId, router, setIsSavingToDb]);

  const handleRestoreDraft = () => {
    const draft = loadDraft();
    if (draft) {
      form.reset(draft.data);
      setData(draft.data);
      setTemplate(draft.template as TemplateType);
    }
    setShowDraftBanner(false);
  };

  const templates: { value: TemplateType; label: string }[] = session
    ? [
        { value: "clean", label: "Clean" },
        { value: "corporate", label: "Corporate" },
        { value: "minimal", label: "Minimal" },
        { value: "contractor", label: "Contractor" },
        { value: "salaries", label: "Salary/Payslip" },
        { value: "modern", label: "Modern" },
        { value: "creative", label: "Creative" },
      ]
    : [
        { value: "clean", label: "Clean" },
        { value: "modern", label: "Modern" },
      ];

  const onDownloadHandler = form.handleSubmit(async (v) => {
    const success = await handleDownload(v, setData, session, usageData, invoiceId, saveInvoiceToDB);
    if (success) {
      clearDraft();
      if (!session) setShowUpsell(true);
    }
  });

  const onSendEmailHandler = form.handleSubmit(async (v) => {
    await handleSendEmail(v, session);
    if (session) await saveInvoiceToDB(v, "sent");
  });

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      <AnimatePresence>
        {showDraftBanner && (
          <DraftBanner onRestore={handleRestoreDraft} onDiscard={() => setShowDraftBanner(false)} />
        )}
      </AnimatePresence>

      {showUpsell && <UpsellDialog onClose={() => setShowUpsell(false)} />}

      <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1">
            <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
            <Select value={template} onValueChange={(v) => setTemplate(v as TemplateType)}>
              <SelectTrigger className="h-8 text-xs border-0 shadow-none bg-transparent pr-2 pl-1 font-medium gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.value} value={t.value} className="text-sm">
                    {t.label} Template
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/dashboard" className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <User className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={form.handleSubmit((v) => saveInvoiceToDB(v, "draft"))}
                disabled={isSavingToDb}
                className="h-8 px-3 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted/10 transition-colors flex items-center gap-1.5 disabled:opacity-60"
              >
                {isSavingToDb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
            </>
          ) : (
            <Link href="/login" className="h-8 px-3 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted/10 transition-colors">
              Login to Save
            </Link>
          )}
        </div>
      </header>

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
                <Preview template={template} data={data} />
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
