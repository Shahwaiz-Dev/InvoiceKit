import { describe, it, expect } from "vitest";
import { getTemplateUtils } from "@/features/templates/lib/template-utils";
import { InvoiceData } from "@/lib/schema";

describe("getTemplateUtils", () => {
  const baseData: InvoiceData = {
    businessName: "Acme Corp",
    businessEmail: "acme@example.com",
    businessAddress: "123 Main St",
    logoUrl: "",
    clientName: "Client Inc",
    clientEmail: "client@example.com",
    clientAddress: "456 Oak St",
    invoiceNumber: "INV-001",
    issueDate: "2026-08-30",
    dueDate: "2026-09-13",
    lineItems: [
      { id: "1", description: "Design", quantity: 2, unitPrice: 100 },
      { id: "2", description: "Development", quantity: 3, unitPrice: 200 },
    ],
    taxRate: 10,
    discount: 5,
    currency: "USD",
    notes: "Thanks!",
  };

  it("calculates subtotal, tax, discount, and total correctly", () => {
    const utils = getTemplateUtils(baseData);
    // Subtotal: (2*100) + (3*200) = 800
    expect(utils.subtotal).toBe(800);
    // Tax: 800 * 0.10 = 80
    expect(utils.tax).toBe(80);
    // Discount: 800 * 0.05 = 40
    expect(utils.discountAmount).toBe(40);
    // Total: 800 + 80 - 40 = 840
    expect(utils.total).toBe(840);
    expect(utils.formatCurrency(utils.total)).toContain("840.00");
  });

  it("handles empty/invalid/null values without throwing or returning NaN", () => {
    const invalidData: any = {
      businessName: "",
      businessEmail: "",
      businessAddress: "",
      logoUrl: "",
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      invoiceNumber: "INV-001",
      issueDate: "2026-08-30",
      dueDate: "2026-09-13",
      lineItems: [
        { id: "1", description: "", quantity: "", unitPrice: null },
        { id: "2", description: "", quantity: undefined, unitPrice: "abc" },
      ],
      taxRate: "invalid",
      discount: null,
      currency: "INVALID_CURRENCY_CODE",
      notes: "",
    };

    const utils = getTemplateUtils(invalidData);
    expect(utils.subtotal).toBe(0);
    expect(utils.tax).toBe(0);
    expect(utils.discountAmount).toBe(0);
    expect(utils.total).toBe(0);
    expect(isNaN(utils.total)).toBe(false);
    expect(utils.formatCurrency(utils.total)).not.toContain("NaN");
  });

  it("formats different currencies properly", () => {
    const pkrData = { ...baseData, currency: "PKR" };
    const utils = getTemplateUtils(pkrData);
    const formatted = utils.formatCurrency(840);
    expect(formatted).toBeDefined();
    expect(formatted).not.toContain("NaN");
  });
});
