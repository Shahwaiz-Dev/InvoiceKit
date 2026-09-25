import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";
import { SignatureBlock } from "./SignatureBlock";

interface TemplateProps {
  data: InvoiceData;
}

export function CreativeTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full min-h-full bg-slate-900 p-8 flex flex-col font-sans overflow-hidden relative box-border">
      {/* Subtle decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-24 -left-24 w-64 h-64 bg-cyan-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-600 p-8 sm:p-10 flex justify-between items-center text-white">
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Invoice Issue</div>
            <div className="flex items-center gap-3">
              {data.logoUrl && (
                <img src={data.logoUrl} alt="Logo" className="max-h-12 max-w-[140px] object-contain bg-white/10 p-1.5 rounded-lg" />
              )}
              <div className="text-3xl sm:text-4xl font-black tracking-tighter leading-none italic uppercase">{data.businessName || "Creative Co"}</div>
            </div>
            <div className="text-xs font-medium opacity-90">{data.businessEmail}</div>
            <div className="text-[10px] opacity-70 whitespace-pre-wrap">{data.businessAddress}</div>
            {data.phone && <div className="text-[10px] opacity-70">{data.phone}</div>}
            {data.website && <div className="text-[10px] opacity-70">{data.website}</div>}
            {data.taxId && <div className="text-[10px] font-black opacity-80 mt-0.5 uppercase tracking-widest">Tax ID: {data.taxId}</div>}
          </div>
          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-black italic">#{data.invoiceNumber || "001"}</div>
            <div className="text-[10px] uppercase font-black tracking-widest bg-white/20 inline-block px-3 py-1 rounded-full mt-2">{data.issueDate || "Date"}</div>
          </div>
        </div>

        <div className="p-8 sm:p-10 flex-1 flex flex-col">
          <div className="flex justify-between items-end mb-8">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 underline decoration-fuchsia-500 decoration-2 underline-offset-4">Project For</div>
              <div className="text-xl font-black text-slate-900 tracking-tight">{data.clientName || "Awesome Client"}</div>
              <p className="text-xs text-slate-500 font-medium whitespace-pre-wrap max-w-xs">{data.clientAddress}</p>
              {data.clientEmail && <p className="text-xs text-slate-400">{data.clientEmail}</p>}
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Invoice Total</div>
              <div className="text-4xl font-black italic tracking-tighter text-fuchsia-600">
                {formatCurrency(total)}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-2.5">
              {data.lineItems && data.lineItems.length > 0 ? (
                data.lineItems.map((item, i) => (
                  <div key={item.id || i} className="flex items-center gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-xl">
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-black text-slate-900 text-sm break-words whitespace-pre-wrap">{item.description || "—"}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.quantity ?? 0} units @ {formatCurrency(item.unitPrice || 0)}</div>
                    </div>
                    <div className="text-base font-black italic text-slate-900 text-right shrink-0">
                      {formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm italic">No line items added yet</div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-end gap-8">
            <div className="flex-1 max-w-sm">
              {data.notes && (
                <>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Project Notes</div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed italic whitespace-pre-wrap">{data.notes}</p>
                </>
              )}
              <div className="mt-4">
                <SignatureBlock signature={data.signature} />
              </div>
            </div>
            <div className="space-y-2 font-black text-xs uppercase tracking-wider text-slate-400 w-64 shrink-0">
              <div className="flex justify-between"><span>Subtotal</span> <span className="text-slate-900 italic">{formatCurrency(subtotal)}</span></div>
              {Number(data.taxRate) > 0 && <div className="flex justify-between"><span>Tax ({data.taxRate}%)</span> <span className="text-fuchsia-600 italic">+{formatCurrency(tax)}</span></div>}
              {Number(data.discount) > 0 && <div className="flex justify-between"><span>Discount ({data.discount}%)</span> <span className="text-cyan-600 italic">-{formatCurrency(discountAmount)}</span></div>}
              <div className="flex justify-between text-sm py-3 border-t border-slate-200 text-slate-900">
                <span>Grand Total</span>
                <span className="text-xl font-black italic text-fuchsia-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
