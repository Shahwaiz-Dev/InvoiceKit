import { useState } from "react";
import { motion } from "framer-motion";
import { Form } from "@/components/ui/form";
import { Download, Mail, Loader2, Layers, Users, FileText, SlidersHorizontal } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { InvoiceData } from "@/lib/schema";
import { BusinessSection } from "./sections/BusinessSection";
import { ClientSection } from "./sections/ClientSection";
import { InvoiceInfoSection } from "./sections/InvoiceInfoSection";
import { LineItemsSection } from "./sections/LineItemsSection";
import { FinancialsSection } from "./sections/FinancialsSection";
import { NotesSection } from "./sections/NotesSection";
import { SignatureSection } from "./sections/SignatureSection";
import { FormSectionWrapper } from "./FormSectionWrapper";
import { cn } from "@/lib/utils";

interface EditorSidebarProps {
  form: UseFormReturn<InvoiceData>;
  template: string;
  labels: any;
  onDownload: () => void;
  onSendEmail: () => void;
  isSending: boolean;
  session: any;
  customers?: any[];
  canManageCustomers?: boolean;
  className?: string;
  mode?: "full" | "embedded";
}

export function EditorSidebar({
  form,
  template,
  labels,
  onDownload,
  onSendEmail,
  isSending,
  session,
  customers = [],
  canManageCustomers = false,
  className,
  mode = "full",
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<"items" | "parties" | "details" | "all">("items");

  return (
    <motion.div
      initial={false}
      animate={{ x: 0 }}
      className={cn(
        "w-full lg:w-[420px] xl:w-[460px] shrink-0 h-full bg-white border-l border-slate-200/80 flex flex-col shadow-none print:hidden",
        className
      )}
    >
      {/* Sleek Top Status Bar */}
      <div className="h-11 px-4 border-b border-slate-200/80 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-xs text-slate-800 capitalize">{template} Template</span>
        </div>
        <span className="text-[11px] font-medium text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-100">
          Live Sync
        </span>
      </div>

      {/* Segmented Tab Navigation to Eliminate Form Overwhelm */}
      <div className="px-3 py-2 bg-slate-50/60 border-b border-slate-200/80 shrink-0">
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/60 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab("items")}
            className={cn(
              "py-1.5 px-1.5 rounded-md transition-all flex items-center justify-center gap-1",
              activeTab === "items"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Items</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("parties")}
            className={cn(
              "py-1.5 px-1.5 rounded-md transition-all flex items-center justify-center gap-1",
              activeTab === "parties"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Parties</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={cn(
              "py-1.5 px-1.5 rounded-md transition-all flex items-center justify-center gap-1",
              activeTab === "details"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "py-1.5 px-1.5 rounded-md transition-all flex items-center justify-center gap-1",
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>All</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50/30">
        <Form {...form}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Tab 1: Items & Financials */}
            {(activeTab === "items" || activeTab === "all") && (
              <>
                <FormSectionWrapper title={labels.lineItemsSection} defaultOpen={true}>
                  <LineItemsSection form={form} labels={labels} />
                </FormSectionWrapper>

                <FormSectionWrapper title="Tax, Discount & Currency" defaultOpen={activeTab === "items"}>
                  <FinancialsSection form={form} labels={labels} />
                </FormSectionWrapper>
              </>
            )}

            {/* Tab 2: Parties (From & To) */}
            {(activeTab === "parties" || activeTab === "all") && (
              <>
                <FormSectionWrapper title={labels.businessSection} defaultOpen={true}>
                  <BusinessSection form={form} labels={labels} />
                </FormSectionWrapper>

                <FormSectionWrapper title={labels.clientSection} defaultOpen={true}>
                  <ClientSection 
                    form={form} 
                    labels={labels} 
                    customers={customers} 
                    canManageCustomers={canManageCustomers} 
                  />
                </FormSectionWrapper>
              </>
            )}

            {/* Tab 3: Invoice Info & Notes */}
            {(activeTab === "details" || activeTab === "all") && (
              <>
                <FormSectionWrapper title={labels.invoiceInfo} defaultOpen={true}>
                  <InvoiceInfoSection form={form} labels={labels} />
                </FormSectionWrapper>

                <FormSectionWrapper title={labels.notesSection} defaultOpen={true}>
                  <NotesSection form={form} labels={labels} />
                </FormSectionWrapper>

                <FormSectionWrapper title="Signature" defaultOpen={false}>
                  <SignatureSection form={form} />
                </FormSectionWrapper>
              </>
            )}
          </form>
        </Form>
      </div>

      {/* Action Footer */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200/80 shrink-0 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onDownload}
            className="h-10 sm:h-11 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-blue-600" /> Download PDF
          </button>
          <button
            type="button"
            onClick={onSendEmail}
            disabled={isSending}
            className="h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-70"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            Send Email
          </button>
        </div>
      </div>
    </motion.div>
  );
}
