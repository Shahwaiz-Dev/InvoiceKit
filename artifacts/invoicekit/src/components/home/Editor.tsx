import { useEffect, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceData, TemplateType } from "@/lib/schema";
import { resolveModernColor } from "@/features/editor/lib/editor-utils";
import { Preview } from "./Preview";
import { X, Plus, Download, ChevronDown, ChevronUp, Mail, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLocalDraft } from "@/hooks/use-local-draft";
import { DraftBanner } from "@/features/editor/components/DraftBanner";
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

interface EditorProps {
  template: TemplateType;
  isOpen: boolean;
  onClose: () => void;
}

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
    lineItems: [
      {
        id: "item-1",
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ],
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
      <CollapsibleContent className="p-4 space-y-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export function Editor({ template, isOpen, onClose }: EditorProps) {
  const [data, setData] = useState<InvoiceData>(() => getDefaultInvoiceData());
  const [isSending, setIsSending] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { saveDraft, loadDraft, hasDraft, clearDraft } = useLocalDraft();
  const [showDraftBanner, setShowDraftBanner] = useState(false);

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

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = form.watch((val) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        const invoiceData = val as InvoiceData;
        setData(invoiceData);
        if (!session) {
          saveDraft(invoiceData, template);
        }
      }, 150);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [form, session, template, saveDraft]);

  // Check for draft on mount
  useEffect(() => {
    if (hasDraft() && isOpen) {
      setShowDraftBanner(true);
    }
  }, [hasDraft, isOpen]);

  const handleRestoreDraft = () => {
    const draft = loadDraft();
    if (draft) {
      form.reset(draft.data);
      setData(draft.data);
      setShowDraftBanner(false);
    }
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
    setData(values);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
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
              "color",
              "backgroundColor",
              "borderColor",
              "borderTopColor",
              "borderBottomColor",
              "borderLeftColor",
              "borderRightColor",
              "outlineColor",
              "fill",
              "stroke",
              "boxShadow",
              "background",
              "backgroundImage",
              "border",
              "outline"
            ];

            colorProps.forEach((prop) => {
              const cssProperty = prop.replace(/[A-Z]/g, (m: string) => `-${m.toLowerCase()}`);
              const inlineValue = node.style.getPropertyValue(cssProperty);
              const value = inlineValue || style.getPropertyValue(cssProperty);
              const isModernColor = value && (
                value.includes("oklch") || 
                value.includes("oklab") || 
                value.includes("lab") || 
                value.includes("lch") || 
                value.includes("hwb") || 
                value.includes("from") ||
                value.includes("color-mix")
              );

              if (isModernColor) {
                node.style.setProperty(cssProperty, resolveModernColor(value));
              }
            });
          });
        },
      },
      jsPDF: {
        unit: "mm" as const,
        format: "a4" as const,
        orientation: "portrait" as const,
      },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      window.print();
    }
  };

  const handleSendEmail = async (values: InvoiceData) => {
    if (!session) {
      const callbackUrl = encodeURIComponent(`/editor?template=${template}`);
      toast.error("Please login to send invoices via email", {
        action: {
          label: "Login",
          onClick: () => router.push(`/login?callbackUrl=${callbackUrl}` as any),
        },
      });
      return;
    }

    if (!values.clientEmail) {
      toast.error("Please provide a client email address");
      return;
    }

    setIsSending(true);

    try {
      // Calculate total for email
      const subtotal = values.lineItems.reduce(
        (acc, item) => acc + (item.quantity * item.unitPrice),
        0
      );
      const taxAmount = subtotal * (values.taxRate / 100);
      const discountAmount = subtotal * (values.discount / 100);
      const total = subtotal + taxAmount - discountAmount;

      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: values.clientEmail,
          invoiceData: {
            ...values,
            totalAmount: total.toLocaleString(undefined, {
               minimumFractionDigits: 2,
               maximumFractionDigits: 2
            })
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Invoice sent to ${values.clientEmail}`);
      } else {
        toast.error(result.error || "Failed to send email");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const lineItemsErrorMessage =
    !Array.isArray(form.formState.errors.lineItems) &&
    typeof form.formState.errors.lineItems?.message === "string"
      ? form.formState.errors.lineItems.message
      : undefined;

  return (
    <>
      <AnimatePresence>
        {showDraftBanner && (
          <DraftBanner 
            onRestore={handleRestoreDraft} 
            onDiscard={() => setShowDraftBanner(false)} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-50 flex print:block">
              <div className="hidden lg:block w-[55%] h-full bg-background relative print:w-full print:h-auto">
                <div className="absolute top-6 right-6 z-10 px-3 py-1.5 bg-white border border-border rounded-full shadow-sm text-xs font-medium text-muted-foreground print:hidden">
                  A4 &middot; Portrait
                </div>
                <div className="h-full w-full overflow-auto p-12 flex justify-center items-start print:p-0 print:overflow-visible">
                  <div className="w-full max-w-[800px] aspect-[1/1.414] bg-white shadow-2xl print:shadow-none print:max-w-none">
                    <div id="print-area" className="w-full h-full">
                      <Preview template={template} data={data} />
                    </div>
                  </div>
                </div>
              </div>

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
                    <span className="font-semibold text-foreground capitalize">
                      {template} Template
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                  >
                    &times; Change Template
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-background">
                  <Form {...form}>
                    <form
                      className="space-y-6"
                      onSubmit={form.handleSubmit(handleDownload)}
                    >
                      <Section title="Your Details">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business / Your Name</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value || ""} />
                                </FormControl>
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
                                <FormControl>
                                  <Input
                                    type="email"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
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
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div>
                          <label className="mb-2 block text-sm font-medium leading-none">
                            Logo
                          </label>
                          <div className="flex items-center gap-4">
                            {data.logoUrl ? (
                              <div className="relative w-20 h-20 border border-border rounded flex items-center justify-center bg-white">
                                <img
                                  src={data.logoUrl}
                                  alt="Logo preview"
                                  className="max-w-full max-h-full object-contain p-1"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    form.setValue("logoUrl", "", {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    })
                                  }
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
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="w-full max-w-xs"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            JPG, PNG, or WEBP. Max size 2MB.
                          </p>
                          {form.formState.errors.logoUrl?.message ? (
                            <p className="text-[0.8rem] font-medium text-destructive mt-1">
                              {form.formState.errors.logoUrl.message}
                            </p>
                          ) : null}
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
                                <FormControl>
                                  <Input {...field} value={field.value || ""} />
                                </FormControl>
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
                                <FormControl>
                                  <Input
                                    type="email"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
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
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
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
                                <FormControl>
                                  <Input {...field} value={field.value || ""} />
                                </FormControl>
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
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
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
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Section>

                      <Section title="Line Items">
                        <div className="space-y-4">
                          {fields.map((lineItem, index) => (
                            <div
                              key={lineItem.id}
                              className="flex items-start gap-2 relative group p-3 border border-border rounded bg-white"
                            >
                              <div className="flex-1 space-y-3">
                                <FormField
                                  control={form.control}
                                  name={`lineItems.${index}.description`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="Description"
                                          {...field}
                                          value={field.value || ""}
                                        />
                                      </FormControl>
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
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min={0}
                                            step="any"
                                            placeholder="Qty"
                                            {...field}
                                            value={field.value ?? ""}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`lineItems.${index}.unitPrice`}
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min={0}
                                            step="any"
                                            placeholder="Price"
                                            {...field}
                                            value={field.value ?? ""}
                                          />
                                        </FormControl>
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
                            onClick={() =>
                              append({
                                id: crypto.randomUUID(),
                                description: "",
                                quantity: 1,
                                unitPrice: 0,
                              })
                            }
                            className="w-full py-3 border-2 border-dashed border-accent/30 text-accent font-medium rounded hover:bg-accent/5 hover:border-accent/50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" /> Add Line Item
                          </button>

                          {lineItemsErrorMessage ? (
                            <p className="text-[0.8rem] font-medium text-destructive">
                              {lineItemsErrorMessage}
                            </p>
                          ) : null}
                        </div>
                      </Section>

                      <Section
                        title="Tax, Discount & Currency"
                        defaultOpen={false}
                      >
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="taxRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tax %</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step="any"
                                    {...field}
                                    value={field.value ?? 0}
                                  />
                                </FormControl>
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
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step="any"
                                    {...field}
                                    value={field.value ?? 0}
                                  />
                                </FormControl>
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
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="PKR">PKR</SelectItem>
                                    <SelectItem value="CAD">CAD</SelectItem>
                                    <SelectItem value="AUD">AUD</SelectItem>
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
                                <Textarea
                                  placeholder="Payment due within 30 days..."
                                  rows={4}
                                  {...field}
                                  value={field.value || ""}
                                />
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

                <div className="p-6 bg-white border-t border-border shrink-0 flex flex-col gap-3">
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
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

