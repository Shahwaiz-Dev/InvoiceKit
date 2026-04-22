import { motion } from "framer-motion";
import { Form } from "@/components/ui/form";
import { Download, Mail, Loader2 } from "lucide-react";
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
}: EditorSidebarProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-full lg:w-[45%] h-full bg-white border-l border-border flex flex-col shadow-2xl print:hidden"
    >
      <div className="h-16 px-6 border-b border-border flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
            {template.substring(0, 2)}
          </div>
          <span className="font-semibold text-foreground capitalize">{template} Template</span>
        </div>

      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <Form {...form}>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <FormSectionWrapper title={labels.businessSection}>
              <BusinessSection form={form} labels={labels} />
            </FormSectionWrapper>

            <FormSectionWrapper title={labels.clientSection}>
              <ClientSection 
                form={form} 
                labels={labels} 
                customers={customers} 
                canManageCustomers={canManageCustomers} 
              />
            </FormSectionWrapper>

            <FormSectionWrapper title={labels.invoiceInfo}>
              <InvoiceInfoSection form={form} labels={labels} />
            </FormSectionWrapper>

            <FormSectionWrapper title={labels.lineItemsSection}>
              <LineItemsSection form={form} labels={labels} />
            </FormSectionWrapper>

            <FormSectionWrapper title="Tax, Discount & Currency" defaultOpen={false}>
              <FinancialsSection form={form} labels={labels} />
            </FormSectionWrapper>

            <FormSectionWrapper title={labels.notesSection} defaultOpen={false}>
              <NotesSection form={form} labels={labels} />
            </FormSectionWrapper>

            <FormSectionWrapper title="Signature" defaultOpen={false}>
              <SignatureSection form={form} />
            </FormSectionWrapper>
          </form>
        </Form>
      </div>

      <div className="p-6 bg-white border-t border-border shrink-0 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onDownload}
            className="h-[52px] bg-accent/10 hover:bg-accent/20 text-accent font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> Download
          </button>
          <button
            type="button"
            onClick={onSendEmail}
            disabled={isSending}
            className="h-[52px] bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-70"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            Send to Email
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {session ? "Premium features active." : "Login to send invoices to email."}
        </p>
      </div>
    </motion.div>
  );
}
