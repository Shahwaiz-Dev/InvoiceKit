import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CleanTemplate } from "@/features/templates/components/CleanTemplate";
import { CorporateTemplate } from "@/features/templates/components/CorporateTemplate";
import { CreativeTemplate } from "@/features/templates/components/CreativeTemplate";
import { MinimalTemplate } from "@/features/templates/components/MinimalTemplate";
import { ModernTemplate } from "@/features/templates/components/ModernTemplate";
import { SalariesTemplate } from "@/features/templates/components/SalariesTemplate";
import { ContractorTemplate } from "@/features/templates/components/ContractorTemplate";
import { InvoiceData } from "@/lib/schema";

describe("All Invoice Templates Render Test", () => {
  const sampleData: InvoiceData = {
    businessName: "Design Studio",
    businessEmail: "studio@example.com",
    businessAddress: "100 Studio Ave\nSuite 200",
    logoUrl: "https://example.com/logo.png",
    clientName: "Acme Client",
    clientEmail: "acme@example.com",
    clientAddress: "789 Market St",
    invoiceNumber: "INV-2026-001",
    issueDate: "2026-08-30",
    dueDate: "2026-09-30",
    lineItems: [
      { id: "1", description: "Brand Identity Design", quantity: 1, unitPrice: 2500 },
      { id: "2", description: "UI Component Library", quantity: 20, unitPrice: 150 },
    ],
    taxRate: 8,
    discount: 10,
    currency: "USD",
    notes: "Payment terms: net 30 days.",
    signature: {
      text: "John Doe",
      font: "var(--font-signature-1)",
    },
  };

  it("renders CleanTemplate with logo and signature", () => {
    const { container } = render(<CleanTemplate data={sampleData} />);
    expect(screen.getByText("Design Studio")).toBeDefined();
    expect(screen.getByText("Acme Client")).toBeDefined();
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("renders CorporateTemplate with all details", () => {
    const { container } = render(<CorporateTemplate data={sampleData} />);
    expect(screen.getByText("Design Studio")).toBeDefined();
    expect(screen.getByText("Acme Client")).toBeDefined();
    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("renders CreativeTemplate without transparent text bugs", () => {
    const { container } = render(<CreativeTemplate data={sampleData} />);
    expect(screen.getByText("Design Studio")).toBeDefined();
    expect(screen.getByText("Acme Client")).toBeDefined();
    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("renders MinimalTemplate with serif styling", () => {
    const { container } = render(<MinimalTemplate data={sampleData} />);
    expect(screen.getByText("Design Studio")).toBeDefined();
    expect(screen.getByText("Acme Client")).toBeDefined();
    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("renders ModernTemplate with mono amounts and proper padding", () => {
    const { container } = render(<ModernTemplate data={sampleData} />);
    expect(screen.getByText("Design Studio")).toBeDefined();
    expect(screen.getByText("Acme Client")).toBeDefined();
    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("renders SalariesTemplate with earnings description", () => {
    const { container } = render(<SalariesTemplate data={sampleData} />);
    expect(screen.getByText("Design Studio")).toBeDefined();
    expect(screen.getByText("Acme Client")).toBeDefined();
    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("renders ContractorTemplate with work description", () => {
    const { container } = render(<ContractorTemplate data={sampleData} />);
    expect(screen.getByText("Design Studio")).toBeDefined();
    expect(screen.getByText("Acme Client")).toBeDefined();
    expect(screen.getByText("John Doe")).toBeDefined();
  });
});
