"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import {
  FileText,
  Plus,
  Send,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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

interface UsageData {
  usage: number;
  limit: number;
  isPro: boolean;
  usageWindowLabel?: string;
}

interface DashboardViewProps {
  initialInvoices: InvoiceRecord[];
  initialUsage: UsageData;
  userName: string;
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
        maximumFractionDigits: 0,
      }),
    );
  }
  return formatters.get(currency)!.format(amount);
}

function StatusPill({ status }: { status: InvoiceStatus }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Paid
      </span>
    );
  }
  if (status === "sent") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0f77ff] border border-blue-200">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0f77ff]" />
        Sent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f5f3ff] text-[#36394a] border border-[#e1e9f0]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8e9bb0]" />
      Draft
    </span>
  );
}

export function DashboardView({ initialInvoices, initialUsage, userName }: DashboardViewProps) {
  const { data: invoices = initialInvoices } = useQuery<InvoiceRecord[]>({
    queryKey: ["invoices"],
    queryFn: () => fetch("/api/invoices").then((r) => r.json()),
    initialData: initialInvoices,
  });

  const { data: usageData = initialUsage } = useQuery<UsageData>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    initialData: initialUsage,
  });

  const stats = useMemo(() => {
    const total = invoices.length;
    const sent = invoices.filter((i) => i.status === "sent").length;
    const paid = invoices.filter((i) => i.status === "paid").length;
    const billed = invoices.reduce((sum, inv) => sum + calcTotal(inv), 0);
    return { total, sent, paid, billed };
  }, [invoices]);

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [invoices]);

  const subscriptionHref = "/dashboard/subscription" as Route;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#fcfdfe] w-full">
      <DashboardHeader 
        title={`Welcome back, ${userName.split(" ")[0] || "User"}`} 
        description="Invoice telemetry and financial overview."
      >
        <Button asChild size="sm" className="bg-[#127ee3] hover:bg-[#0f77ff] text-white font-medium shadow-sm transition-colors">
          <Link href="/editor">
            <Plus className="mr-1.5 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </DashboardHeader>

      <main className="flex-1 space-y-6 p-8 pt-6 w-full">
        {/* Usage Telemetry Banner */}
        <Card className="border border-[#e1e9f0] bg-white rounded-xl shadow-none overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#127ee3] to-[#0f77ff]" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f5f3ff] text-[#091135] border border-[#e1e9f0]">
                    <Zap className="h-3.5 w-3.5 text-[#0f77ff] fill-[#0f77ff]" />
                    {usageData?.isPro ? "Pro Observatory" : "Free Tier"}
                  </span>
                  <span className="text-xs font-medium text-[#36394a]">
                    Active Billing Cycle
                  </span>
                </div>
                <h3 className="font-semibold text-base text-[#091135] tracking-tight">
                  You have generated {usageData?.usage || 0} of {usageData?.limit || 0} invoices this {usageData?.usageWindowLabel || "month"}.
                </h3>
                <p className="text-xs text-[#36394a]">
                  {usageData?.isPro 
                    ? "Unlimited client database and premium PDF exports are active." 
                    : "Upgrade to Pro for unlimited telemetry, customer database, and custom domain exports."}
                </p>
              </div>
              <div className="flex flex-col gap-2.5 min-w-[220px]">
                <div className="flex justify-between text-xs font-mono text-[#36394a]">
                  <span>{Math.round(((usageData?.usage || 0) / (usageData?.limit || 1)) * 100)}% utilized</span>
                  <span>{usageData?.usage || 0}/{usageData?.limit || 0}</span>
                </div>
                <Progress 
                  value={usageData ? Math.min(100, (usageData.usage / (usageData.limit || 1)) * 100) : 0} 
                  className="h-2 bg-[#f5f3ff] border border-[#e1e9f0]" 
                />
                {!usageData?.isPro && (
                  <Button asChild size="sm" className="w-full bg-[#127ee3] hover:bg-[#0f77ff] text-white font-medium text-xs shadow-sm mt-1">
                    <Link href={subscriptionHref} className="flex items-center justify-center gap-1.5">
                      Upgrade to Pro
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none hover:border-[#0f77ff]/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-[#36394a] font-semibold">Total Billed</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-[#f5f3ff] border border-[#e1e9f0]/60 flex items-center justify-center text-[#0f77ff]">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#091135]">{formatCurrency(stats.billed, "USD")}</div>
              <p className="text-xs text-[#36394a] mt-1">Cumulative volume</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none hover:border-[#0f77ff]/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-[#36394a] font-semibold">Invoices</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-[#f5f3ff] border border-[#e1e9f0]/60 flex items-center justify-center text-[#0f77ff]">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#091135]">{stats.total}</div>
              <p className="text-xs text-[#36394a] mt-1">Compiled documents</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none hover:border-[#0f77ff]/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-[#36394a] font-semibold">Awaiting</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-[#f5f3ff] border border-[#e1e9f0]/60 flex items-center justify-center text-[#0f77ff]">
                <Send className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#091135]">{stats.sent}</div>
              <p className="text-xs text-[#36394a] mt-1">Dispatched to clients</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none hover:border-[#0f77ff]/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-[#36394a] font-semibold">Settled</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#091135]">{stats.paid}</div>
              <p className="text-xs text-[#36394a] mt-1">Confirmed payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices Card */}
        <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#e1e9f0] bg-[#ffffff] px-6 py-4">
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight text-[#091135]">Recent Invoices</CardTitle>
              <p className="text-xs text-[#36394a] mt-0.5">Real-time ledger activity across your account.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="h-8 border-[#e1e9f0] text-xs font-medium text-[#091135] hover:bg-[#f5f3ff]">
              <Link href={"/dashboard/invoices" as any}>
                View All Records
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentInvoices.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center p-6">
                <div className="h-10 w-10 rounded-xl bg-[#f5f3ff] border border-[#e1e9f0] flex items-center justify-center text-[#0f77ff] mb-3">
                  <FileText className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-[#091135]">No invoice records yet</p>
                <p className="text-xs text-[#36394a] mt-1 max-w-sm">Create and issue your first invoice using the interactive visual editor.</p>
                <Button asChild size="sm" className="bg-[#127ee3] hover:bg-[#0f77ff] text-white text-xs mt-4">
                  <Link href="/editor">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    New Invoice
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-[#e1e9f0]">
                {recentInvoices.map((inv) => (
                  <Link 
                    href={`/editor?id=${inv._id}`} 
                    key={inv._id}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-[#f5f3ff]/60 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-9 w-9 rounded-lg bg-[#f5f3ff] border border-[#e1e9f0] flex items-center justify-center text-[#0f77ff] shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold font-mono text-[#091135] group-hover:text-[#0f77ff] transition-colors">
                            {inv.invoiceNumber}
                          </p>
                          <span className="sm:hidden">
                            <StatusPill status={inv.status} />
                          </span>
                        </div>
                        <p className="text-xs text-[#36394a]">{inv.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="hidden sm:block">
                        <StatusPill status={inv.status} />
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold font-mono text-[#091135]">
                          {formatCurrency(calcTotal(inv), inv.currency || "USD")}
                        </p>
                        <p className="text-[10px] text-[#36394a]">
                          {new Date(inv.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#8e9bb0] group-hover:text-[#091135] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
