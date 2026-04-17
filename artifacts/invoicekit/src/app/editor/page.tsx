"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceData, TemplateType } from "@/lib/schema";
import nextDynamic from "next/dynamic";
import {
  X,
  Plus,
  Download,
  ChevronDown,
  ChevronUp,
  Mail,
  Loader2,
  RotateCcw,
  Save,
  LayoutTemplate,
  User,
  ArrowLeft,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocalDraft } from "@/hooks/use-local-draft";
import Link from "next/link";

const Preview = nextDynamic(() => import("@/components/home/Preview").then((m) => m.Preview), {
  ssr: false,
});

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

const toInputDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDefaultInvoiceData = (): InvoiceData => {
  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 14);
  return {
    businessName: "",
    businessEmail: "",
    businessAddress: "",
    logoUrl: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: "INV-001",
    issueDate: toInputDate(issueDate),
    dueDate: toInputDate(dueDate),
    lineItems: [{ id: "item-1", description: "", quantity: 1, unitPrice: 0 }],
    taxRate: 0,
    discount: 0,
    currency: "USD",
    notes: "",
  };
};

const Section = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="mb-6 bg-white border border-border rounded-lg overflow-hidden"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-muted/5 hover:bg-muted/10 transition-colors font-semibold text-sm uppercase tracking-wider text-muted-foreground">
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 space-y-4">{children}</CollapsibleContent>
    </Collapsible>
  );
};

// Post-download upsell dialog
function UpsellDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0/*, y: 10*/ }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5">
            <Download className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Invoice downloaded! 🎉
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Want to save this invoice and your client details for next time? Create a free account
            — your business profile and invoices will be securely stored.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/register")}
              className="h-11 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Create a free account
            </button>
            <button
              onClick={onClose}
              className="h-11 text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              No thanks, I'll continue as guest
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Draft restore banner
function DraftBanner({ onRestore, onDiscard }: { onRestore: () => void; onDiscard: () => void }) {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 220 }}
      className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between gap-4 bg-primary text-primary-foreground px-6 py-3 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <RotateCcw className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium">
          We found an unsaved invoice draft. Would you like to restore it?
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRestore}
          className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors"
        >
          Restore
        </button>
        <button
          onClick={onDiscard}
          className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        >
          Discard
        </button>
      </div>
    </motion.div>
  );
}

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { saveDraft, loadDraft, clearDraft, hasDraft } = useLocalDraft();

  const [template, setTemplate] = useState<TemplateType>(
    (searchParams.get("template") as TemplateType) ?? "clean"
  );
  const [data, setData] = useState<InvoiceData>(() => getDefaultInvoiceData());
  const [isSending, setIsSending] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const form = useForm<InvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: data,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
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
      // Pick only fields that match InvoiceData to avoid MongoDB metadata leaks into form
      const { _id, userId, createdAt, updatedAt, ...cleanData } = existingInvoice;
      form.reset(cleanData);
      setData(cleanData);
      if (existingInvoice.template) {
        setTemplate(existingInvoice.template as TemplateType);
      }
    }
  }, [existingInvoice, form]);

  /**
   * Keep template in a ref so saveInvoiceToDB's useCallback is stable
   * and doesn't re-create on every template dropdown change.
   * Rule: rerender-use-ref-transient-values / rerender-dependencies
   */
  const templateRef = useRef(template);
  useEffect(() => { templateRef.current = template; }, [template]);


  // Check for draft on mount (only for guests)
  useEffect(() => {
    if (!session && hasDraft()) {
      setShowDraftBanner(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Pre-fill business profile for logged-in users.
   * Uses React Query — if the user came from /settings the cache is already warm,
   * making this a zero-cost lookup instead of a new network request.
   * Rule: client-swr-dedup / async-parallel
   */
  const { data: settingsData } = useQuery<{
    businessName?: string;
    businessEmail?: string;
    businessAddress?: string;
    logoUrl?: string;
  } | null>({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then((r) => (r.ok ? r.json() : null)),
    enabled: !!session && !invoiceId, // Don't overwrite if we are editing an existing invoice
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

  // Auto-save draft for guests
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

  const handleRestoreDraft = () => {
    const draft = loadDraft();
    if (draft) {
      form.reset(draft.data);
      setData(draft.data);
      setTemplate(draft.template as TemplateType);
    }
    setShowDraftBanner(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftBanner(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      form.setError("logoUrl", { message: "Please upload an image file" });
      e.target.value = "";
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      form.setError("logoUrl", { message: "Logo must be 2MB or smaller" });
      e.target.value = "";
      return;
    }
    form.clearErrors("logoUrl");
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("logoUrl", reader.result as string, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (values: InvoiceData) => {
    if (session && usageData) {
      if (usageData.usage >= usageData.limit) {
         toast.error("Monthly usage limit reached. Please upgrade to Pro.");
         router.push("/dashboard");
         return;
      }
      if (!invoiceId) {
        // Record download by saving as draft/sent so it counts against limit
        await saveInvoiceToDB(values, "draft");
      }
    }
    
    setData(values);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
    const element = document.getElementById("print-area");
    if (!element) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const opt = {
      margin: 0,
      filename: `invoice-${values.invoiceNumber || "001"}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        onclone: (clonedDoc: Document) => {
          const elements = clonedDoc.querySelectorAll("*");
          elements.forEach((el) => {
            const node = el as HTMLElement;
            const style = window.getComputedStyle(node);
            const colorProps = [
              "color", "backgroundColor", "borderColor", "borderTopColor",
              "borderBottomColor", "borderLeftColor", "borderRightColor", "outlineColor",
            ];
            colorProps.forEach((prop) => {
              const cssProperty = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
              const inlineValue = node.style.getPropertyValue(cssProperty);
              const value = inlineValue || style.getPropertyValue(cssProperty);
              if (!value || (!value.includes("oklab") && !value.includes("oklch") && !value.includes("from"))) return;
              if (prop === "backgroundColor") { node.style.backgroundColor = value.includes("oklch") ? "#f3f4f6" : "#ffffff"; return; }
              if (prop === "color") { node.style.color = "#111827"; return; }
              if (prop.includes("border")) { node.style.setProperty(cssProperty, "#e5e7eb"); }
            });
          });
        },
      },
      jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
    };
    try {
      await html2pdf().set(opt).from(element).save();
      clearDraft();
      // Show upsell only for guests
      if (!session) setShowUpsell(true);
    } catch (error) {
      console.error("PDF generation failed:", error);
      window.print();
    }
  };

  const handleSendEmail = async (values: InvoiceData) => {
    if (!session) {
      toast.error("Please login to send invoices via email", {
        action: { label: "Login", onClick: () => router.push("/login") },
      });
      return;
    }
    if (usageData && usageData.usage >= usageData.limit) {
      toast.error("Monthly usage limit reached. Please upgrade to Pro.");
      router.push("/dashboard");
      return;
    }
    if (!values.clientEmail) {
      toast.error("Please provide a client email address");
      return;
    }
    setIsSending(true);
    try {
      const subtotal = values.lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      const taxAmount = subtotal * (values.taxRate / 100);
      const discountAmount = subtotal * (values.discount / 100);
      const total = subtotal + taxAmount - discountAmount;
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: values.clientEmail,
          invoiceData: {
            ...values,
            totalAmount: total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          },
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(`Invoice sent to ${values.clientEmail}`);
        // Save to DB and mark as Sent
        await saveInvoiceToDB(values, "sent");
      } else {
        toast.error(result.error || "Failed to send email");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const saveInvoiceToDB = useCallback(async (values: InvoiceData, status: "draft" | "sent" = "draft") => {
    if (!session) return;
    setIsSavingToDb(true);
    try {
      const url = invoiceId ? `/api/invoices/${invoiceId}` : "/api/invoices";
      const method = invoiceId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        // Read from ref — no need to include template in deps, callback stays stable.
        // Rule: rerender-use-ref-transient-values / rerender-dependencies
        body: JSON.stringify({ ...values, template: templateRef.current, status }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success(status === "sent" ? "Invoice sent & saved" : "Invoice saved to dashboard");

      // If it was a new invoice, redirect to dashboard or the new edit URL
      if (!invoiceId) {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to save invoice");
    } finally {
      setIsSavingToDb(false);
    }
  }, [session, invoiceId, router]); // stable — template read via ref

  const lineItemsErrorMessage =
    !Array.isArray(form.formState.errors.lineItems) &&
    typeof form.formState.errors.lineItems?.message === "string"
      ? form.formState.errors.lineItems.message
      : undefined;

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

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* Draft restore banner */}
      <AnimatePresence>
        {showDraftBanner && (
          <DraftBanner onRestore={handleRestoreDraft} onDiscard={handleDiscardDraft} />
        )}
      </AnimatePresence>

      {/* Upsell dialog */}
      {showUpsell && <UpsellDialog onClose={() => setShowUpsell(false)} />}

      {/* Top bar */}
      <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          {/* Template switcher */}
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
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
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
            <Link
              href="/login"
              className="h-8 px-3 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted/10 transition-colors"
            >
              Login to Save
            </Link>
          )}
        </div>
      </header>

      {/* Loading state for existing invoice */}
      {loadingExisting && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Loading draft...</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Preview panel */}
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

        {/* Form panel */}
        <div className="w-full lg:w-[420px] shrink-0 bg-white border-l border-border flex flex-col shadow-xl overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 bg-background">
            <Form {...form}>
              <form className="space-y-0" onSubmit={form.handleSubmit(handleDownload)}>
                <Section title="Your Details">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business / Your Name</FormLabel>
                          <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="businessAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl><Textarea rows={3} {...field} value={field.value || ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <label className="mb-2 block text-sm font-medium leading-none">Logo</label>
                    <div className="flex items-center gap-4">
                      {data.logoUrl ? (
                        <div className="relative w-20 h-20 border border-border rounded flex items-center justify-center bg-white">
                          <img src={data.logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain p-1" />
                          <button
                            type="button"
                            onClick={() => form.setValue("logoUrl", "", { shouldDirty: true, shouldValidate: true })}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 border border-dashed border-border rounded flex items-center justify-center bg-muted/5 text-muted-foreground text-xs">
                          No logo
                        </div>
                      )}
                      <Input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full max-w-xs" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG, or WEBP. Max size 2MB.</p>
                    {form.formState.errors.logoUrl?.message && (
                      <p className="text-[0.8rem] font-medium text-destructive mt-1">{form.formState.errors.logoUrl.message}</p>
                    )}
                  </div>
                </Section>

                <Section title="Client Details">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Email</FormLabel>
                          <FormControl><Input type="email" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="clientAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Address</FormLabel>
                        <FormControl><Textarea rows={3} {...field} value={field.value || ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Section>

                <Section title="Invoice Info">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="invoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice #</FormLabel>
                          <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Date</FormLabel>
                          <FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                <Section title="Line Items">
                  <div className="space-y-4">
                    {fields.map((lineItem, index) => (
                      <div key={lineItem.id} className="flex items-start gap-2 relative p-3 border border-border rounded bg-white">
                        <div className="flex-1 space-y-3">
                          <FormField
                            control={form.control}
                            name={`lineItems.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl><Input placeholder="Description" {...field} value={field.value || ""} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-3">
                            <FormField
                              control={form.control}
                              name={`lineItems.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl><Input type="number" min={0} step="any" placeholder="Qty" {...field} value={field.value ?? ""} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`lineItems.${index}.unitPrice`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl><Input type="number" min={0} step="any" placeholder="Price" {...field} value={field.value ?? ""} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={fields.length <= 1}
                          aria-label="Remove line item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => append({ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 })}
                      className="w-full py-3 border-2 border-dashed border-accent/30 text-accent font-medium rounded hover:bg-accent/5 hover:border-accent/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Line Item
                    </button>
                    {lineItemsErrorMessage && (
                      <p className="text-[0.8rem] font-medium text-destructive">{lineItemsErrorMessage}</p>
                    )}
                  </div>
                </Section>

                <Section title="Tax, Discount & Currency" defaultOpen={false}>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax %</FormLabel>
                          <FormControl><Input type="number" min={0} max={100} step="any" {...field} value={field.value ?? 0} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount %</FormLabel>
                          <FormControl><Input type="number" min={0} max={100} step="any" {...field} value={field.value ?? 0} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["USD", "GBP", "EUR", "PKR", "CAD", "AUD"].map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                <Section title="Notes / Terms" defaultOpen={false}>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="Payment due within 30 days..." rows={4} {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Section>

                <button type="submit" className="hidden" aria-hidden="true" />
              </form>
            </Form>
          </div>

          {/* Action footer */}
          <div className="p-5 bg-white border-t border-border shrink-0 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={form.handleSubmit(handleDownload)}
                className="h-[52px] bg-accent/10 hover:bg-accent/20 text-accent font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download
              </button>
              <button
                type="button"
                onClick={form.handleSubmit(handleSendEmail)}
                disabled={isSending}
                className="h-[52px] bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-70"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                Send to Email
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {session ? "Logged in. Your invoices are saved." : "Login to send invoices and save drafts."}
            </p>
          </div>
        </div>
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
