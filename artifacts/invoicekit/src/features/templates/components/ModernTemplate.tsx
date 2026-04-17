import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";

interface TemplateProps {
  data: InvoiceData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

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
