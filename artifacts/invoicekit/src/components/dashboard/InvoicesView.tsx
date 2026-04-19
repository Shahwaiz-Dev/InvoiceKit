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

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted/30 text-muted-foreground" },
  sent: { label: "Sent", className: "bg-primary/10 text-primary" },
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700" },
};

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
      toast.error("No client email");
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
        toast.error("Failed to send");
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
        inv.clientName.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, deferredSearch, statusFilter]);

  return (
    <>
      <DashboardHeader 
        title="Invoices" 
        description="Manage your invoices, track payments and send emails."
      >
        <Button asChild size="sm">
          <Link href="/editor">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </DashboardHeader>

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices or clients..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          {loading && !initialInvoices ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No invoices found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {search || statusFilter !== "all" 
                  ? "Try adjusting your filters or search term."
                  : "Create your first invoice to get started."}
              </p>
              {!search && statusFilter === "all" && (
                <Button asChild>
                  <Link href="/editor">
                    <Plus className="mr-2 h-4 w-4" /> Create Invoice
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                  <tr>
                    <th className="px-6 py-4">Invoice</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredInvoices.map((inv) => {
                    const status = statusConfig[inv.status] || statusConfig.draft;
                    const total = calcTotal(inv);
                    return (
                      <tr key={inv._id} className="hover:bg-muted/5 transition-colors group">
                        <td className="px-6 py-4 font-medium font-mono">{inv.invoiceNumber}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{inv.clientName}</div>
                          <div className="text-xs text-muted-foreground">{inv.clientEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold font-mono">
                          {formatCurrency(total, inv.currency || "USD")}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(inv.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => sendEmail(inv)} disabled={sendingId === inv._id}>
                                  <Send className="mr-2 h-4 w-4" /> Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: inv._id, status: "paid" })}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: inv._id, status: "draft" })}>
                                  <Clock className="mr-2 h-4 w-4" /> Mark as Draft
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => deleteInvoiceMutation.mutate(inv._id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
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
    </>
  );
}
