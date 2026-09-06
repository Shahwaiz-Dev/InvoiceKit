"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  CreditCard, 
  Check, 
  Zap, 
  ArrowUpRight, 
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PLANS, type BillingCycle, PlanSubTier } from "@/lib/plans";
import { toast } from "sonner";
import { SubscriptionPricing } from "./SubscriptionPricing";
import { DashboardHeader } from "./Header";

type UsageData = {
  usage: number;
  limit: number;
  isPro: boolean;
  plan?: string | null;
  canManageCustomers?: boolean;
  resetAt?: string;
  usageWindowLabel?: string;
};

function formatResetLabel(resetAt?: string) {
  if (!resetAt) return "Resets at the conclusion of your billing cycle";
  const date = new Date(resetAt);
  if (Number.isNaN(date.getTime())) return "Resets at the conclusion of your billing cycle";
  return `Resets on ${date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
}

interface SubscriptionViewProps {
  initialUsage: UsageData;
}

export function SubscriptionView({ initialUsage }: SubscriptionViewProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const { data: usage = initialUsage } = useQuery<UsageData>({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await fetch("/api/usage");
      if (!res.ok) throw new Error("Failed to fetch usage");
      return res.json();
    },
    initialData: initialUsage,
  });

  const handleManageBilling = async () => {
    try {
      toast.loading("Redirecting to customer billing portal...");
      window.location.href = "/api/customer-portal";
    } catch (error) {
      toast.error("Failed to open billing portal");
    }
  };

  const currentPlanKey = (usage?.plan || "explorer") as PlanSubTier;
  const currentPlan = PLANS[currentPlanKey];

  const handleUpgrade = (planKey: PlanSubTier) => {
    if (planKey === "explorer") {
      toast.error("You are already on the free tier.");
      return;
    }
    if (usage?.isPro && currentPlanKey !== "explorer" && currentPlanKey !== planKey) {
      toast.loading("Opening customer portal to update tier...");
      window.location.href = "/api/customer-portal";
      return;
    }
    window.location.href = `/api/checkout?plan=${planKey}&billingCycle=${billingCycle}`;
  };

  return (
    <div className="bg-[#fcfdfe] min-h-screen w-full flex flex-col flex-1">
      <DashboardHeader 
        title="Subscription & Limits" 
        description="Monitor invoice consumption, upgrade tiers, and manage customer billing."
      >
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleManageBilling}
          className="border-[#e1e9f0] hover:bg-[#f5f3ff] text-[#091135] font-medium text-xs h-9"
        >
          <CreditCard className="mr-1.5 h-4 w-4 text-[#0f77ff]" />
          Manage Billing Portal
        </Button>
      </DashboardHeader>

      <main className="flex-1 space-y-10 p-8 pt-6 w-full">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Current Plan & Usage Status - Midnight Ink Canvas */}
          <Card className="relative overflow-hidden border border-[#091135] bg-[#091135] text-white rounded-2xl shadow-md">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <div className="w-72 h-72 rounded-full border border-white/20 border-dashed absolute -top-12 -right-12" />
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold tracking-widest uppercase text-white/70">
                  Active Subscription Tier
                </span>
                {usage?.isPro ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0f77ff] text-white">
                    <Zap className="h-3 w-3 fill-white" />
                    PRO ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10">
                    FREE EXPLORER
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-3">
                <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {currentPlan?.name}
                </CardTitle>
                <span className="text-sm text-white/70 font-mono">
                  ${billingCycle === "yearly" ? currentPlan?.yearlyPrice : currentPlan?.monthlyPrice}
                  /{billingCycle === "yearly" ? "yr" : "mo"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 flex flex-col relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/70 uppercase tracking-wider">
                        {usage?.usageWindowLabel === "billing period" ? "Billing Cycle Volume" : "Monthly Allowance"}
                      </p>
                      <p className="text-2xl font-bold font-mono text-white mt-0.5">
                        {usage?.usage} <span className="text-sm font-normal text-white/60">/ {usage?.limit} Invoices</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-white/10 text-white border border-white/10">
                        {usage?.limit ? Math.round((usage.usage / usage.limit) * 100) : 0}% Utilized
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={usage?.limit ? (usage.usage / usage.limit) * 100 : 0}
                    className="h-2.5 bg-white/10 border border-white/10"
                  />
                </div>
                <div className="flex items-center text-xs text-white/70 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                  <Clock className="mr-2.5 h-4 w-4 text-[#0f77ff] shrink-0" />
                  <span>{formatResetLabel(usage?.resetAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Plan Perks */}
          <Card className="border border-[#e1e9f0] bg-white rounded-2xl shadow-none flex flex-col">
            <CardHeader className="bg-[#f5f3ff]/40 border-b border-[#e1e9f0] px-6 py-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#36394a] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0f77ff]" /> Included In Your Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-6 flex-1 text-xs">
              {currentPlan?.features.slice(0, 5).map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[#36394a]">
                  <div className="rounded-full bg-blue-50 border border-blue-200 p-0.5 mt-0.5 shrink-0 text-[#0f77ff]">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
              {currentPlanKey === "explorer" && (
                <div className="mt-auto p-4 rounded-xl bg-[#f5f3ff] border border-[#e1e9f0] flex flex-col gap-2 relative">
                  <div className="flex items-center gap-2 font-semibold text-xs text-[#091135]">
                    <Zap className="h-4 w-4 text-[#0f77ff]" />
                    <span>Need More Invoices?</span>
                  </div>
                  <p className="text-[11px] text-[#36394a] leading-relaxed">
                    Upgrade to Momentum or Authority to unlock up to 250 monthly records, reusable client lists, and priority rendering.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="pt-4">
          <SubscriptionPricing 
            onUpgrade={handleUpgrade}
            currentPlanKey={currentPlanKey}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
          />
        </div>
      </main>
    </div>
  );
}
