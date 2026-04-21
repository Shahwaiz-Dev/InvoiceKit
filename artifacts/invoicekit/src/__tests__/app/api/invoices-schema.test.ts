import { describe, it, expect } from "vitest";
import { z } from "zod";

/**
 * Tests for the updateInvoiceSchema defined in the invoices API route.
 * The schema is duplicated here to test the validation logic in isolation.
 * Any changes to the route schema should be reflected here.
 */
const updateInvoiceSchema = z.object({
  invoiceNumber: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  date: z.string().optional(),
  dueDate: z.string().optional(),
  items: z.array(z.any()).optional(),
  notes: z.string().optional(),
  status: z.enum(["draft", "sent", "paid", "overdue", "canceled"]).optional(),
  total: z.number().optional(),
  tax: z.number().optional(),
  discount: z.number().optional(),
  currency: z.string().optional(),
}).strict();

describe("updateInvoiceSchema (invoice PATCH route)", () => {
  describe("valid inputs", () => {
    it("accepts an empty object (all fields optional)", () => {
      const result = updateInvoiceSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts a valid partial update with customerName", () => {
      const result = updateInvoiceSchema.safeParse({ customerName: "Jane Doe" });
      expect(result.success).toBe(true);
    });

    it("accepts a valid email for customerEmail", () => {
      const result = updateInvoiceSchema.safeParse({
        customerEmail: "jane@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("accepts all valid status values", () => {
      const statuses = ["draft", "sent", "paid", "overdue", "canceled"] as const;
      for (const status of statuses) {
        const result = updateInvoiceSchema.safeParse({ status });
        expect(result.success).toBe(true);
      }
    });

    it("accepts numeric values for total, tax, discount", () => {
      const result = updateInvoiceSchema.safeParse({
        total: 100.5,
        tax: 10.0,
        discount: 5.0,
      });
      expect(result.success).toBe(true);
    });

    it("accepts zero for numeric fields", () => {
      const result = updateInvoiceSchema.safeParse({ total: 0, tax: 0, discount: 0 });
      expect(result.success).toBe(true);
    });

    it("accepts an items array with arbitrary objects", () => {
      const result = updateInvoiceSchema.safeParse({
        items: [{ description: "Service", quantity: 2, unitPrice: 50 }],
      });
      expect(result.success).toBe(true);
    });

    it("accepts an empty items array", () => {
      const result = updateInvoiceSchema.safeParse({ items: [] });
      expect(result.success).toBe(true);
    });

    it("accepts a full valid payload", () => {
      const result = updateInvoiceSchema.safeParse({
        invoiceNumber: "INV-001",
        customerName: "Acme Corp",
        customerEmail: "billing@acme.com",
        date: "2025-01-01",
        dueDate: "2025-01-31",
        items: [{ description: "Consulting", quantity: 1, unitPrice: 500 }],
        notes: "Net 30",
        status: "sent",
        total: 500,
        tax: 50,
        discount: 0,
        currency: "USD",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("invalid inputs", () => {
    it("rejects an invalid email format", () => {
      const result = updateInvoiceSchema.safeParse({
        customerEmail: "not-an-email",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("customerEmail");
    });

    it("rejects an invalid status value", () => {
      const result = updateInvoiceSchema.safeParse({ status: "pending" });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("status");
    });

    it("rejects a string for total (should be number)", () => {
      const result = updateInvoiceSchema.safeParse({ total: "100" });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("total");
    });

    it("rejects a string for tax (should be number)", () => {
      const result = updateInvoiceSchema.safeParse({ tax: "10" });
      expect(result.success).toBe(false);
    });

    it("rejects a string for discount (should be number)", () => {
      const result = updateInvoiceSchema.safeParse({ discount: "5" });
      expect(result.success).toBe(false);
    });

    it("rejects extra unknown fields (strict mode)", () => {
      const result = updateInvoiceSchema.safeParse({
        invoiceNumber: "INV-001",
        unknownField: "should fail",
      });
      expect(result.success).toBe(false);
    });

    it("rejects object injections in known string fields", () => {
      const result = updateInvoiceSchema.safeParse({
        customerName: { $gt: "" }, // MongoDB injection attempt
      });
      expect(result.success).toBe(false);
    });

    it("rejects array for customerName", () => {
      const result = updateInvoiceSchema.safeParse({ customerName: ["Name"] });
      expect(result.success).toBe(false);
    });

    it("rejects null for status", () => {
      const result = updateInvoiceSchema.safeParse({ status: null });
      expect(result.success).toBe(false);
    });

    it("provides error details on failure", () => {
      const result = updateInvoiceSchema.safeParse({ status: "invalid" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
      }
    });
  });
});