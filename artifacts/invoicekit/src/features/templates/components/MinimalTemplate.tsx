import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";

interface TemplateProps {
  data: InvoiceData;
}

export function MinimalTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full bg-white p-12 md:p-16 flex flex-col font-serif text-foreground">
      <div className="text-right mb-16">
        <div className="text-2xl font-medium mb-2">Invoice {data.invoiceNumber}</div>
        <div className="text-muted-foreground font-sans text-sm">{data.issueDate || "Date not set"}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-16 mb-16">
        <div>
          <div className="text-muted-foreground font-sans text-xs uppercase tracking-widest mb-4">From</div>
          <div className="font-medium text-lg mb-1">{data.businessName || "Your Name"}</div>
          <div className="font-sans text-sm text-muted-foreground whitespace-pre-wrap">{data.businessAddress}</div>
          <div className="font-sans text-sm text-muted-foreground mt-1">{data.businessEmail}</div>
          {data.phone && <div className="font-sans text-xs text-muted-foreground mt-1">{data.phone}</div>}
          {data.website && <div className="font-sans text-xs text-muted-foreground mt-1">{data.website}</div>}
          {data.taxId && <div className="font-sans text-xs text-muted-foreground mt-1">Tax ID: {data.taxId}</div>}
        </div>
        <div>
          <div className="text-muted-foreground font-sans text-xs uppercase tracking-widest mb-4">To</div>
          <div className="font-medium text-lg mb-1">{data.clientName || "Client Name"}</div>
          <div className="font-sans text-sm text-muted-foreground whitespace-pre-wrap">{data.clientAddress}</div>
          <div className="font-sans text-sm text-muted-foreground mt-1">{data.clientEmail}</div>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex border-b border-border pb-4 mb-6 font-sans text-xs uppercase tracking-widest text-muted-foreground">
          <div className="flex-1">Services</div>
          <div className="w-16 text-right">Qty</div>
          <div className="w-24 text-right">Rate</div>
          <div className="w-24 text-right">Amount</div>
        </div>
        
        {data.lineItems.length > 0 ? (
          data.lineItems.map((item, i) => (
            <div key={i} className="flex py-3 font-sans text-sm items-center">
              <div className="flex-1 pr-4 font-serif text-base">{item.description}</div>
              <div className="w-16 text-right text-muted-foreground">{item.quantity}</div>
              <div className="w-24 text-right text-muted-foreground">{formatCurrency(item.unitPrice)}</div>
              <div className="w-24 text-right">{formatCurrency(item.quantity * item.unitPrice)}</div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground font-sans text-sm italic">No items</div>
        )}
        
        <div className="mt-12 flex justify-end border-t border-border pt-8">
          <div className="w-64 space-y-4 font-sans text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Tax ({data.taxRate}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            )}
            {data.discount > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Discount ({data.discount}%)</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-serif text-2xl pt-4 mt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-16 pt-8 border-t border-border">
          <div className="font-sans text-xs text-muted-foreground uppercase tracking-widest mb-4">Notes</div>
          <div className="font-sans text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-w-2xl">{data.notes}</div>
        </div>
      )}
    </div>
  );
}
