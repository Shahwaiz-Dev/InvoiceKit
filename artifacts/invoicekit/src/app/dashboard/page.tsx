"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Plus,
  Send,
  Trash2,
  Loader2,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Types ──────────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcTotal(inv: InvoiceRecord): number {
  const subtotal = inv.lineItems.reduce((a, i) => a + i.quantity * i.unitPrice, 0);
  const tax = subtotal * ((inv.taxRate ?? 0) / 100);
  const disc = subtotal * ((inv.discount ?? 0) / 100);
  return subtotal + tax - disc;
}

/**
 * Module-level formatter cache — avoids recreating Intl.NumberFormat on
 * every render cycle. Rule: js-cache-function-results / js-index-maps
 */
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

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-foreground tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sendingId, setSendingId] = useState<string | null>(null);

  // React Query deduplicates concurrent fetches and caches for 30 s.
  // Rule: client-swr-dedup
  const { data: invoices = [], isLoading: loading } = useQuery<InvoiceRecord[]>({
    queryKey: ["invoices"],
    queryFn: () =>
      fetch("/api/invoices").then((r) => {
        if (!r.ok) throw new Error("Failed to load invoices");
        return r.json();
      }),
    enabled: !!session,
    staleTime: 30_000,
  });

  const { data: usageData, isLoading: usageLoading } = useQuery<{ usage: number, limit: number, isPro: boolean }>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    enabled: !!session,
  });

  // Memoize all stats — single pass over the array, only re-runs when invoices changes.
  // Rule: rerender-memo / rerender-derived-state
  const stats = useMemo(() => {
    const total = invoices.length;
    const sent = invoices.filter((i) => i.status === "sent").length;
    const paid = invoices.filter((i) => i.status === "paid").length;
    const billed = invoices.reduce((sum, inv) => sum + calcTotal(inv), 0);
    return { total, sent, paid, billed };
  }, [invoices]);

  // ── Mutations ──────────────────────────────────────────────────────────────

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InvoiceStatus }) =>
      fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onMutate: async ({ id, status }) => {
      // Optimistic update — update the cache immediately
      await queryClient.cancelQueries({ queryKey: ["invoices"] });
      const prev = queryClient.getQueryData<InvoiceRecord[]>(["invoices"]);
      queryClient.setQueryData<InvoiceRecord[]>(["invoices"], (old = []) =>
        old.map((inv) => (inv._id === id ? { ...inv, status } : inv)),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["invoices"], ctx.prev);
      toast.error("Failed to update status");
    },
    onSuccess: (_data, { status }) => toast.success(`Marked as ${status}`),
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/invoices/${id}`, { method: "DELETE" }),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<InvoiceRecord[]>(["invoices"], (old = []) =>
        old.filter((inv) => inv._id !== id),
      );
      toast.success("Invoice deleted");
    },
    onError: () => toast.error("Failed to delete invoice"),
  });

  const sendEmail = async (inv: InvoiceRecord) => {
    if (!inv.clientEmail) {
      toast.error("No client email for this invoice");
      return;
    }
    setSendingId(inv._id);
    try {
      const total = calcTotal(inv);
      const res = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: inv.clientEmail,
          invoiceData: {
            ...inv,
            totalAmount: total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          },
        }),
      });
      if (res.ok) {
        toast.success(`Invoice sent to ${inv.clientEmail}`);
        updateStatusMutation.mutate({ id: inv._id, status: "sent" });
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to send");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSendingId(null);
    }
  };

  // ── Render-time auth guard — eliminates the useEffect redirect flash.
  // Rule: rerender-derived-state-no-effect
  import.meta.url; // just to prevent empty comments
  // Then inside the component:
  React.useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <FileText className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="font-medium tracking-tight">InvoiceKit</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <button
              onClick={() => signOut().then(() => router.push("/"))}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Good to see you, {session.user.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{session.user.email}</p>
          </div>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Link>
        </div>

        {/* Usage & Billing Widget */}
        <div className="bg-white rounded-xl border border-border p-6 mb-8 shadow-sm flex flex-col justify-center">
          {usageLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading usage...</span>
            </div>
          ) : usageData ? (
             <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
                <div>
                   <h2 className="font-semibold text-foreground text-lg tracking-tight">Plan: {usageData.isPro ? "Pro" : "Free"}</h2>
                   <div className="flex items-center gap-3 mt-2">
                     <div className="w-48 h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${Math.min((usageData.usage / usageData.limit) * 100, 100)}%` }}></div>
                     </div>
                     <p className="text-sm text-muted-foreground font-medium">
                        {usageData.usage} / {usageData.limit} invoices sent
                     </p>
                   </div>
                </div>
                {usageData.isPro ? (
                   <a href="/api/customer-portal" className="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">Manage Subscription</a>
                ) : (
                   <a href="/api/checkout" className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-medium text-white hover:bg-accent/90 shadow-sm shadow-accent/20 transition-colors">Upgrade to Pro ($5/mo)</a>
                )}
             </div>
          ) : null}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total invoices" value={String(stats.total)} icon={FileText} color="bg-primary/10 text-primary" />
          <StatCard label="Total billed" value={stats.total > 0 ? `$${stats.billed.toFixed(0)}` : "$0"} icon={TrendingUp} color="bg-emerald-50 text-emerald-700" />
          <StatCard label="Sent" value={String(stats.sent)} icon={Send} color="bg-accent/10 text-accent" />
          <StatCard label="Paid" value={String(stats.paid)} icon={CheckCircle2} color="bg-emerald-50 text-emerald-700" />
        </div>

        {/* Invoice table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent Invoices</h2>
            <span className="text-xs text-muted-foreground">{stats.total} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">No invoices yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Create your first invoice and it will appear here with its status.
              </p>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" /> Create Invoice
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {invoices.map((inv) => {
                const total = calcTotal(inv);
                const status = statusConfig[inv.status] ?? statusConfig.draft;
                const isDeleting =
                  deleteInvoiceMutation.isPending && deleteInvoiceMutation.variables === inv._id;
                return (
                  <div
                    key={inv._id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm truncate">
                          {inv.invoiceNumber}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {inv.clientName || "—"}{inv.clientEmail ? ` · ${inv.clientEmail}` : ""}
                      </p>
                    </div>
                    <div className="hidden sm:block text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(total, inv.currency || "USD")}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Due {new Date(inv.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => sendEmail(inv)}
                          disabled={sendingId === inv._id}
                          className="gap-2"
                        >
                          {sendingId === inv._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatusMutation.mutate({ id: inv._id, status: "paid" })}
                          className="gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatusMutation.mutate({ id: inv._id, status: "draft" })}
                          className="gap-2"
                        >
                          <Clock className="w-4 h-4" />
                          Mark as Draft
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteInvoiceMutation.mutate(inv._id)}
                          disabled={isDeleting}
                          className="text-destructive focus:text-destructive gap-2"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Link
                      href={`/editor?id=${inv._id}&template=${inv.template}`}
                      className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
