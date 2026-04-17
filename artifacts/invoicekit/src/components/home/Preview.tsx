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

  if (template === "salaries") {
    return (
      <div className="w-full h-full bg-white p-8 md:p-12 flex flex-col font-sans text-slate-800">
        <div className="border-b-4 border-slate-800 pb-6 mb-8 flex justify-between items-end">
          <div>
            <div className="text-3xl font-black tracking-tighter mb-1 select-none">PAYSLIP</div>
            <div className="text-sm font-bold text-slate-500">{data.invoiceNumber || "PY-001"}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{data.businessName || "Employer Name"}</div>
            <div className="text-slate-500 text-xs">{data.businessEmail}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10 bg-slate-50 p-6 rounded-lg border border-slate-200">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Employee Information</div>
            <div className="font-bold text-base">{data.clientName || "Employee Name"}</div>
            <div className="text-sm text-slate-600 truncate">{data.clientEmail}</div>
            <div className="text-sm text-slate-600 whitespace-pre-wrap">{data.clientAddress}</div>
          </div>
          <div className="space-y-2 text-sm text-right">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Details</div>
            <div className="flex justify-between gap-4"><span className="text-slate-500">Pay Date:</span> <span className="font-bold">{data.issueDate}</span></div>
            <div className="flex justify-between gap-4"><span className="text-slate-500">Pay Period:</span> <span className="font-bold">{data.issueDate} - {data.dueDate}</span></div>
          </div>
        </div>

        <div className="flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">Earnings Description</th>
                <th className="py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500 w-24">Base</th>
                <th className="py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500 w-24">Qty/Hrs</th>
                <th className="py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500 w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-slate-100 italic">
                  <td className="py-4 font-bold text-sm">{item.description}</td>
                  <td className="py-4 text-right text-sm text-slate-500">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-right text-sm text-slate-500">{item.quantity}</td>
                  <td className="py-4 text-right font-bold text-sm">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 flex justify-end">
            <div className="w-72 bg-slate-900 text-white p-6 rounded-xl shadow-xl">
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Pay</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {data.taxRate > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Tax Withheld ({data.taxRate}%)</span>
                    <span>-{formatCurrency(tax)}</span>
                  </div>
                )}
                {data.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Bonus/Other</span>
                    <span>+{formatCurrency(discountAmount)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-700 pt-4 flex justify-between items-end">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Net Take Home</div>
                <div className="text-2xl font-black text-white">{formatCurrency(total)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-[10px] text-slate-400 text-center uppercase tracking-[0.2em]">
          Electronic records - generated by {data.businessName || "InvoiceKit"}
        </div>
      </div>
    );
  }

  if (template === "modern") {
    return (
      <div className="w-full h-full bg-white flex font-sans text-slate-900 border-l-[30px] border-indigo-600">
        <div className="flex-1 p-10 md:p-14 flex flex-col">
          <div className="flex justify-between items-start mb-16">
            <div className="space-y-1">
              <div className="text-4xl font-black tracking-tighter text-indigo-600 mb-4">INVOICE</div>
              <div className="font-bold text-lg">{data.businessName || "Your Company"}</div>
              <p className="text-xs text-slate-500 whitespace-pre-wrap">{data.businessAddress}</p>
            </div>
            <div className="text-right">
              {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="max-h-12 ml-auto mb-4" />}
              <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full mb-2"># {data.invoiceNumber}</div>
              <div className="text-xs text-slate-400">Created: {data.issueDate}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-16">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">Client Information</div>
              <div className="font-bold text-lg text-slate-900">{data.clientName || "Client Name"}</div>
              <div className="text-sm text-slate-500 mt-1 whitespace-pre-wrap">{data.clientAddress}</div>
            </div>
            <div className="p-6 flex flex-col justify-end text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Due Date</div>
              <div className="text-xl font-bold text-slate-900">{data.dueDate || "-"}</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-12 gap-4 pb-4 mb-4 border-b-2 border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-600">
              <div className="col-span-7">Service Description</div>
              <div className="col-span-1 text-center">QTY</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="space-y-1">
              {data.lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 py-4 px-2 rounded-xl transition-colors hover:bg-indigo-50/50 group">
                  <div className="col-span-7 font-bold text-sm text-slate-800">{item.description}</div>
                  <div className="col-span-1 text-center text-sm text-slate-500 font-mono">{item.quantity}</div>
                  <div className="col-span-2 text-right text-sm text-slate-500 font-mono">{formatCurrency(item.unitPrice)}</div>
                  <div className="col-span-2 text-right text-sm font-black text-indigo-600">{formatCurrency(item.quantity * item.unitPrice)}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 flex justify-between items-start">
              <div className="max-w-[200px]">
                {data.notes && (
                  <>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Additional Notes</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{data.notes}</p>
                  </>
                )}
              </div>
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                {data.taxRate > 0 && (
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Tax ({data.taxRate}%)</span>
                    <span className="font-mono">{formatCurrency(tax)}</span>
                  </div>
                )}
                {data.discount > 0 && (
                  <div className="flex justify-between text-sm font-medium text-indigo-600">
                    <span>Discount ({data.discount}%)</span>
                    <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center bg-indigo-600 text-white p-5 rounded-2xl shadow-lg shadow-indigo-600/20 mt-6">
                  <span className="text-xs font-black uppercase tracking-widest opacity-80">Total Amount</span>
                  <span className="text-2xl font-black">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === "creative") {
    return (
      <div className="w-full h-full bg-slate-900 p-8 md:p-14 flex flex-col font-sans overflow-hidden relative">
        {/* Subtle decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-600 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-24 -left-24 w-64 h-64 bg-cyan-600 rounded-full blur-[120px] opacity-20" />

        <div className="relative z-10 bg-white rounded-[40px] shadow-2xl overflow-hidden flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-600 p-10 md:p-14 flex justify-between items-center text-white">
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">Invoice Issue</div>
              <div className="text-5xl font-black tracking-tighter leading-none italic uppercase">{data.businessName || "Creative Co"}</div>
              <div className="text-sm font-medium opacity-90">{data.businessEmail}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black italic">#{data.invoiceNumber || "001"}</div>
              <div className="text-[10px] uppercase font-black tracking-widest bg-white/20 inline-block px-3 py-1 rounded-full mt-3">{data.issueDate}</div>
            </div>
          </div>

          <div className="p-10 md:p-14 flex-1 flex flex-col">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 underline decoration-fuchsia-500 decoration-2 underline-offset-4">Project For</div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{data.clientName || "Awesome Client"}</div>
                <p className="text-xs text-slate-500 font-medium whitespace-pre-wrap max-w-xs">{data.clientAddress}</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Invoice Total</div>
                <div className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(total)}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-4">
                {data.lineItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 border-b border-slate-100 hover:bg-slate-50 transition-all rounded-2xl group">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black italic text-lg shrink-0 group-hover:bg-fuchsia-600 transition-colors">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-slate-900 group-hover:text-fuchsia-600 transition-colors">{item.description}</div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{item.quantity} units @ {formatCurrency(item.unitPrice)}</div>
                    </div>
                    <div className="text-xl font-black italic text-slate-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14 pt-10 border-t-2 border-dashed border-slate-100 flex flex-wrap gap-10 items-start">
              <div className="flex-1 min-w-[300px]">
                {data.notes && (
                  <>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Project Notes</div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed italic">{data.notes}</p>
                  </>
                )}
              </div>
              <div className="space-y-3 font-black text-xs uppercase tracking-widest text-slate-400 w-full sm:w-auto ml-auto">
                <div className="flex justify-between gap-20"><span>Subtotal</span> <span className="text-slate-900 italic">{formatCurrency(subtotal)}</span></div>
                {data.taxRate > 0 && <div className="flex justify-between gap-20"><span>Tax ({data.taxRate}%)</span> <span className="text-fuchsia-600 italic">+{formatCurrency(tax)}</span></div>}
                {data.discount > 0 && <div className="flex justify-between gap-20"><span>Discount ({data.discount}%)</span> <span className="text-cyan-600 italic">-{formatCurrency(discountAmount)}</span></div>}
                <div className="flex justify-between text-sm py-4 border-t border-slate-100 text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-2xl font-black italic bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
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
