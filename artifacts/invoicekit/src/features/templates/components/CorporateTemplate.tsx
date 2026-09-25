import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";
import { SignatureBlock } from "./SignatureBlock";

interface TemplateProps {
  data: InvoiceData;
}

export function CorporateTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full min-h-full bg-white flex flex-col font-sans text-foreground box-border">
      <div className="bg-secondary text-white p-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="max-h-16 max-w-[180px] object-contain bg-white/10 p-2 rounded" />
          ) : null}
          <div>
            <div className="font-bold text-xl">{data.businessName || "Your Business Name"}</div>
            <div className="text-white/80 text-sm">{data.businessEmail}</div>
            {data.phone && <div className="text-white/80 text-xs">{data.phone}</div>}
            {data.website && <div className="text-white/80 text-xs">{data.website}</div>}
            {data.taxId && <div className="text-white/80 text-xs mt-1">Tax ID: {data.taxId}</div>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-light uppercase tracking-widest mb-1">Invoice</div>
          <div className="text-white/80 font-medium tracking-widest text-sm">{data.invoiceNumber || "INV-001"}</div>
        </div>
      </div>

      <div className="p-10 flex-1 flex flex-col">
        <div className="flex justify-between mb-10">
          <div>
            <div className="font-bold text-secondary text-xs uppercase tracking-widest mb-2">Bill To</div>
            <div className="font-bold text-base mb-1">{data.clientName || "Client Name"}</div>
            <div className="text-muted-foreground text-sm whitespace-pre-wrap">{data.clientAddress}</div>
            <div className="text-muted-foreground text-sm">{data.clientEmail}</div>
          </div>
          <div className="text-right space-y-2 text-sm">
            <div className="flex justify-between gap-8">
              <span className="font-bold text-secondary text-xs uppercase tracking-widest">Issue Date</span>
              <span className="text-muted-foreground">{data.issueDate || "-"}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="font-bold text-secondary text-xs uppercase tracking-widest">Due Date</span>
              <span className="text-muted-foreground">{data.dueDate || "-"}</span>
            </div>
            <div className="flex justify-between gap-8 pt-3 mt-3 border-t border-border">
              <span className="font-bold text-secondary text-xs uppercase tracking-widest">Amount Due</span>
              <span className="font-bold text-xl text-secondary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex bg-muted/10 py-3 px-4 mb-2 font-bold text-xs uppercase tracking-widest text-secondary rounded">
            <div className="flex-1">Description</div>
            <div className="w-20 text-right">Qty</div>
            <div className="w-28 text-right">Price</div>
            <div className="w-28 text-right">Total</div>
          </div>
          
          {data.lineItems && data.lineItems.length > 0 ? (
            data.lineItems.map((item, i) => (
              <div key={item.id || i} className="flex py-3.5 px-4 border-b border-border text-sm items-start">
                <div className="flex-1 pr-4 font-medium break-words whitespace-pre-wrap">{item.description || "—"}</div>
                <div className="w-20 text-right text-muted-foreground">{item.quantity ?? 0}</div>
                <div className="w-28 text-right text-muted-foreground">{formatCurrency(item.unitPrice || 0)}</div>
                <div className="w-28 text-right font-medium">{formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}</div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm italic">No line items added yet</div>
          )}
          
          <div className="mt-8 flex justify-end px-4">
            <div className="w-72 space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              {Number(data.taxRate) > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax ({data.taxRate}%)</span>
                  <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
                </div>
              )}
              {Number(data.discount) > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount ({data.discount}%)</span>
                  <span className="font-medium text-foreground">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base bg-secondary text-white p-3.5 rounded-lg mt-3">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-end">
          <div className="flex-1 mr-8 text-sm">
            {data.notes && (
              <>
                <div className="font-bold text-secondary text-xs uppercase tracking-widest mb-2">Terms & Conditions</div>
                <div className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">{data.notes}</div>
              </>
            )}
          </div>
          <SignatureBlock signature={data.signature} />
        </div>
      </div>
    </div>
  );
}
