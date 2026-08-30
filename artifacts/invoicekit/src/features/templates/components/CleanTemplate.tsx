import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";
import { SignatureBlock } from "./SignatureBlock";

interface TemplateProps {
  data: InvoiceData;
}

export function CleanTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full min-h-full bg-white p-10 flex flex-col font-sans text-foreground box-border">
      <div className="flex justify-between items-start mb-10">
        <div>
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="max-h-16 max-w-[200px] object-contain mb-4" />
          ) : null}
          <div className="font-bold text-lg mb-1">{data.businessName || "Your Business Name"}</div>
          <div className="text-muted-foreground text-sm whitespace-pre-wrap">{data.businessAddress}</div>
          <div className="text-muted-foreground text-sm">{data.businessEmail}</div>
          {data.phone && <div className="text-muted-foreground text-sm">{data.phone}</div>}
          {data.website && <div className="text-muted-foreground text-sm">{data.website}</div>}
          {data.taxId && <div className="text-muted-foreground text-sm mt-1">Tax ID: {data.taxId}</div>}
        </div>
        <div className="text-right">
          <div className="text-3xl font-serif text-primary mb-2 font-normal">INVOICE</div>
          <div className="text-muted-foreground font-medium">{data.invoiceNumber || "INV-001"}</div>
          {data.issueDate && <div className="text-sm mt-2 text-muted-foreground">Issued: {data.issueDate}</div>}
          {data.dueDate && <div className="text-sm text-muted-foreground">Due: {data.dueDate}</div>}
        </div>
      </div>
      
      <div className="flex justify-between mb-10 border-t border-border pt-6">
        <div>
          <div className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Bill To:</div>
          <div className="font-bold text-base mb-1">{data.clientName || "Client Name"}</div>
          <div className="text-muted-foreground text-sm whitespace-pre-wrap">{data.clientAddress}</div>
          <div className="text-muted-foreground text-sm">{data.clientEmail}</div>
        </div>
        <div className="text-right bg-muted/5 p-4 rounded-lg border border-border/50 self-start">
          <div className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Due:</div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(total)}</div>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex border-b-2 border-border pb-3 mb-2 font-bold text-xs uppercase tracking-wider text-muted-foreground">
          <div className="flex-1">Item Description</div>
          <div className="w-20 text-right">Qty</div>
          <div className="w-28 text-right">Price</div>
          <div className="w-28 text-right">Total</div>
        </div>
        
        {data.lineItems && data.lineItems.length > 0 ? (
          data.lineItems.map((item, i) => (
            <div key={item.id || i} className="flex py-3 border-b border-border text-sm items-start">
              <div className="flex-1 pr-4 break-words whitespace-pre-wrap">{item.description || "—"}</div>
              <div className="w-20 text-right text-muted-foreground">{item.quantity ?? 0}</div>
              <div className="w-28 text-right text-muted-foreground">{formatCurrency(item.unitPrice || 0)}</div>
              <div className="w-28 text-right font-medium">{formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}</div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm italic">No line items added yet</div>
        )}
        
        <div className="mt-8 flex justify-end">
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
            <div className="flex justify-between font-bold text-lg border-t border-border pt-3 mt-2">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mt-10 pt-6 border-t border-border">
        <div className="flex-1 mr-8">
          {data.notes && (
            <>
              <div className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Notes / Terms</div>
              <div className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">{data.notes}</div>
            </>
          )}
        </div>
        <SignatureBlock signature={data.signature} />
      </div>
    </div>
  );
}
