import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";

interface TemplateProps {
  data: InvoiceData;
}

export function ContractorTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full bg-white flex flex-col font-sans text-foreground">
      <div className="border-t-[16px] border-[#EA580C] px-8 md:px-12 pt-12 pb-8 flex justify-between items-start">
        <div>
          <div className="text-4xl md:text-5xl font-black text-[#EA580C] tracking-tighter mb-4">INVOICE</div>
          <div className="font-bold text-xl">{data.businessName || "Your Name"}</div>
          <div className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">{data.businessAddress}</div>
          <div className="text-muted-foreground text-sm">{data.businessEmail}</div>
          {data.phone && <div className="text-muted-foreground text-xs">{data.phone}</div>}
          {data.website && <div className="text-muted-foreground text-xs">{data.website}</div>}
          {data.taxId && <div className="text-muted-foreground text-xs mt-1">Tax ID: {data.taxId}</div>}
        </div>
        <div className="text-right space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between gap-6">
            <span className="font-bold text-muted-foreground">Invoice #</span>
            <span className="font-bold">{data.invoiceNumber}</span>
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

      <div className="px-8 md:px-12 flex-1 flex flex-col">
        <div className="bg-gray-100 p-6 rounded-lg mb-10 flex justify-between">
          <div>
            <div className="font-black text-[10px] text-gray-500 uppercase tracking-widest mb-1">Billed To</div>
            <div className="font-bold text-lg">{data.clientName || "Client Name"}</div>
            <div className="text-sm mt-1 whitespace-pre-wrap text-gray-600">{data.clientAddress}</div>
          </div>
          <div className="text-right">
            <div className="font-black text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Amount</div>
            <div className="text-3xl font-black text-[#EA580C]">{formatCurrency(total)}</div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex border-b-2 border-gray-200 pb-3 mb-4 font-black text-[10px] uppercase tracking-widest text-gray-500">
            <div className="flex-1">Description of Work</div>
            <div className="w-16 text-right">Hours/Qty</div>
            <div className="w-24 text-right">Rate</div>
            <div className="w-24 text-right">Amount</div>
          </div>
          
          {data.lineItems.length > 0 ? (
            data.lineItems.map((item, i) => (
              <div key={i} className="flex py-4 border-b border-gray-100 text-sm">
                <div className="flex-1 pr-4 font-bold">{item.description}</div>
                <div className="w-16 text-right text-gray-500">{item.quantity}</div>
                <div className="w-24 text-right text-gray-500">{formatCurrency(item.unitPrice)}</div>
                <div className="w-24 text-right font-black">{formatCurrency(item.quantity * item.unitPrice)}</div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm italic">No items added yet</div>
          )}
          
          <div className="mt-8 flex justify-end">
            <div className="w-64 space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span className="font-bold">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {data.taxRate > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span className="font-bold">Tax ({data.taxRate}%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}
              {data.discount > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span className="font-bold">Discount ({data.discount}%)</span>
                  <span className="text-[#EA580C] border-b border-[#EA580C]/20 border-dashed">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-xl pt-4 mt-4 border-t-2 border-gray-200">
                <span>Total</span>
                <span className="text-[#EA580C]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {data.notes && (
          <div className="mt-12 bg-[#EA580C]/5 p-6 rounded-lg text-sm border border-[#EA580C]/10">
            <div className="font-black text-[10px] text-[#EA580C] uppercase tracking-widest mb-2">Notes</div>
            <div className="text-gray-700 whitespace-pre-wrap">{data.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
