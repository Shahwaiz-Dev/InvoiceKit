import { TemplateType, InvoiceData } from "@/lib/schema";

interface PreviewProps {
  template: TemplateType;
  data: InvoiceData;
}

export function Preview({ template, data }: PreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency || 'USD',
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return data.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * (data.taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const discountAmount = subtotal * (data.discount / 100);
    return subtotal + tax - discountAmount;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const discountAmount = subtotal * (data.discount / 100);
  const total = calculateTotal();

  if (template === "clean") {
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

  if (template === "corporate") {
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
            <div className="text-right space-y-2">
              <div className="flex justify-between gap-8 text-sm">
                <span className="font-bold text-secondary uppercase tracking-widest">Issue Date</span>
                <span className="text-muted-foreground">{data.issueDate || "-"}</span>
              </div>
              <div className="flex justify-between gap-8 text-sm">
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

  if (template === "contractor") {
    return (
      <div className="w-full h-full bg-white flex flex-col font-sans text-foreground">
        <div className="border-t-[16px] border-[#EA580C] px-8 md:px-12 pt-12 pb-8 flex justify-between items-start">
          <div>
            <div className="text-4xl md:text-5xl font-black text-[#EA580C] tracking-tighter mb-4">INVOICE</div>
            <div className="font-bold text-xl">{data.businessName || "Your Name"}</div>
            <div className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">{data.businessAddress}</div>
            <div className="text-muted-foreground text-sm">{data.businessEmail}</div>
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

  // minimal
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
