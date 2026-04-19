import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";

interface TemplateProps {
  data: InvoiceData;
}

export function CreativeTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

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
            <div className="text-[10px] opacity-70 whitespace-pre-wrap">{data.businessAddress}</div>
            {data.phone && <div className="text-[10px] opacity-70">{data.phone}</div>}
            {data.website && <div className="text-[10px] opacity-70">{data.website}</div>}
            {data.taxId && <div className="text-[10px] font-black opacity-80 mt-1 uppercase tracking-widest">Tax ID: {data.taxId}</div>}
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
