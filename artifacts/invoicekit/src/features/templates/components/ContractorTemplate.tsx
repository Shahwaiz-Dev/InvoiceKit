import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";
import { SignatureBlock } from "./SignatureBlock";

interface TemplateProps {
  data: InvoiceData;
}

export function ContractorTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full min-h-full bg-white flex flex-col font-sans text-foreground box-border">
      <div className="border-t-[12px] border-[#EA580C] p-10 pb-6 flex justify-between items-start">
        <div>
          {data.logoUrl && (
            <img src={data.logoUrl} alt="Logo" className="max-h-12 max-w-[160px] object-contain mb-3" />
          )}
          <div className="text-3xl font-black text-[#EA580C] tracking-tighter mb-2">INVOICE</div>
          <div className="font-bold text-lg">{data.businessName || "Your Name"}</div>
          <div className="text-muted-foreground mt-0.5 text-xs whitespace-pre-wrap">{data.businessAddress}</div>
          <div className="text-muted-foreground text-xs">{data.businessEmail}</div>
          {data.phone && <div className="text-muted-foreground text-[10px]">{data.phone}</div>}
          {data.website && <div className="text-muted-foreground text-[10px]">{data.website}</div>}
          {data.taxId && <div className="text-muted-foreground text-[10px] mt-0.5">Tax ID: {data.taxId}</div>}
        </div>
        <div className="text-right space-y-1.5 text-xs bg-gray-50 p-4 rounded-lg border border-gray-200/60">
          <div className="flex justify-between gap-6">
            <span className="font-bold text-muted-foreground">Invoice #</span>
            <span className="font-bold">{data.invoiceNumber || "INV-001"}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="font-bold text-muted-foreground">Date</span>
            <span>{data.issueDate || "-"}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="font-bold text-muted-foreground">Due</span>
            <span>{data.dueDate || "-"}</span>
          </div>
        </div>
      </div>

      <div className="px-10 pb-10 flex-1 flex flex-col">
        <div className="bg-gray-100/80 p-5 rounded-lg mb-8 flex justify-between items-center">
          <div>
            <div className="font-black text-[10px] text-gray-500 uppercase tracking-widest mb-1">Billed To</div>
            <div className="font-bold text-base">{data.clientName || "Client Name"}</div>
            <div className="text-xs mt-0.5 whitespace-pre-wrap text-gray-600">{data.clientAddress}</div>
            {data.clientEmail && <div className="text-xs text-gray-500">{data.clientEmail}</div>}
          </div>
          <div className="text-right">
            <div className="font-black text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Amount</div>
            <div className="text-2xl font-black text-[#EA580C]">{formatCurrency(total)}</div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex border-b-2 border-gray-200 pb-3 mb-2 font-black text-[10px] uppercase tracking-widest text-gray-500">
            <div className="flex-1">Description of Work</div>
            <div className="w-20 text-right">Hours/Qty</div>
            <div className="w-28 text-right">Rate</div>
            <div className="w-28 text-right">Amount</div>
          </div>
          
          {data.lineItems && data.lineItems.length > 0 ? (
            data.lineItems.map((item, i) => (
              <div key={item.id || i} className="flex py-3 border-b border-gray-100 text-sm items-start">
                <div className="flex-1 pr-4 font-bold text-slate-800 break-words whitespace-pre-wrap">{item.description || "—"}</div>
                <div className="w-20 text-right text-gray-500">{item.quantity ?? 0}</div>
                <div className="w-28 text-right text-gray-500">{formatCurrency(item.unitPrice || 0)}</div>
                <div className="w-28 text-right font-black text-slate-900">{formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}</div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm italic">No items added yet</div>
          )}
          
          <div className="mt-8 flex justify-end">
            <div className="w-72 space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span className="font-bold">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {Number(data.taxRate) > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span className="font-bold">Tax ({data.taxRate}%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}
              {Number(data.discount) > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span className="font-bold">Discount ({data.discount}%)</span>
                  <span className="text-[#EA580C] border-b border-[#EA580C]/20 border-dashed">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-lg pt-3 mt-2 border-t-2 border-gray-200">
                <span>Total</span>
                <span className="text-[#EA580C]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-between items-end">
          <div className="flex-1 mr-8">
            {data.notes && (
              <div className="bg-[#EA580C]/5 p-5 rounded-lg text-sm border border-[#EA580C]/10">
                <div className="font-black text-[10px] text-[#EA580C] uppercase tracking-widest mb-1.5">Notes</div>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-xs">{data.notes}</div>
              </div>
            )}
          </div>
          <SignatureBlock signature={data.signature} />
        </div>
      </div>
    </div>
  );
}
