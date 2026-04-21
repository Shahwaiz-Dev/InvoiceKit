"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server, Zap, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { PLANS, type PlanSubTier, type BillingCycle } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";

const planIcons: Record<string, React.ReactNode> = {
  explorer: <Briefcase size={20} />,
  momentum: <Zap size={20} />,
  authority: <Database size={20} />,
};

const PricingSwitch = ({
  onSwitch,
  className,
  billingCycle,
}: {
  onSwitch: (value: BillingCycle) => void;
  className?: string;
  billingCycle: BillingCycle;
}) => {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-white/50 backdrop-blur-sm border border-border/50 p-1 shadow-sm">
        <button
          onClick={() => onSwitch("monthly")}
          className={cn(
            "relative z-10 w-fit sm:h-12 cursor-pointer h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            billingCycle === "monthly"
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {billingCycle === "monthly" && (
            <motion.span
              layoutId={"switch"}
              className="absolute inset-0 rounded-full bg-primary shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => onSwitch("yearly")}
          className={cn(
            "relative z-10 w-fit cursor-pointer sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            billingCycle === "yearly"
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {billingCycle === "yearly" && (
            <motion.span
              layoutId={"switch"}
              className="absolute inset-0 rounded-full bg-primary shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              billingCycle === "yearly" ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
            )}>
              -20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

interface SubscriptionPricingProps {
  onUpgrade: (plan: PlanSubTier) => void;
  currentPlanKey: PlanSubTier;
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
}

export function SubscriptionPricing({
  onUpgrade,
  currentPlanKey,
  billingCycle,
  setBillingCycle,
}: SubscriptionPricingProps) {
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(4px)",
      y: 20,
      opacity: 0,
    },
  };

  return (
    <div
      className="w-full relative"
      ref={pricingRef}
    >
      <article className="flex sm:flex-row flex-col sm:pb-12 pb-8 sm:items-end items-start justify-between gap-6">
        <div className="text-left">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.05}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              Compare Plans
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-muted-foreground text-lg max-w-md"
          >
            Choose the right path for your business growth. Scale your invoice generation with powerful tools.
          </TimelineContent>
        </div>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch 
            billingCycle={billingCycle}
            onSwitch={setBillingCycle} 
            className="shrink-0" 
          />
        </TimelineContent>
      </article>

      <div className="grid md:grid-cols-3 gap-8 mx-auto lg:p-4 rounded-3xl">
        {(Object.keys(PLANS) as PlanSubTier[]).map((planKey, index) => {
          const plan = PLANS[planKey];
          const isMomentum = planKey === "momentum";
          const isCurrent = currentPlanKey === planKey;
          const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          
          return (
            <TimelineContent
              key={planKey}
              as="div"
              animationNum={index + 2}
              timelineRef={pricingRef}
              customVariants={revealVariants}
              className="h-full"
            >
              <Card
                className={cn(
                  "relative h-full flex flex-col justify-between transition-all duration-500 overflow-hidden rounded-3xl border-2",
                  isMomentum
                    ? "bg-foreground text-background border-foreground shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-105 z-10"
                    : "bg-white border-border/50 shadow-sm hover:shadow-md text-foreground"
                )}
              >
                <CardContent className="pt-8 flex-1">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "p-2.5 rounded-2xl",
                        isMomentum ? "bg-white/10" : "bg-primary/5"
                      )}>
                        <div className={isMomentum ? "text-white" : "text-primary"}>
                          {planIcons[planKey] || <Server size={20} />}
                        </div>
                      </div>
                      {isMomentum && (
                        <Badge className="bg-primary hover:bg-primary text-white border-none py-1 px-3">
                          MOST POPULAR
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge variant="outline" className={cn(
                          "py-1 px-3",
                          isMomentum ? "border-white/20 text-white" : "border-primary/20 text-primary bg-primary/5"
                        )}>
                          CURRENT
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <p className={cn(
                        "text-sm mt-1 leading-relaxed",
                        isMomentum ? "text-white/70" : "text-muted-foreground"
                      )}>
                        {planKey === "explorer" && "Perfect for individuals and freelancers starting out."}
                        {planKey === "momentum" && "Scale your business with more invoices and tools."}
                        {planKey === "authority" && "Premium solutions for high-volume businesses."}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold tracking-tight">
                        $
                        <NumberFlow
                          value={price}
                          className="text-5xl font-bold"
                        />
                      </span>
                      <span className={cn(
                        "text-sm font-medium",
                        isMomentum ? "text-white/60" : "text-muted-foreground"
                      )}>
                        /{billingCycle === "yearly" ? "yr" : "mo"}
                      </span>
                    </div>
                  </div>

                  <div className={cn(
                    "space-y-4 pt-6 border-t",
                    isMomentum ? "border-white/10" : "border-border/50"
                  )}>
                    <h4 className="font-semibold text-sm uppercase tracking-wider opacity-80">
                      What&apos;s included
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className={cn(
                            "mt-0.5 rounded-full p-0.5 flex-shrink-0",
                            isMomentum ? "bg-primary text-white" : "bg-primary/10 text-primary"
                          )}>
                            <CheckCheck className="h-3.5 w-3.5" />
                          </div>
                          <span className={cn(
                            "text-sm leading-snug",
                            isMomentum ? "text-white/90" : "text-foreground/80"
                          )}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="pb-8 pt-4">
                  <button
                    disabled={isCurrent}
                    onClick={() => onUpgrade(planKey)}
                    className={cn(
                      "w-full group flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300",
                      isCurrent
                        ? "cursor-notallowed opacity-50 bg-muted text-muted-foreground"
                        : isMomentum
                          ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                          : "bg-foreground hover:bg-foreground/90 text-background shadow-md"
                    )}
                  >
                    {isCurrent ? "Current Plan" : (planKey === "explorer" ? "Get Started" : "Upgrade Now")}
                    {!isCurrent && (
                      <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </button>
                </CardFooter>
              </Card>
            </TimelineContent>
          );
        })}
      </div>
    </div>
  );
}
