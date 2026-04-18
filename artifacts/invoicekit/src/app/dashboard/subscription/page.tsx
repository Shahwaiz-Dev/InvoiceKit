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

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const { data: usage, isLoading } = useQuery<UsageData>({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await fetch("/api/usage");
      if (!res.ok) throw new Error("Failed to fetch usage");
      return res.json();
    },
  });

  const handleManageBilling = async () => {
    try {
      toast.loading("Redirecting to billing portal...");
      // In a real app, this would redirect to the API route
      window.location.href = "/api/customer-portal";
    } catch (error) {
      toast.error("Failed to open billing portal");
    }
  };

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

  const currentPlanKey = (usage?.plan || "explorer") as PlanSubTier;
  const currentPlan = PLANS[currentPlanKey];

  const getPlanPrice = (plan: (typeof PLANS)[PlanSubTier]) =>
    billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  if (isLoading) {
    return (
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">Subscription</h2>
          <p className="text-muted-foreground">
            Manage your plan, billing, and usage limits.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleManageBilling}
          className="bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-slate-50 transition-all duration-300"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Manage Billing
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Status */}
        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="h-32 w-32" />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md">
                Current Plan
              </Badge>
              {usage?.isPro && (
                <Badge className="bg-emerald-500 text-white border-none animate-pulse">
                  ACTIVE
                </Badge>
              )}
            </div>
            <CardTitle className="text-4xl font-bold mt-4">{currentPlan?.name}</CardTitle>
            <CardDescription className="text-white/80">
              {usage?.isPro ? "You are on a premium subscription." : "Upgrade for more features and higher limits."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {usage?.usageWindowLabel === "billing period" ? "Billing Period Usage" : "Monthly Usage"}
                  </span>
                  <span>{usage?.usage} / {usage?.limit} Invoices</span>
                </div>
                <Progress 
                  value={usage?.limit ? (usage.usage / usage.limit) * 100 : 0}
                  className="h-2 bg-white/20"
                />
              </div>
              <div className="flex items-center text-xs text-white/70">
                <Clock className="mr-1 h-3 w-3" />
                {formatResetLabel(usage?.resetAt)}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {!usage?.isPro && (
              <Button className="w-full bg-white text-indigo-600 hover:bg-slate-100 border-none font-semibold">
                Upgrade Now
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Plan Benefits Summary */}
        <Card className="border-slate-200/60 shadow-lg bg-white/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Plan Benefits
            </CardTitle>
            <CardDescription>Included in your {currentPlan?.name} plan</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {currentPlan?.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>
                {feature}
              </div>
            ))}
            {currentPlanKey === "explorer" && (
              <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 flex gap-3 text-sm text-orange-800">
                <Info className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Upgrade for more</p>
                  <p className="opacity-80">Get 20x more invoices and premium features with Momentum plan.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-bold">Compare Plans</h3>
            <p className="text-muted-foreground text-sm">Choose the right path for your business growth.</p>
          </div>
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <Button
              type="button"
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              className="rounded-full px-4"
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              type="button"
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              className="rounded-full px-4"
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {(Object.keys(PLANS) as PlanSubTier[]).map((planKey) => {
            const plan = PLANS[planKey];
            const isCurrent = currentPlanKey === planKey;
            const price = getPlanPrice(plan);
            const periodLabel = billingCycle === "yearly" ? "/yr" : "/mo";
            const yearlySavings =
              plan.monthlyPrice > 0 ? plan.monthlyPrice * 12 - plan.yearlyPrice : 0;
            
            return (
              <Card 
                key={planKey}
                className={`relative flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  isCurrent ? "border-primary ring-1 ring-primary" : "border-slate-200"
                }`}
              >
                {planKey === "momentum" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-lg">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">
                    {planKey === "explorer" && "Perfect for individuals and freelancers just starting out."}
                    {planKey === "momentum" && "Scale your business with more invoices and powerful tools."}
                    {planKey === "authority" && "Premium solutions for high-volume businesses and teams."}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-muted-foreground ml-1">{periodLabel}</span>
                  </div>
                  {billingCycle === "yearly" && yearlySavings > 0 && (
                    <p className="mt-2 text-xs font-medium text-emerald-600">
                      Save ${yearlySavings} per year
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="h-px bg-slate-100" />
                    <ul className="space-y-2 text-sm text-slate-600">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  {isCurrent ? (
                    <Button disabled className="w-full bg-slate-100 text-slate-500 border-none">
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleUpgrade(planKey)}
                      variant={planKey === "momentum" ? "default" : "outline"}
                      className={`w-full group ${
                        planKey === "momentum" 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200" 
                          : ""
                      }`}
                    >
                      {planKey === "explorer"
                        ? "Get Started"
                        : usage?.isPro && currentPlanKey !== "explorer" && currentPlanKey !== planKey
                          ? "Change Plan"
                          : `Upgrade ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`}
                      <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
