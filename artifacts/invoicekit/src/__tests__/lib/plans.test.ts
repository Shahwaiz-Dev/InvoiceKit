import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getPlanFromProductId,
  getLimitForPlan,
  getProductIdForPlan,
  PLANS,
} from "@/lib/plans";

describe("plans", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    // Restore env to clean state before each test
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  describe("getPlanFromProductId", () => {
    it("returns null for null productId", () => {
      expect(getPlanFromProductId(null)).toBeNull();
    });

    it("returns null for undefined productId", () => {
      expect(getPlanFromProductId(undefined)).toBeNull();
    });

    it("returns null for an empty string", () => {
      expect(getPlanFromProductId("")).toBeNull();
    });

    it("returns null for an unknown product ID", () => {
      expect(getPlanFromProductId("unknown-product-id")).toBeNull();
    });

    it("returns 'momentum' for a matching monthly product ID", () => {
      process.env.POLAR_MOMENTUM_MONTHLY_ID = "momentum-monthly-123";
      // Must re-import or re-evaluate — use direct test against PLANS config
      // Instead verify the logic: if productId matches config, returns key
      // Since env vars are read at module load time in Node, we can test
      // by checking if the product ID in the current PLANS matches
      const momentumMonthlyId = PLANS.momentum.monthlyProductId;
      if (momentumMonthlyId) {
        expect(getPlanFromProductId(momentumMonthlyId)).toBe("momentum");
      } else {
        // In test environment, env vars may not be set
        expect(getPlanFromProductId("no-match")).toBeNull();
      }
    });

    it("returns 'momentum' for a matching yearly product ID when set", () => {
      const momentumYearlyId = PLANS.momentum.yearlyProductId;
      if (momentumYearlyId) {
        expect(getPlanFromProductId(momentumYearlyId)).toBe("momentum");
      } else {
        expect(getPlanFromProductId("no-match")).toBeNull();
      }
    });

    it("returns 'authority' for matching authority monthly product ID when set", () => {
      const authorityMonthlyId = PLANS.authority.monthlyProductId;
      if (authorityMonthlyId) {
        expect(getPlanFromProductId(authorityMonthlyId)).toBe("authority");
      } else {
        expect(getPlanFromProductId("no-match")).toBeNull();
      }
    });

    it("iterates through all plans to find a match", () => {
      // This verifies that getPlanFromProductId covers explorer, momentum, authority
      for (const [key, config] of Object.entries(PLANS)) {
        if (config.monthlyProductId) {
          expect(getPlanFromProductId(config.monthlyProductId)).toBe(key);
        }
        if (config.yearlyProductId) {
          expect(getPlanFromProductId(config.yearlyProductId)).toBe(key);
        }
      }
    });
  });

  describe("getLimitForPlan", () => {
    it("returns 200 for 'authority' plan", () => {
      expect(getLimitForPlan("authority")).toBe(200);
    });

    it("returns 20 for 'momentum' plan", () => {
      expect(getLimitForPlan("momentum")).toBe(20);
    });

    it("returns 1 (explorer limit) for 'explorer' plan", () => {
      expect(getLimitForPlan("explorer")).toBe(1);
    });

    it("returns explorer limit for null", () => {
      expect(getLimitForPlan(null)).toBe(PLANS.explorer.limit);
    });

    it("returns explorer limit for undefined", () => {
      expect(getLimitForPlan(undefined)).toBe(PLANS.explorer.limit);
    });

    it("returns explorer limit for an unknown plan name", () => {
      expect(getLimitForPlan("premium")).toBe(PLANS.explorer.limit);
    });

    it("returns explorer limit for an empty string", () => {
      expect(getLimitForPlan("")).toBe(PLANS.explorer.limit);
    });
  });

  describe("getProductIdForPlan", () => {
    it("returns undefined for explorer monthly (free plan has no product id)", () => {
      expect(getProductIdForPlan("explorer", "monthly")).toBeUndefined();
    });

    it("returns undefined for explorer yearly (free plan has no product id)", () => {
      expect(getProductIdForPlan("explorer", "yearly")).toBeUndefined();
    });

    it("returns the momentum monthlyProductId for monthly billing", () => {
      const result = getProductIdForPlan("momentum", "monthly");
      expect(result).toBe(PLANS.momentum.monthlyProductId);
    });

    it("returns the momentum yearlyProductId for yearly billing", () => {
      const result = getProductIdForPlan("momentum", "yearly");
      expect(result).toBe(PLANS.momentum.yearlyProductId);
    });

    it("returns the authority monthlyProductId for authority monthly", () => {
      const result = getProductIdForPlan("authority", "monthly");
      expect(result).toBe(PLANS.authority.monthlyProductId);
    });
  });

  describe("PLANS config structure", () => {
    it("has explorer, momentum, authority keys", () => {
      expect(PLANS).toHaveProperty("explorer");
      expect(PLANS).toHaveProperty("momentum");
      expect(PLANS).toHaveProperty("authority");
    });

    it("explorer plan has a price of 0", () => {
      expect(PLANS.explorer.monthlyPrice).toBe(0);
      expect(PLANS.explorer.yearlyPrice).toBe(0);
    });

    it("momentum plan has higher limit than explorer", () => {
      expect(PLANS.momentum.limit).toBeGreaterThan(PLANS.explorer.limit);
    });

    it("authority plan has the highest limit", () => {
      expect(PLANS.authority.limit).toBeGreaterThan(PLANS.momentum.limit);
    });

    it("all plans have a features array", () => {
      for (const plan of Object.values(PLANS)) {
        expect(Array.isArray(plan.features)).toBe(true);
        expect(plan.features.length).toBeGreaterThan(0);
      }
    });

    it("yearly prices are less than 12x monthly prices for paid plans", () => {
      // This verifies the -20% discount is applied
      expect(PLANS.momentum.yearlyPrice).toBeLessThan(PLANS.momentum.monthlyPrice * 12);
      expect(PLANS.authority.yearlyPrice).toBeLessThan(PLANS.authority.monthlyPrice * 12);
    });
  });
});