import { z } from "zod";

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01),
  unitPrice: z.coerce.number().min(0),
});

export const invoiceSchema = z.object({
  businessName: z.string().optional(),
  businessEmail: z.string().optional(),
  businessAddress: z.string().optional(),
  logoUrl: z.string().optional(),
  
  clientName: z.string().optional(),
  clientEmail: z.string().optional(),
  clientAddress: z.string().optional(),
  
  invoiceNumber: z.string().default("INV-001"),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  
  lineItems: z.array(lineItemSchema).default([]),
  
  taxRate: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  currency: z.string().default("USD"),
  
  notes: z.string().optional(),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;
export type TemplateType = "clean" | "corporate" | "minimal" | "contractor";
