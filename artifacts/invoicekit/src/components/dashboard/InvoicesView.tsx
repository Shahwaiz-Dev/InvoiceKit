"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import {
  FileText,
  Plus,
  Send,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  ChevronRight,
  Search,
  Filter,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InvoiceStatus = "draft" | "sent" | "paid";

interface InvoiceRecord {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  currency: string;
  lineItems: { quantity: number; unitPrice: number }[];
  taxRate: number;
  discount: number;
  status: InvoiceStatus;
  template: string;
  issueDate: string;
  dueDate: string;
  createdAt: string;
}

function calcTotal(inv: InvoiceRecord): number {
  const subtotal = inv.lineItems.reduce((a, i) => a + i.quantity * i.unitPrice, 0);
  const tax = subtotal * ((inv.taxRate ?? 0) / 100);
  const disc = subtotal * ((inv.discount ?? 0) / 100);
  return subtotal + tax - disc;
}

const formatters = new Map<string, Intl.NumberFormat>();
function formatCurrency(amount: number, currency: string) {
  if (!formatters.has(currency)) {
    formatters.set(
      currency,
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }),
    );
  }
  return formatters.get(currency)!.format(amount);
}

function StatusPill({ status }: { status: InvoiceStatus }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Paid
      </span>
    );
  }
  if (status === "sent") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0f77ff] border border-blue-200">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0f77ff]" />
        Sent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f5f3ff] text-[#36394a] border border-[#e1e9f0]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8e9bb0]" />
      Draft
    </span>
  );
}

interface InvoicesViewProps {
  initialInvoices: InvoiceRecord[];
}

export function InvoicesView({ initialInvoices }: InvoicesViewProps) {
  const queryClient = useQueryClient();
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: invoices = initialInvoices, isLoading: loading } = useQuery<InvoiceRecord[]>({
    queryKey: ["invoices"],
    queryFn: () =>
      fetch("/api/invoices").then((r) => {
        if (!r.ok) throw new Error("Failed to load invoices");
        return r.json();
      }),
    initialData: initialInvoices,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InvoiceStatus }) =>
      fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Status updated");
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/invoices/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
      toast.success("Invoice deleted");
    },
  });

  const sendEmail = async (inv: InvoiceRecord) => {
    if (!inv.clientEmail) {
      toast.error("No client email specified");
      return;
    }
    setSendingId(inv._id);
    try {
      const res = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: inv.clientEmail,
          invoiceData: { ...inv, totalAmount: calcTotal(inv).toFixed(2) },
        }),
      });
      if (res.ok) {
        toast.success(`Sent to ${inv.clientEmail}`);
        updateStatusMutation.mutate({ id: inv._id, status: "sent" });
      } else {
        toast.error("Failed to send email");
      }
    } catch {
      toast.error("Error sending email");
    } finally {
      setSendingId(null);
    }
  };

  const deferredSearch = useDeferredValue(search);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = 
        inv.invoiceNumber.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        inv.clientEmail.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, deferredSearch, statusFilter]);

  return (
    <div className="bg-[#fcfdfe] min-h-screen w-full flex flex-col flex-1">
      <DashboardHeader 
        title="Invoices" 
        description="Monitor, dispatch, and track your invoice records."
      >
        <Button asChild size="sm" className="bg-[#127ee3] hover:bg-[#0f77ff] text-white font-medium shadow-sm transition-colors">
          <Link href="/editor">
            <Plus className="mr-1.5 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </DashboardHeader>

      <main className="flex-1 space-y-5 p-8 pt-6 w-full">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8e9bb0]" />
            <Input
              placeholder="Search by invoice #, client name, or email..."
              className="pl-9 bg-white border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white border-[#e1e9f0] text-xs h-9">
              <div className="flex items-center gap-2 text-[#36394a]">
                <Filter className="h-3.5 w-3.5 text-[#8e9bb0]" />
                <SelectValue placeholder="All Statuses" />
              </div>
            </SelectTrigger>
            <SelectContent className="border-[#e1e9f0] bg-white text-xs">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Observatory Data Table */}
        <div className="rounded-xl border border-[#e1e9f0] bg-white shadow-none overflow-hidden">
          {loading && !initialInvoices ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-7 w-7 animate-spin text-[#0f77ff]" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-12 h-12 bg-[#f5f3ff] rounded-xl border border-[#e1e9f0] flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-[#0f77ff]" />
              </div>
              <h3 className="text-base font-semibold text-[#091135]">No invoices found</h3>
              <p className="text-xs text-[#36394a] mt-1 mb-5 max-w-xs">
                {search || statusFilter !== "all" 
                  ? "Try adjusting your search criteria or filter status."
                  : "Compile your first invoice to populate this directory."}
              </p>
              {!search && statusFilter === "all" && (
                <Button asChild size="sm" className="bg-[#127ee3] hover:bg-[#0f77ff] text-white text-xs">
                  <Link href="/editor">
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Invoice
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f5f3ff]/60 text-[#36394a] font-semibold border-b border-[#e1e9f0]">
                  <tr>
                    <th className="px-6 py-3.5 uppercase tracking-wider text-[11px]">Invoice #</th>
                    <th className="px-6 py-3.5 uppercase tracking-wider text-[11px]">Client</th>
                    <th className="px-6 py-3.5 uppercase tracking-wider text-[11px]">Amount</th>
                    <th className="px-6 py-3.5 uppercase tracking-wider text-[11px]">Status</th>
                    <th className="px-6 py-3.5 uppercase tracking-wider text-[11px]">Date</th>
                    <th className="px-6 py-3.5 text-right uppercase tracking-wider text-[11px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e9f0]">
                  {filteredInvoices.map((inv) => {
                    const total = calcTotal(inv);
                    return (
                      <tr key={inv._id} className="hover:bg-[#f5f3ff]/40 transition-colors group">
                        <td className="px-6 py-4 font-mono font-semibold text-[#091135]">
                          <Link 
                            href={`/editor?id=${inv._id}`} 
                            className="hover:text-[#0f77ff] hover:underline transition-colors inline-flex items-center gap-1.5"
                          >
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#091135]">{inv.clientName}</div>
                          <div className="text-[11px] text-[#36394a]">{inv.clientEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-[#091135]">
                          {formatCurrency(total, inv.currency || "USD")}
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill status={inv.status} />
                        </td>
                        <td className="px-6 py-4 text-[#36394a]">
                          {new Date(inv.issueDate || inv.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-[#36394a] hover:text-[#091135] hover:bg-[#f5f3ff]"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="border-[#e1e9f0] bg-white rounded-xl shadow-lg text-xs p-1">
                                <DropdownMenuItem 
                                  onClick={() => sendEmail(inv)} 
                                  disabled={sendingId === inv._id}
                                  className="cursor-pointer text-[#36394a] hover:bg-[#f5f3ff] hover:text-[#091135]"
                                >
                                  <Send className="mr-2 h-3.5 w-3.5 text-[#0f77ff]" /> Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateStatusMutation.mutate({ id: inv._id, status: "paid" })}
                                  className="cursor-pointer text-[#36394a] hover:bg-[#f5f3ff] hover:text-[#091135]"
                                >
                                  <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Mark as Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateStatusMutation.mutate({ id: inv._id, status: "draft" })}
                                  className="cursor-pointer text-[#36394a] hover:bg-[#f5f3ff] hover:text-[#091135]"
                                >
                                  <Clock className="mr-2 h-3.5 w-3.5 text-[#8e9bb0]" /> Mark as Draft
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#e1e9f0]" />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    if (confirm("Permanently delete this invoice?")) {
                                      deleteInvoiceMutation.mutate(inv._id);
                                    }
                                  }}
                                  className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="mr-2 h-3.5 w-3.5 text-red-500" /> Delete Record
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <Button 
                              asChild 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-[#36394a] hover:text-[#091135] hover:bg-[#f5f3ff]"
                            >
                              <Link href={`/editor?id=${inv._id}`}>
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
