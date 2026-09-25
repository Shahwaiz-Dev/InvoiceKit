import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.string().email().safeParse(value).success, {
    message: "Please enter a valid email address",
  });

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().default(""),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative").default(1),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative").default(0),
});

export const baseInvoiceSchema = z
  .object({
    businessName: z.string().trim().default(""),
    businessEmail: optionalEmail,
    businessAddress: z.string().trim().optional(),
    logoUrl: z.string().optional(),
    taxId: z.string().trim().optional(),
    website: z.string().trim().optional(),
    phone: z.string().trim().optional(),

    clientName: z.string().trim().default(""),
    clientEmail: optionalEmail,
    clientAddress: z.string().trim().optional(),

    invoiceNumber: z.string().trim().default("0001"),
    issueDate: z
      .string()
      .regex(dateRegex, "Issue date is required"),
    dueDate: z
      .string()
      .regex(dateRegex, "Due date is required"),

    terms: z.string().optional(),
    lineItems: z.array(lineItemSchema).default([]),

    taxRate: z.coerce.number().min(0, "Tax rate cannot be negative").max(100, "Tax rate cannot exceed 100%").default(0),
    discount: z.coerce.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%").default(0),
    shipping: z.coerce.number().min(0, "Shipping cannot be negative").default(0).optional(),
    amountPaid: z.coerce.number().min(0, "Amount paid cannot be negative").default(0).optional(),
    currency: z.string().min(1).default("USD"),

    notes: z.string().trim().optional(),
    signature: z
      .object({
        text: z.string().trim().optional(),
        font: z.string().optional(),
      })
      .optional(),
  });

export const invoiceSchema = baseInvoiceSchema.refine((data) => !data.dueDate || !data.issueDate || data.dueDate >= data.issueDate, {
    message: "Due date cannot be earlier than issue date",
    path: ["dueDate"],
  });

export type InvoiceData = z.infer<typeof invoiceSchema>;
export type TemplateType = "clean" | "corporate" | "minimal" | "contractor" | "salaries" | "modern" | "creative";

