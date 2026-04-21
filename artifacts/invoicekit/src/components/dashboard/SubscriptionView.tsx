"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  CreditCard, 
  Check, 
  Zap, 
  ArrowUpRight, 
  Info,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PLANS, type BillingCycle, PlanSubTier } from "@/lib/plans";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscriptionPricing } from "./SubscriptionPricing";

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
  if (!resetAt) return "Resets at the end of your current period";
  const date = new Date(resetAt);
  if (Number.isNaN(date.getTime())) return "Resets at the end of your current period";
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
  const { data: usage = initialUsage, isLoading } = useQuery<UsageData>({
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
      toast.loading("Redirecting to billing portal...");
      window.location.href = "/api/customer-portal";
    } catch (error) {
      toast.error("Failed to open billing portal");
    }
  };

  const currentPlanKey = (usage?.plan || "explorer") as PlanSubTier;
  const currentPlan = PLANS[currentPlanKey];

  const handleUpgrade = (planKey: PlanSubTier) => {
    if (planKey === "explorer") {
      toast.error("You are already on the free plan.");
      return;
    }
    if (usage?.isPro && currentPlanKey !== "explorer" && currentPlanKey !== planKey) {
      toast.loading("Opening billing portal to change your plan...");
      window.location.href = "/api/customer-portal";
      return;
    }
    window.location.href = `/api/checkout?plan=${planKey}&billingCycle=${billingCycle}`;
  };

  return (
    <div className="flex-1 space-y-12 p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Subscription</h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your plan, billing, and usage limits.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleManageBilling}
          className="border-border hover:bg-muted/20 transition-all duration-300 font-medium"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Manage Billing
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        {/* Current Plan & Usage Status */}
        <Card className="relative overflow-hidden border-border bg-foreground text-background shadow-xl rounded-3xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <div className="w-64 h-64 rounded-full border border-background border-dashed absolute -top-10 -right-10 animate-[spin_20s_linear_infinite]"></div>
          </div>
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium tracking-widest uppercase opacity-70">
                Your Current Plan
              </span>
              {usage?.isPro && (
                <Badge className="bg-primary hover:bg-primary text-primary-foreground border-none px-3 py-1">
                  PRO ACTIVE
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-4">
              <CardTitle className="text-5xl font-bold">{currentPlan?.name}</CardTitle>
              <span className="text-xl opacity-50 font-light">
                ${billingCycle === "yearly" ? currentPlan?.yearlyPrice : currentPlan?.monthlyPrice}
                /{billingCycle === "yearly" ? "yr" : "mo"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 flex flex-col relative z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium opacity-70 uppercase tracking-tight">
                      {usage?.usageWindowLabel === "billing period" ? "Billing Period Usage" : "Monthly Usage"}
                    </p>
                    <p className="text-3xl font-bold">{usage?.usage} / {usage?.limit} <span className="text-xl font-normal opacity-60">Invoices</span></p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-medium opacity-70 uppercase tracking-tight mb-1">Status</p>
                     <Badge variant="outline" className="border-background/20 text-background">
                        {usage?.limit ? Math.round((usage.usage / usage.limit) * 100) : 0}% Used
                     </Badge>
                  </div>
                </div>
                <Progress 
                  value={usage?.limit ? (usage.usage / usage.limit) * 100 : 0}
                  className="h-3 bg-background/10 border border-white/10"
                />
              </div>
              <div className="flex items-center text-sm text-background/60 bg-white/5 p-4 rounded-2xl border border-white/5">
                <Clock className="mr-3 h-5 w-5 opacity-70" />
                {formatResetLabel(usage?.resetAt)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Benefits / Perks */}
        <Card className="border-border bg-white shadow-sm rounded-3xl flex flex-col overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Plan Perks
            </CardTitle>
            <CardDescription className="text-sm">Features active on your account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-6 flex-1">
            {currentPlan?.features.slice(0, 5).map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1 flex-shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="leading-tight font-medium">{feature}</span>
              </div>
            ))}
            {currentPlanKey === "explorer" && (
              <div className="mt-auto p-4 rounded-2xl bg-accent text-white flex flex-col gap-2 relative overflow-hidden group shadow-lg shadow-accent/20">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Zap className="h-16 w-16 -mr-4 -mt-4 transform rotate-12" />
                </div>
                <div className="flex items-center gap-2 font-bold relative z-10">
                  <Zap className="h-4 w-4" />
                  <span>Reach Momentum</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed relative z-10">
                  Unlock 20x more invoices and premium templates today.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="pt-8">
        <SubscriptionPricing 
          onUpgrade={handleUpgrade}
          currentPlanKey={currentPlanKey}
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
        />
      </div>
    </div>
  );
}
