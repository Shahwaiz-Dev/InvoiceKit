import { InvoiceData } from "@/lib/schema";
import { getTemplateUtils } from "../lib/template-utils";

interface TemplateProps {
  data: InvoiceData;
}

export function SalariesTemplate({ data }: TemplateProps) {
  const { formatCurrency, subtotal, tax, discountAmount, total } = getTemplateUtils(data);

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
          {data.phone && <div className="text-slate-500 text-[10px]">{data.phone}</div>}
          {data.website && <div className="text-slate-500 text-[10px]">{data.website}</div>}
          {data.taxId && <div className="text-slate-500 text-[10px] mt-1">Tax ID: {data.taxId}</div>}
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
