import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";
import { SignatureBlock } from "./SignatureBlock";

interface TemplateProps {
  data: InvoiceData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

  return (
    <div className="w-full h-full min-h-full bg-white flex font-sans text-slate-900 border-l-[20px] border-indigo-600 box-border">
      <div className="flex-1 p-10 flex flex-col">
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-1">
            <div className="text-3xl font-black tracking-tighter text-indigo-600 mb-2">INVOICE</div>
            <div className="font-bold text-lg">{data.businessName || "Your Company"}</div>
            <p className="text-xs text-slate-500 whitespace-pre-wrap">{data.businessAddress}</p>
            <p className="text-xs text-indigo-500 font-medium">{data.businessEmail}</p>
            {data.phone && <p className="text-[10px] text-slate-400">{data.phone}</p>}
            {data.website && <p className="text-[10px] text-slate-400">{data.website}</p>}
            {data.taxId && <p className="text-[10px] text-slate-400 uppercase font-black mt-0.5">Tax ID: {data.taxId}</p>}
          </div>
          <div className="text-right">
            {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="max-h-12 max-w-[160px] object-contain ml-auto mb-3" />}
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full mb-1"># {data.invoiceNumber || "INV-001"}</div>
            <div className="text-xs text-slate-400">Created: {data.issueDate || "-"}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Client Information</div>
            <div className="font-bold text-base text-slate-900">{data.clientName || "Client Name"}</div>
            <div className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">{data.clientAddress}</div>
            {data.clientEmail && <div className="text-xs text-slate-400 mt-0.5">{data.clientEmail}</div>}
          </div>
          <div className="p-5 flex flex-col justify-end text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Due Date</div>
            <div className="text-lg font-bold text-slate-900">{data.dueDate || "-"}</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-12 gap-3 pb-3 mb-2 px-2 border-b-2 border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <div className="col-span-6">Service Description</div>
            <div className="col-span-2 text-center">QTY</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="space-y-1">
            {data.lineItems && data.lineItems.length > 0 ? (
              data.lineItems.map((item, i) => (
                <div key={item.id || i} className="grid grid-cols-12 gap-3 py-3 px-2 rounded-lg border-b border-slate-100 items-start">
                  <div className="col-span-6 font-bold text-sm text-slate-800 break-words whitespace-pre-wrap pr-2">{item.description || "—"}</div>
                  <div className="col-span-2 text-center text-sm text-slate-500 font-mono">{item.quantity ?? 0}</div>
                  <div className="col-span-2 text-right text-sm text-slate-500 font-mono">{formatCurrency(item.unitPrice || 0)}</div>
                  <div className="col-span-2 text-right text-sm font-black text-indigo-600 font-mono">{formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}</div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm italic">No services added yet</div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end gap-6">
            <div className="flex-1 max-w-sm">
              {data.notes && (
                <>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Additional Notes</div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">{data.notes}</p>
                </>
              )}
              <div className="mt-4">
                <SignatureBlock signature={data.signature} />
              </div>
            </div>
            <div className="w-72 space-y-2.5 shrink-0">
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              {Number(data.taxRate) > 0 && (
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Tax ({data.taxRate}%)</span>
                  <span className="font-mono">{formatCurrency(tax)}</span>
                </div>
              )}
              {Number(data.discount) > 0 && (
                <div className="flex justify-between text-sm font-medium text-indigo-600">
                  <span>Discount ({data.discount}%)</span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded-xl shadow-md mt-4">
                <span className="text-xs font-black uppercase tracking-widest opacity-90">Total Amount</span>
                <span className="text-xl font-black font-mono">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
