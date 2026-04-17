import { useEffect, useRef, useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { InvoiceData, TemplateType } from "@/lib/schema";
import { useLocalDraft } from "@/hooks/use-local-draft";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UseEditorSyncProps {
  form: UseFormReturn<InvoiceData>;
  template: TemplateType;
  invoiceId: string | null;
  setData: (data: InvoiceData) => void;
  setTemplate: (template: TemplateType) => void;
}

export function useEditorSync({
  form,
  template,
  invoiceId,
  setData,
  setTemplate,
}: UseEditorSyncProps) {
  const { data: session } = useSession();
  const { saveDraft, loadDraft, hasDraft } = useLocalDraft();
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const router = useRouter();
  
  const templateRef = useRef(template);
  useEffect(() => {
    templateRef.current = template;
  }, [template]);

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
      }, 150); // Increased slightly for better debounce
    });
    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form, session, template, saveDraft, setData]);

  const saveInvoiceToDB = useCallback(
    async (values: InvoiceData, status: "draft" | "sent" = "draft") => {
      if (!session) return;
      setIsSavingToDb(true);
      try {
        const url = invoiceId ? `/api/invoices/${invoiceId}` : "/api/invoices";
        const method = invoiceId ? "PATCH" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            template: templateRef.current,
            status,
          }),
        });

        if (!response.ok) throw new Error("Failed to save");

        toast.success(
          status === "sent" ? "Invoice sent & saved" : "Invoice saved to dashboard"
        );

        if (!invoiceId) {
          router.push("/dashboard");
        }
      } catch {
        toast.error("Failed to save invoice");
      } finally {
        setIsSavingToDb(false);
      }
    },
    [session, invoiceId, router]
  );

  const handleRestoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      form.reset(draft.data);
      setData(draft.data);
      setTemplate(draft.template as TemplateType);
    }
  }, [loadDraft, form, setData, setTemplate]);

  return {
    isSavingToDb,
    saveInvoiceToDB,
    handleRestoreDraft,
    hasDraft: hasDraft(),
    session,
  };
}
