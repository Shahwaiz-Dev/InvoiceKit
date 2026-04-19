import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";

interface TemplateProps {
  data: InvoiceData;
}

export function CorporateTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full bg-white flex flex-col font-sans text-foreground">
      <div className="bg-secondary text-white p-8 md:p-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="max-h-16 object-contain bg-white/10 p-2 rounded" />
          ) : (
            <div className="w-16 h-16 bg-white/20 rounded-sm"></div>
          )}
          <div>
            <div className="font-bold text-xl">{data.businessName || "Your Business Name"}</div>
            <div className="text-white/80 text-sm">{data.businessEmail}</div>
            {data.phone && <div className="text-white/80 text-xs">{data.phone}</div>}
            {data.website && <div className="text-white/80 text-xs">{data.website}</div>}
            {data.taxId && <div className="text-white/80 text-xs mt-1">Tax ID: {data.taxId}</div>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-light uppercase tracking-widest mb-2">Invoice</div>
          <div className="text-white/80 font-medium tracking-widest">{data.invoiceNumber}</div>
        </div>
      </div>

      <div className="p-8 md:p-12 flex-1 flex flex-col">
        <div className="flex justify-between mb-12">
          <div>
            <div className="font-bold text-secondary text-sm uppercase tracking-widest mb-3">Bill To</div>
            <div className="font-bold text-lg mb-1">{data.clientName || "Client Name"}</div>
            <div className="text-muted-foreground text-sm whitespace-pre-wrap">{data.clientAddress}</div>
          </div>
          <div className="text-right space-y-2 text-sm">
            <div className="flex justify-between gap-8">
              <span className="font-bold text-secondary uppercase tracking-widest">Issue Date</span>
              <span className="text-muted-foreground">{data.issueDate || "-"}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="font-bold text-secondary uppercase tracking-widest">Due Date</span>
              <span className="text-muted-foreground">{data.dueDate || "-"}</span>
            </div>
            <div className="flex justify-between gap-8 pt-4 mt-4 border-t border-border">
              <span className="font-bold text-secondary uppercase tracking-widest">Amount Due</span>
              <span className="font-bold text-xl text-secondary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex bg-muted/10 py-3 px-4 mb-2 font-bold text-xs uppercase tracking-widest text-secondary rounded">
            <div className="flex-1">Description</div>
            <div className="w-16 text-right">Qty</div>
            <div className="w-24 text-right">Price</div>
            <div className="w-24 text-right">Total</div>
          </div>
          
          {data.lineItems.length > 0 ? (
            data.lineItems.map((item, i) => (
              <div key={i} className="flex py-4 px-4 border-b border-border text-sm">
                <div className="flex-1 pr-4 font-medium">{item.description}</div>
                <div className="w-16 text-right text-muted-foreground">{item.quantity}</div>
                <div className="w-24 text-right text-muted-foreground">{formatCurrency(item.unitPrice)}</div>
                <div className="w-24 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm italic">No line items added yet</div>
          )}
          
          <div className="mt-8 flex justify-end px-4">
            <div className="w-72 space-y-3 text-sm">
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
              <div className="flex justify-between font-bold text-lg bg-secondary text-white p-4 rounded-lg mt-4">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {data.notes && (
          <div className="mt-12 text-sm">
            <div className="font-bold text-secondary uppercase tracking-widest mb-2">Terms & Conditions</div>
            <div className="text-muted-foreground whitespace-pre-wrap">{data.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
