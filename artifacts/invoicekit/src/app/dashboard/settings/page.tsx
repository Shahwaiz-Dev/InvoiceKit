"use client";

import React, { useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  LogOut,
  Loader2,
  CreditCard,
  CheckCircle2,
  Zap,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show success toast when redirected back from Polar checkout
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Subscription activated! Welcome to Pro 🎉", {
        duration: 6000,
      });
      // Clean up the URL without triggering a navigation
      window.history.replaceState({}, "", "/dashboard/settings");
    }
  }, [searchParams]);

  const { data: usageData, isLoading: usageLoading } = useQuery<{
    usage: number;
    limit: number;
    isPro: boolean;
  }>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    enabled: !!session,
  });

  useEffect(() => {
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

  const isPro = usageData?.isPro ?? false;

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <FileText className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="font-medium tracking-tight">InvoiceKit</span>
          </Link>
          <button
            onClick={() => signOut().then(() => router.push("/"))}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account and billing preferences.
          </p>
        </div>

        {/* Account */}
        <section className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <User className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-medium text-foreground">Account</h2>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium text-foreground">{session.user.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium text-foreground">{session.user.email}</span>
            </div>
          </div>
        </section>

        {/* Billing */}
        <section className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-medium text-foreground">Billing & Plan</h2>
          </div>
          <div className="px-6 py-5">
            {usageLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading plan info...</span>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Plan badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isPro ? (
                      <Zap className="w-4 h-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {isPro ? "Pro Plan" : "Free Plan"}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      isPro
                        ? "bg-amber-50 text-amber-700"
                        : "bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    {isPro ? "$5 / month" : "Free"}
                  </span>
                </div>

                {/* Usage bar */}
                {usageData && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">Invoices this month</span>
                      <span className="text-xs font-medium text-foreground">
                        {usageData.usage} / {usageData.limit}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.min((usageData.usage / usageData.limit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-1">
                  {isPro ? (
                    <a
                      href="/api/customer-portal"
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-muted/10 transition-colors"
                    >
                      Manage Subscription
                    </a>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 space-y-2">
                        <p className="text-sm font-medium text-foreground">Upgrade to Pro</p>
                        <ul className="space-y-1.5">
                          {[
                            "20 invoices per month",
                            "All premium templates",
                            "Email delivery",
                            "Priority support",
                          ].map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a
                        href="/api/checkout"
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        <Zap className="w-3.5 h-3.5 mr-1.5" />
                        Upgrade — $5/mo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
