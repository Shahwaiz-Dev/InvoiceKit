"use client";

import { useRef, useState, useMemo } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { 
  Upload, 
  Trash2, 
  Plus, 
  X, 
  Calendar, 
  PenTool, 
  FileText, 
  Building2, 
  User, 
  DollarSign, 
  Percent, 
  Truck,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { InvoiceData } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SignatureDialog } from "../SignatureDialog";
import { getTemplateUtils } from "@/features/templates/lib/template-utils";
import { CURRENCIES, calculateDueDateByTerms, MAX_LOGO_SIZE_BYTES } from "../../lib/editor-utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface InvoiceMakerCanvasProps {
  form: UseFormReturn<InvoiceData>;
  data: InvoiceData;
  customers?: any[];
  canManageCustomers?: boolean;
}

export function InvoiceMakerCanvas({
  form,
  data,
  customers = [],
  canManageCustomers = false,
}: InvoiceMakerCanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [showExtraSenderFields, setShowExtraSenderFields] = useState(false);
  
  // Toggles for Tax, Discount, Shipping in the summary section
  const [showTaxInput, setShowTaxInput] = useState(() => Number(form.getValues("taxRate")) > 0);
  const [showDiscountInput, setShowDiscountInput] = useState(() => Number(form.getValues("discount")) > 0);
  const [showShippingInput, setShowShippingInput] = useState(() => Number(form.getValues("shipping") || 0) > 0);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const { formatCurrency, subtotal, tax, discountAmount, shipping, total, balanceDue } = useMemo(
    () => getTemplateUtils(data),
    [data]
  );

  const logoUrl = form.watch("logoUrl");
  const currentTerms = form.watch("terms") || "Due on receipt";
  const currentIssueDate = form.watch("issueDate");
  const currentDueDate = form.watch("dueDate");
  const currentCurrency = form.watch("currency") || "USD";
  const signature = form.watch("signature");

  // Handle Logo Upload
  const processLogoFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, or WEBP)");
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      toast.error("Logo must be 2MB or smaller");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("logoUrl", reader.result as string, { shouldDirty: true, shouldValidate: true });
      toast.success("Logo uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processLogoFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processLogoFile(file);
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    form.setValue("logoUrl", "", { shouldDirty: true, shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle Terms Change -> sync Due Date automatically
  const handleTermsChange = (newTerms: string) => {
    form.setValue("terms", newTerms, { shouldDirty: true });
    if (newTerms !== "Custom Date") {
      const calculated = calculateDueDateByTerms(currentIssueDate, newTerms);
      form.setValue("dueDate", calculated, { shouldDirty: true, shouldValidate: true });
    }
  };

  // Handle Issue Date Change -> sync Due Date based on current terms
  const handleIssueDateChange = (newIssueDate: string) => {
    form.setValue("issueDate", newIssueDate, { shouldDirty: true });
    if (currentTerms !== "Custom Date") {
      const calculated = calculateDueDateByTerms(newIssueDate, currentTerms);
      form.setValue("dueDate", calculated, { shouldDirty: true, shouldValidate: true });
    }
  };

  // Add line item
  const handleAddLine = () => {
    append({
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
    });
  };

  return (
    <div className="w-full max-w-[880px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.06)] p-5 sm:p-10 transition-all font-sans text-slate-800">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleLogoChange}
        className="hidden"
      />

      {/* TOP SECTION: Logo on Left, Metadata (Number, Date, Terms, Currency) on Right */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6">
        {/* Top-Left: Logo Upload Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "w-full sm:w-[260px] min-h-[130px] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer relative group overflow-hidden select-none",
            isDragOver
              ? "border-blue-500 bg-blue-50/50"
              : logoUrl
              ? "border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-xs"
              : "border-slate-200/90 bg-slate-50/40 hover:bg-blue-50/30 hover:border-blue-400"
          )}
        >
          {logoUrl ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={logoUrl}
                alt="Business Logo"
                className="max-h-24 max-w-full object-contain"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                <span className="text-white text-xs font-semibold px-2 py-1 bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm">
                  Change
                </span>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                  title="Remove Logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Add Logo</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Click to upload or drag and drop
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                • PNG or JPG (max 2MB)
              </p>
            </div>
          )}
        </div>

        {/* Top-Right: Number, Date, Terms, Currency Stack */}
        <div className="w-full md:w-auto space-y-2.5 shrink-0 self-stretch md:self-auto flex flex-col items-end">
          {/* Invoice Number */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-600 min-w-[70px] text-left sm:text-right">
              Number
            </label>
            <Input
              value={form.watch("invoiceNumber") || ""}
              onChange={(e) => form.setValue("invoiceNumber", e.target.value, { shouldDirty: true })}
              placeholder="0001"
              className="w-48 sm:w-56 h-9 text-sm font-medium text-slate-800 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg"
            />
          </div>

          {/* Issue Date */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-600 min-w-[70px] text-left sm:text-right">
              Date
            </label>
            <div className="relative w-48 sm:w-56">
              <Input
                type="date"
                value={currentIssueDate}
                onChange={(e) => handleIssueDateChange(e.target.value)}
                className="w-full h-9 text-sm text-slate-800 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg pr-8"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-600 min-w-[70px] text-left sm:text-right">
              Terms
            </label>
            <div className="w-48 sm:w-56">
              <Select value={currentTerms} onValueChange={handleTermsChange}>
                <SelectTrigger className="h-9 text-sm text-slate-800 border-slate-200 bg-white rounded-lg">
                  <SelectValue placeholder="Due on receipt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Due on receipt" className="text-sm">Due on receipt</SelectItem>
                  <SelectItem value="Net 7" className="text-sm">Net 7 (7 days)</SelectItem>
                  <SelectItem value="Net 15" className="text-sm">Net 15 (15 days)</SelectItem>
                  <SelectItem value="Net 30" className="text-sm">Net 30 (30 days)</SelectItem>
                  <SelectItem value="Net 60" className="text-sm">Net 60 (60 days)</SelectItem>
                  <SelectItem value="Custom Date" className="text-sm">Due upon date...</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional Custom Due Date row if Terms is Custom Date */}
          {currentTerms === "Custom Date" && (
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <label className="text-sm font-medium text-slate-600 min-w-[70px] text-left sm:text-right">
                Due Date
              </label>
              <Input
                type="date"
                value={currentDueDate}
                onChange={(e) => form.setValue("dueDate", e.target.value, { shouldDirty: true, shouldValidate: true })}
                className="w-48 sm:w-56 h-9 text-sm text-slate-800 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg"
              />
            </div>
          )}

          {/* Currency Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-600 min-w-[70px] text-left sm:text-right">
              Currency
            </label>
            <div className="w-48 sm:w-56">
              <Select
                value={currentCurrency}
                onValueChange={(val) => form.setValue("currency", val, { shouldDirty: true })}
              >
                <SelectTrigger className="h-9 text-sm text-slate-800 border-slate-200 bg-white rounded-lg">
                  <SelectValue placeholder="USD — US dollar" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="text-sm">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 my-5 sm:my-7" />

      {/* SENDER (From) & RECIPIENT (Bill To) SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800">From</label>
            <button
              type="button"
              onClick={() => setShowExtraSenderFields(!showExtraSenderFields)}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showExtraSenderFields ? "Hide extra fields" : "+ Tax ID / Phone"}
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100/70 transition-all space-y-2 min-h-[110px]">
            <input
              value={form.watch("businessName") || ""}
              onChange={(e) => form.setValue("businessName", e.target.value, { shouldDirty: true })}
              placeholder="Your business name / sender"
              className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none bg-transparent border-0 p-0 focus:ring-0"
            />
            <Textarea
              rows={2}
              value={form.watch("businessAddress") || ""}
              onChange={(e) => form.setValue("businessAddress", e.target.value, { shouldDirty: true })}
              placeholder="Your business address, email, or contact details"
              className="w-full text-xs text-slate-600 placeholder:text-slate-400 outline-none bg-transparent border-0 p-0 focus-visible:ring-0 resize-none min-h-[44px] shadow-none"
            />

            {/* Expandable discrete fields */}
            {showExtraSenderFields && (
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400">Email</label>
                  <input
                    type="email"
                    value={form.watch("businessEmail") || ""}
                    onChange={(e) => form.setValue("businessEmail", e.target.value, { shouldDirty: true })}
                    placeholder="email@company.com"
                    className="w-full text-xs text-slate-700 outline-none border-b border-slate-200 py-0.5 bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400">Tax / VAT ID</label>
                  <input
                    value={form.watch("taxId") || ""}
                    onChange={(e) => form.setValue("taxId", e.target.value, { shouldDirty: true })}
                    placeholder="e.g. US12345678"
                    className="w-full text-xs text-slate-700 outline-none border-b border-slate-200 py-0.5 bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400">Phone</label>
                  <input
                    value={form.watch("phone") || ""}
                    onChange={(e) => form.setValue("phone", e.target.value, { shouldDirty: true })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs text-slate-700 outline-none border-b border-slate-200 py-0.5 bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400">Website</label>
                  <input
                    value={form.watch("website") || ""}
                    onChange={(e) => form.setValue("website", e.target.value, { shouldDirty: true })}
                    placeholder="https://..."
                    className="w-full text-xs text-slate-700 outline-none border-b border-slate-200 py-0.5 bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bill To Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800">Bill to</label>
            {customers.length > 0 && (
              <Select
                onValueChange={(custId) => {
                  const c = customers.find((item) => item._id === custId);
                  if (c) {
                    form.setValue("clientName", c.name, { shouldDirty: true });
                    form.setValue("clientEmail", c.email || "", { shouldDirty: true });
                    form.setValue("clientAddress", c.address || "", { shouldDirty: true });
                  }
                }}
              >
                <SelectTrigger className="h-6 text-[11px] border-0 text-blue-600 hover:text-blue-700 p-0 shadow-none bg-transparent">
                  <span>Saved clients</span>
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c._id} value={c._id} className="text-xs">
                      {c.name} {c.email ? `(${c.email})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100/70 transition-all space-y-2 min-h-[110px]">
            <input
              value={form.watch("clientName") || ""}
              onChange={(e) => form.setValue("clientName", e.target.value, { shouldDirty: true })}
              placeholder="Client details / Client Name"
              className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none bg-transparent border-0 p-0 focus:ring-0"
            />
            <Textarea
              rows={2}
              value={form.watch("clientAddress") || ""}
              onChange={(e) => form.setValue("clientAddress", e.target.value, { shouldDirty: true })}
              placeholder="Client address, city, state, postal code"
              className="w-full text-xs text-slate-600 placeholder:text-slate-400 outline-none bg-transparent border-0 p-0 focus-visible:ring-0 resize-none min-h-[44px] shadow-none"
            />
            <div className="pt-1">
              <input
                type="email"
                value={form.watch("clientEmail") || ""}
                onChange={(e) => form.setValue("clientEmail", e.target.value, { shouldDirty: true })}
                placeholder="Client email (for sending invoice)"
                className="w-full text-xs text-slate-600 placeholder:text-slate-400 outline-none bg-transparent border-0 p-0 focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 my-6 sm:my-8" />

      {/* LINE ITEMS TABLE */}
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 sm:gap-3 text-sm font-semibold text-slate-700 px-1">
          <div className="col-span-6 sm:col-span-6">Description</div>
          <div className="col-span-2 sm:col-span-2 text-right">Price</div>
          <div className="col-span-2 sm:col-span-2 text-center">Qty</div>
          <div className="col-span-2 sm:col-span-2 text-right pr-2">Amount</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {fields.map((field, index) => {
            const currentItem = form.watch(`lineItems.${index}`);
            const itemQty = Number(currentItem?.quantity ?? 1);
            const itemPrice = Number(currentItem?.unitPrice ?? 0);
            const rowTotal = itemQty * itemPrice;

            return (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 sm:gap-3 items-center group relative"
              >
                {/* Description */}
                <div className="col-span-6 sm:col-span-6">
                  <Input
                    value={form.watch(`lineItems.${index}.description`) || ""}
                    onChange={(e) =>
                      form.setValue(`lineItems.${index}.description`, e.target.value, { shouldDirty: true })
                    }
                    placeholder="What was provided"
                    className="h-9 text-sm text-slate-800 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg"
                  />
                </div>

                {/* Price */}
                <div className="col-span-2 sm:col-span-2">
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    value={form.watch(`lineItems.${index}.unitPrice`) ?? 0}
                    onChange={(e) =>
                      form.setValue(`lineItems.${index}.unitPrice`, parseFloat(e.target.value) || 0, {
                        shouldDirty: true,
                      })
                    }
                    placeholder="0.00"
                    className="h-9 text-sm text-slate-800 text-right border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg px-2"
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-2 sm:col-span-2">
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    value={form.watch(`lineItems.${index}.quantity`) ?? 1}
                    onChange={(e) =>
                      form.setValue(`lineItems.${index}.quantity`, parseFloat(e.target.value) || 0, {
                        shouldDirty: true,
                      })
                    }
                    placeholder="1"
                    className="h-9 text-sm text-slate-800 text-center border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg px-1"
                  />
                </div>

                {/* Amount & Delete */}
                <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-1.5">
                  <span className="text-sm font-semibold text-slate-900 font-mono text-right truncate">
                    {formatCurrency(rowTotal)}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 sm:opacity-0 focus:opacity-100"
                      title="Delete line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* + Add line Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAddLine}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-blue-200 bg-white hover:bg-blue-50/70 text-blue-600 font-semibold text-xs sm:text-sm rounded-lg transition-all shadow-2xs cursor-pointer hover:border-blue-300"
          >
            <Plus className="w-4 h-4" />
            <span>Add line</span>
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 my-6 sm:my-8" />

      {/* BOTTOM SECTION: Notes on Left, Calculation Summary on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Notes & Optional Signature */}
        <div className="md:col-span-6 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Notes
            </label>
            <Textarea
              rows={4}
              value={form.watch("notes") || ""}
              onChange={(e) => form.setValue("notes", e.target.value, { shouldDirty: true })}
              placeholder="Payment instructions, terms, thank-you notes."
              className="w-full text-sm text-slate-700 placeholder:text-slate-400 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl p-3 resize-y min-h-[110px]"
            />
          </div>

          {/* Digital Signature Block */}
          <div className="pt-1">
            {signature?.text ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <PenTool className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs text-slate-500">Signed by:</span>
                  <span className="text-sm font-semibold text-slate-800 font-serif italic">
                    {signature.text}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSignatureDialog(true)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => form.setValue("signature", undefined, { shouldDirty: true })}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSignatureDialog(true)}
                className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>+ Add digital signature</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Financial Calculation Summary */}
        <div className="md:col-span-6 flex flex-col justify-end space-y-2.5 pt-1">
          {/* Subtotal */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 font-medium">Subtotal</span>
            <span className="font-semibold text-slate-900 font-mono">{formatCurrency(subtotal)}</span>
          </div>

          {/* Action Links: + Tax, + Discount, + Shipping */}
          <div className="flex items-center justify-end gap-3 text-xs font-medium text-blue-600 pt-0.5">
            {!showTaxInput && (
              <button
                type="button"
                onClick={() => setShowTaxInput(true)}
                className="hover:text-blue-700 transition-colors cursor-pointer"
              >
                + Tax
              </button>
            )}
            {!showDiscountInput && (
              <button
                type="button"
                onClick={() => setShowDiscountInput(true)}
                className="hover:text-blue-700 transition-colors cursor-pointer"
              >
                + Discount
              </button>
            )}
            {!showShippingInput && (
              <button
                type="button"
                onClick={() => setShowShippingInput(true)}
                className="hover:text-blue-700 transition-colors cursor-pointer"
              >
                + Shipping
              </button>
            )}
          </div>

          {/* Tax Input Row */}
          {showTaxInput && (
            <div className="flex justify-between items-center gap-2 text-sm bg-slate-50/70 p-1.5 rounded-lg border border-slate-200/60">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 text-xs font-medium">Tax</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={form.watch("taxRate") ?? 0}
                    onChange={(e) =>
                      form.setValue("taxRate", parseFloat(e.target.value) || 0, { shouldDirty: true })
                    }
                    className="h-7 w-16 text-xs px-1.5 text-center bg-white border-slate-200"
                  />
                  <span className="text-xs text-slate-500">%</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-800 font-mono text-xs">
                  {formatCurrency(tax)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("taxRate", 0, { shouldDirty: true });
                    setShowTaxInput(false);
                  }}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Discount Input Row */}
          {showDiscountInput && (
            <div className="flex justify-between items-center gap-2 text-sm bg-slate-50/70 p-1.5 rounded-lg border border-slate-200/60">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 text-xs font-medium">Discount</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={form.watch("discount") ?? 0}
                    onChange={(e) =>
                      form.setValue("discount", parseFloat(e.target.value) || 0, { shouldDirty: true })
                    }
                    className="h-7 w-16 text-xs px-1.5 text-center bg-white border-slate-200"
                  />
                  <span className="text-xs text-slate-500">%</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-800 font-mono text-xs">
                  -{formatCurrency(discountAmount)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("discount", 0, { shouldDirty: true });
                    setShowDiscountInput(false);
                  }}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Shipping Input Row */}
          {showShippingInput && (
            <div className="flex justify-between items-center gap-2 text-sm bg-slate-50/70 p-1.5 rounded-lg border border-slate-200/60">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 text-xs font-medium">Shipping</span>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={form.watch("shipping") ?? 0}
                  onChange={(e) =>
                    form.setValue("shipping", parseFloat(e.target.value) || 0, { shouldDirty: true })
                  }
                  className="h-7 w-20 text-xs px-1.5 text-right bg-white border-slate-200"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-800 font-mono text-xs">
                  {formatCurrency(shipping)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("shipping", 0, { shouldDirty: true });
                    setShowShippingInput(false);
                  }}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Invoice Total */}
          <div className="flex justify-between items-center text-sm pt-1">
            <span className="text-slate-600 font-medium">Invoice Total</span>
            <span className="font-semibold text-slate-900 font-mono">{formatCurrency(total)}</span>
          </div>

          {/* Accent Blue Divider Line (matches image!) */}
          <div className="border-b-2 border-blue-500 my-1" />

          {/* Balance Due */}
          <div className="flex justify-between items-center pt-1">
            <span className="font-bold text-slate-900 text-base sm:text-lg">Balance Due</span>
            <span className="font-bold text-blue-600 text-lg sm:text-2xl font-mono">
              {formatCurrency(balanceDue)}
            </span>
          </div>
        </div>
      </div>

      {/* Signature Dialog */}
      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        defaultValues={signature}
        onConfirm={(sig) => {
          form.setValue("signature", sig, { shouldDirty: true });
          setShowSignatureDialog(false);
        }}
      />
    </div>
  );
}
