import { TemplateType } from "./schema";

export const APP_CONFIG = {
  name: "InvoiceKit",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://invoicekit.app",
};

export const INVOICE_TEMPLATES: { value: TemplateType; label: string; description: string }[] = [
  { value: "clean", label: "Clean", description: "Minimalist design with clear hierarchy and generous whitespace." },
  { value: "modern", label: "Modern", description: "Vibrant colors and contemporary layouts for the creative professional." },
  { value: "corporate", label: "Corporate", description: "Structured and formal layout suitable for established businesses." },
  { value: "minimal", label: "Minimal", description: "Strip away the unnecessary. Pure focus on billing details." },
  { value: "contractor", label: "Contractor", description: "Detailed line items and clear terms for service workers." },
  { value: "salaries", label: "Salary/Payslip", description: "Optimized for payroll and monthly employee compensation." },
  { value: "creative", label: "Creative", description: "Bold typography and artistic touches to stand out." },
];

export const DEFAULT_TEMPLATE: TemplateType = "clean";
export const GUEST_TEMPLATES: TemplateType[] = [DEFAULT_TEMPLATE];

const TEMPLATE_SET = new Set<TemplateType>(INVOICE_TEMPLATES.map((template) => template.value));

export const isTemplateType = (value: string | null | undefined): value is TemplateType =>
  typeof value === "string" && TEMPLATE_SET.has(value as TemplateType);

export const isGuestTemplate = (template: TemplateType) => GUEST_TEMPLATES.includes(template);

export const getAvailableTemplates = (isLoggedIn: boolean) =>
  isLoggedIn
    ? INVOICE_TEMPLATES
    : INVOICE_TEMPLATES.filter((template) => isGuestTemplate(template.value));

export const normalizeTemplateForAccess = (
  value: string | null | undefined,
  isLoggedIn: boolean,
): TemplateType => {
  const template = isTemplateType(value) ? value : DEFAULT_TEMPLATE;
  return isLoggedIn || isGuestTemplate(template) ? template : DEFAULT_TEMPLATE;
};

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "AUD", label: "AUD ($)", symbol: "$" },
  { value: "CAD", label: "CAD ($)", symbol: "$" },
];
