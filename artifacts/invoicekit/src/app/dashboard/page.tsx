"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  FileText,
  Plus,
  Send,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Zap,
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
        maximumFractionDigits: 0,
      }),
    );
  }
  return formatters.get(currency)!.format(amount);
}

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data: invoices = [] } = useQuery<InvoiceRecord[]>({
    queryKey: ["invoices"],
    queryFn: () => fetch("/api/invoices").then((r) => r.json()),
    enabled: !!session,
  });

  const { data: usageData } = useQuery<{ usage: number, limit: number, isPro: boolean }>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    enabled: !!session,
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

  return (
    <>
      <DashboardHeader 
        title={`Welcome back, ${session?.user.name?.split(" ")[0] || "User"}`} 
        description="Here's what's happening with your invoices today."
      >
        <Button asChild size="sm">
            <Link href="/editor">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
            </Link>
        </Button>
      </DashboardHeader>

      <main className="flex-1 space-y-6 p-8 pt-6">
        {/* Usage Card */}
        <Card className="border-primary/10 bg-primary/[0.02]">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">Plan: {usageData?.isPro ? "Pro" : "Free"}</h3>
                            {usageData?.isPro && <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            You have sent {usageData?.usage || 0} out of {usageData?.limit || 0} invoices this month.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <Progress value={usageData ? (usageData.usage / usageData.limit) * 100 : 0} className="h-2" />
                        {!usageData?.isPro && (
                            <Button asChild size="sm" variant="default" className="w-full bg-amber-600 hover:bg-amber-700">
                                <Link href="/dashboard/subscription">Upgrade to Pro</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.billed, "USD")}</div>
              <p className="text-xs text-muted-foreground">Lifetime across all invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Active records in database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sent}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paid}</div>
              <p className="text-xs text-muted-foreground">Successfully collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Invoices</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Your latest invoice activity.</p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href={"/dashboard/invoices" as any}>
                        View All
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {recentInvoices.length === 0 ? (
                    <div className="flex h-[200px] flex-col items-center justify-center text-center">
                        <p className="text-sm text-muted-foreground">No invoices yet.</p>
                        <Button asChild variant="link">
                            <Link href="/editor">Create your first one</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentInvoices.map((inv) => (
                            <Link 
                                href={`/editor?id=${inv._id}`} 
                                key={inv._id}
                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium tracking-tight">{inv.invoiceNumber}</p>
                                        <p className="text-xs text-muted-foreground">{inv.clientName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold">{formatCurrency(calcTotal(inv), inv.currency || "USD")}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{inv.status}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </>
  );
}
