import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";
import { SignatureBlock } from "./SignatureBlock";

interface TemplateProps {
  data: InvoiceData;
}

export function MinimalTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full min-h-full bg-white p-10 flex flex-col font-serif text-foreground box-border">
      <div className="flex justify-between items-start mb-10">
        <div>
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="max-h-14 max-w-[160px] object-contain mb-3" />
          ) : null}
        </div>
        <div className="text-right">
          <div className="text-2xl font-medium mb-1">Invoice {data.invoiceNumber || "INV-001"}</div>
          <div className="text-muted-foreground font-sans text-xs">{data.issueDate || "Date not set"}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
          <div className="text-muted-foreground font-sans text-[10px] uppercase tracking-widest mb-2 font-semibold">From</div>
          <div className="font-medium text-base mb-1">{data.businessName || "Your Name"}</div>
          <div className="font-sans text-xs text-muted-foreground whitespace-pre-wrap">{data.businessAddress}</div>
          <div className="font-sans text-xs text-muted-foreground mt-0.5">{data.businessEmail}</div>
          {data.phone && <div className="font-sans text-xs text-muted-foreground mt-0.5">{data.phone}</div>}
          {data.website && <div className="font-sans text-xs text-muted-foreground mt-0.5">{data.website}</div>}
          {data.taxId && <div className="font-sans text-xs text-muted-foreground mt-0.5">Tax ID: {data.taxId}</div>}
        </div>
        <div>
          <div className="text-muted-foreground font-sans text-[10px] uppercase tracking-widest mb-2 font-semibold">To</div>
          <div className="font-medium text-base mb-1">{data.clientName || "Client Name"}</div>
          <div className="font-sans text-xs text-muted-foreground whitespace-pre-wrap">{data.clientAddress}</div>
          <div className="font-sans text-xs text-muted-foreground mt-0.5">{data.clientEmail}</div>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex border-b border-border pb-3 mb-4 font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          <div className="flex-1">Services</div>
          <div className="w-20 text-right">Qty</div>
          <div className="w-28 text-right">Rate</div>
          <div className="w-28 text-right">Amount</div>
        </div>
        
        {data.lineItems && data.lineItems.length > 0 ? (
          data.lineItems.map((item, i) => (
            <div key={item.id || i} className="flex py-3 font-sans text-xs items-start border-b border-border/30">
              <div className="flex-1 pr-4 font-serif text-sm break-words whitespace-pre-wrap">{item.description || "—"}</div>
              <div className="w-20 text-right text-muted-foreground">{item.quantity ?? 0}</div>
              <div className="w-28 text-right text-muted-foreground">{formatCurrency(item.unitPrice || 0)}</div>
              <div className="w-28 text-right font-medium text-foreground">{formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}</div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground font-sans text-xs italic">No items</div>
        )}
        
        <div className="mt-8 flex justify-end border-t border-border pt-6">
          <div className="w-64 space-y-2.5 font-sans text-xs">
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
            <div className="flex justify-between font-serif text-xl pt-3 mt-2 border-t border-border/60">
              <span>Total</span>
              <span className="font-medium">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-end pt-6 border-t border-border">
        <div className="flex-1 mr-8">
          {data.notes && (
            <div>
              <div className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-semibold">Notes</div>
              <div className="font-sans text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-w-2xl">{data.notes}</div>
            </div>
          )}
        </div>
        <SignatureBlock signature={data.signature} />
      </div>
    </div>
  );
}
