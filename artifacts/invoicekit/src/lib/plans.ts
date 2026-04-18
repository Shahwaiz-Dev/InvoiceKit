/**
 * Subscription Plan Configuration
 * 
 * Defines the limits and Polar product IDs for each tier.
 */

export type PlanSubTier = "explorer" | "momentum" | "authority";

export interface PlanConfig {
  name: string;
  limit: number;
  features: string[];
  monthlyProductId?: string;
  yearlyProductId?: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

export const PLANS: Record<PlanSubTier, PlanConfig> = {
  explorer: {
    name: "Explorer",
    limit: 1,
    features: ["1 Invoice per month", "Basic templates", "PDF Export"],
    monthlyPrice: 0,
    yearlyPrice: 0,
  },
  momentum: {
    name: "Momentum",
    limit: 20,
    features: [
      "20 Invoices per month",
      "All premium templates",
      "Advanced analytics",
      "Priority email support",
    ],
    monthlyProductId: process.env.POLAR_MOMENTUM_MONTHLY_ID,
    yearlyProductId: process.env.POLAR_MOMENTUM_YEARLY_ID,
    monthlyPrice: 5,
    yearlyPrice: 50,
  },
  authority: {
    name: "Authority",
    limit: 200,
    features: [
      "200 Invoices per month",
      "Customer Management",
      "Custom branding",
      "Early access to new templates",
      "24/7 Dedicated support",
    ],
    monthlyProductId: process.env.POLAR_AUTHORITY_MONTHLY_ID,
    yearlyProductId: process.env.POLAR_AUTHORITY_YEARLY_ID,
    monthlyPrice: 20,
    yearlyPrice: 200,
  },
};

/**
 * Gets the plan key for a given Polar Product ID
 */
export function getPlanFromProductId(productId: string | null | undefined): PlanSubTier | null {
  if (!productId) return null;
  for (const [key, config] of Object.entries(PLANS)) {
    if (config.monthlyProductId === productId || config.yearlyProductId === productId) {
      return key as PlanSubTier;
    }
  }
  return null;
}

/**
 * Gets the limit for a given plan
 */
export function getLimitForPlan(plan?: string | null): number {
  if (plan === "authority") return PLANS.authority.limit;
  if (plan === "momentum") return PLANS.momentum.limit;
  return PLANS.explorer.limit;
}
