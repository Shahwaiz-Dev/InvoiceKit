import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";

interface TemplateProps {
  data: InvoiceData;
}

export function CleanTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full bg-white p-8 md:p-12 flex flex-col font-sans text-foreground">
      <div className="flex justify-between items-start mb-12">
        <div>
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="max-h-16 object-contain mb-4" />
          ) : (
            <div className="w-16 h-16 bg-muted/20 rounded-sm mb-4"></div>
          )}
          <div className="font-bold text-lg mb-1">{data.businessName || "Your Business Name"}</div>
          <div className="text-muted-foreground text-sm whitespace-pre-wrap">{data.businessAddress}</div>
          <div className="text-muted-foreground text-sm">{data.businessEmail}</div>
          {data.phone && <div className="text-muted-foreground text-sm">{data.phone}</div>}
          {data.website && <div className="text-muted-foreground text-sm">{data.website}</div>}
          {data.taxId && <div className="text-muted-foreground text-sm mt-1">Tax ID: {data.taxId}</div>}
        </div>
        <div className="text-right">
          <div className="text-3xl font-serif text-primary mb-2">INVOICE</div>
          <div className="text-muted-foreground font-medium">{data.invoiceNumber}</div>
          {data.issueDate && <div className="text-sm mt-2 text-muted-foreground">Issued: {data.issueDate}</div>}
          {data.dueDate && <div className="text-sm text-muted-foreground">Due: {data.dueDate}</div>}
        </div>
      </div>
      
      <div className="flex justify-between mb-12 border-t border-border pt-8">
        <div>
          <div className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Bill To:</div>
          <div className="font-bold text-lg mb-1">{data.clientName || "Client Name"}</div>
          <div className="text-muted-foreground text-sm whitespace-pre-wrap">{data.clientAddress}</div>
          <div className="text-muted-foreground text-sm">{data.clientEmail}</div>
        </div>
        <div className="text-right bg-muted/5 p-4 rounded-lg">
          <div className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Total Due:</div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(total)}</div>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex border-b-2 border-border pb-3 mb-4 font-bold text-sm uppercase tracking-wider text-muted-foreground">
          <div className="flex-1">Item Description</div>
          <div className="w-16 text-right">Qty</div>
          <div className="w-24 text-right">Price</div>
          <div className="w-24 text-right">Total</div>
        </div>
        
        {data.lineItems.length > 0 ? (
          data.lineItems.map((item, i) => (
            <div key={i} className="flex py-3 border-b border-border text-sm">
              <div className="flex-1 pr-4">{item.description}</div>
              <div className="w-16 text-right text-muted-foreground">{item.quantity}</div>
              <div className="w-24 text-right text-muted-foreground">{formatCurrency(item.unitPrice)}</div>
              <div className="w-24 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm italic">No line items added yet</div>
        )}
        
        <div className="mt-8 flex justify-end">
          <div className="w-64 space-y-3 text-sm">
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
            <div className="flex justify-between font-bold text-lg border-t border-border pt-3 mt-3">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Notes / Terms</div>
          <div className="text-sm whitespace-pre-wrap">{data.notes}</div>
        </div>
      )}
    </div>
  );
}
