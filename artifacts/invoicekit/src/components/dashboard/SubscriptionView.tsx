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

  const getPlanPrice = (plan: (typeof PLANS)[PlanSubTier]) =>
    billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <div className="flex-1 space-y-12 p-8 pt-6">
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

      <div className="grid gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px]">
        {/* Current Plan Status */}
        <Card className="relative overflow-hidden border-border bg-foreground text-background shadow-2xl rounded-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <div className="w-64 h-64 rounded-full border border-background border-dashed absolute -top-10 -right-10 animate-[spin_20s_linear_infinite]"></div>
          </div>
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium tracking-widest uppercase opacity-70">
                Current Plan
              </span>
              {usage?.isPro && (
                <Badge className="bg-primary hover:bg-primary text-primary-foreground border-none">
                  ACTIVE
                </Badge>
              )}
            </div>
            <CardTitle className="text-5xl font-bold">{currentPlan?.name}</CardTitle>
            <CardDescription className="text-background/70 text-lg mt-2 font-light">
              {usage?.isPro ? "You are on a premium subscription." : "Upgrade for more features and higher limits."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 flex flex-col relative z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium opacity-90">
                    {usage?.usageWindowLabel === "billing period" ? "Billing Period Usage" : "Monthly Usage"}
                  </span>
                  <span className="font-semibold text-lg">{usage?.usage} / {usage?.limit} Invoices</span>
                </div>
                <Progress 
                  value={usage?.limit ? (usage.usage / usage.limit) * 100 : 0}
                  className="h-1.5 bg-background/20"
                />
              </div>
              <div className="flex items-center text-sm text-background/60">
                <Clock className="mr-2 h-4 w-4" />
                {formatResetLabel(usage?.resetAt)}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-6">
            {!usage?.isPro && (
              <Button onClick={() => handleUpgrade("momentum")} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-none font-semibold text-base py-6 relative z-10">
                Upgrade to Momentum
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Plan Benefits Summary */}
        <Card className="border-border bg-card shadow-sm rounded-2xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Plan Benefits
            </CardTitle>
            <CardDescription className="text-sm">Included in your {currentPlan?.name} plan</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1">
            {currentPlan?.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1 flex-shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="leading-tight">{feature}</span>
              </div>
            ))}
            <div className="mt-auto pt-4">
              {currentPlanKey === "explorer" && (
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 flex flex-col gap-2 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Zap className="h-16 w-16 -mr-4 -mt-4 transform rotate-12" />
                  </div>
                  <div className="flex items-center gap-2 text-accent font-semibold relative z-10">
                    <Sparkles className="h-4 w-4" />
                    <span>Unlock your potential</span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed relative z-10">
                    Get 20x more invoices and premium features with the Momentum plan.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8 pt-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-3xl font-bold text-foreground">Compare Plans</h3>
            <p className="text-muted-foreground mt-2">Choose the right path for your business growth.</p>
          </div>
          <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
            <Button
              type="button"
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              className={`rounded-md px-6 ${billingCycle === "monthly" ? "bg-primary text-primary-foreground hover:bg-primary shadow-sm" : "hover:bg-muted/50 text-foreground"}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              type="button"
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              className={`rounded-md px-6 ${billingCycle === "yearly" ? "bg-primary text-primary-foreground hover:bg-primary shadow-sm" : "hover:bg-muted/50 text-foreground"}`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly <Badge className="ml-2 bg-accent/10 hover:bg-accent/10 text-accent border border-accent/20 px-1.5 py-0">-20%</Badge>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 md:pt-4">
          {(Object.keys(PLANS) as PlanSubTier[]).map((planKey) => {
            const plan = PLANS[planKey];
            const isCurrent = currentPlanKey === planKey;
            const price = getPlanPrice(plan);
            const periodLabel = billingCycle === "yearly" ? "/ yr" : "/ mo";
            const yearlySavings =
              plan.monthlyPrice > 0 ? plan.monthlyPrice * 12 - plan.yearlyPrice : 0;
            
            return (
              <Card 
                key={planKey}
                className={`relative flex flex-col transition-all duration-500 rounded-2xl ${
                  planKey === "momentum" ? "border-border shadow-xl md:-translate-y-4 md:scale-[1.02] z-10" : "border-border shadow-sm hover:shadow-md"
                } ${isCurrent && planKey !== "momentum" ? "ring-1 ring-primary ring-offset-2 ring-offset-background" : ""}`}
              >
                {planKey === "momentum" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary hover:bg-primary text-primary-foreground border-none px-4 py-1.5 text-xs tracking-wider uppercase font-medium shadow-md">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {isCurrent && planKey === "momentum" && (
                  <div className="absolute top-4 right-4">
                     <Badge className="bg-primary/10 hover:bg-primary/10 text-primary border-primary/20">Current</Badge>
                  </div>
                )}
                <CardHeader className={`${planKey === "momentum" ? "pt-10" : "pt-8"}`}>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="min-h-[48px] text-sm mt-3 leading-relaxed">
                    {planKey === "explorer" && "Perfect for individuals and freelancers just starting out."}
                    {planKey === "momentum" && "Scale your business with more invoices and powerful tools."}
                    {planKey === "authority" && "Premium solutions for high-volume businesses and teams."}
                  </CardDescription>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight">${price}</span>
                    <span className="text-muted-foreground text-sm font-medium">{periodLabel}</span>
                  </div>
                  <div className="h-6 mt-2">
                    {billingCycle === "yearly" && yearlySavings > 0 && (
                      <span className="inline-flex items-center text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                        Save ${yearlySavings} per year
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-6">
                    <div className="h-px w-full bg-border" />
                    <ul className="space-y-4 text-sm text-foreground/80">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 relative top-1.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-8 pb-8">
                  {isCurrent ? (
                    <Button disabled className="w-full bg-muted text-muted-foreground border-none rounded-xl py-6 font-medium">
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleUpgrade(planKey)}
                      variant={planKey === "momentum" ? "default" : "outline"}
                      className={`w-full group rounded-xl py-6 font-medium transition-all duration-300 ${
                        planKey === "momentum" 
                          ? "bg-foreground hover:bg-foreground/90 text-background shadow-[0_4px_14px_0_rgba(28,25,23,0.39)]" 
                          : "border-border hover:bg-muted/20 text-foreground"
                      }`}
                    >
                      {planKey === "explorer"
                        ? "Get Started"
                        : usage?.isPro && currentPlanKey !== "explorer" && currentPlanKey !== planKey
                          ? "Change Plan"
                          : `Upgrade ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`}
                      <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
