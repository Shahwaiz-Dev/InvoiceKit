import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceData, TemplateType } from "@/lib/schema";
import { Preview } from "./Preview";
import { X, Plus, Download, ChevronDown, ChevronUp } from "lucide-react";
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

export function Editor({ template, isOpen, onClose }: EditorProps) {
  const [data, setData] = useState<InvoiceData>({
    lineItems: [],
    taxRate: 0,
    discount: 0,
    currency: "USD",
    invoiceNumber: "INV-001",
  });

  const form = useForm<InvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: data,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  // Watch form changes to update preview
  const debounceRef = useRef<NodeJS.Timeout>();
  form.watch((val) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setData(val as InvoiceData);
    }, 150);
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("logoUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    window.print();
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
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-4">
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-50 flex print:block">
              {/* Preview Side (Left) */}
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

              {/* Editor Side (Right) */}
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
                    <form className="space-y-6">
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
                                  onClick={() => form.setValue("logoUrl", "")}
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
                                  <Input {...field} />
                                </FormControl>
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
                              </FormItem>
                            )}
                          />
                        </div>
                      </Section>

                      <Section title="Line Items">
                        <div className="space-y-4">
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
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
                                        />
                                      </FormControl>
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
                                            placeholder="Qty"
                                            {...field}
                                          />
                                        </FormControl>
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
                                            placeholder="Price"
                                            {...field}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="mt-2 text-muted-foreground hover:text-destructive transition-colors"
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
                                  <Input type="number" {...field} />
                                </FormControl>
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
                                  <Input type="number" {...field} />
                                </FormControl>
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
                                  defaultValue={field.value}
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
                            </FormItem>
                          )}
                        />
                      </Section>
                    </form>
                  </Form>
                </div>

                <div className="p-6 bg-white border-t border-border shrink-0 text-center">
                  <button
                    onClick={handleDownload}
                    className="w-full h-[52px] bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mb-3 shadow-lg shadow-accent/20"
                  >
                    <Download className="w-5 h-5" /> Download PDF
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Your data never leaves your browser.
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
