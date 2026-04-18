import { InvoiceData, TemplateType } from "@/lib/schema";

export const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

export const toInputDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDefaultInvoiceData = (): InvoiceData => {
  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 14);
  return {
    businessName: "",
    businessEmail: "",
    businessAddress: "",
    logoUrl: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: "INV-001",
    issueDate: toInputDate(issueDate),
    dueDate: toInputDate(dueDate),
    lineItems: [{ id: "item-1", description: "", quantity: 1, unitPrice: 0 }],
    taxRate: 0,
    discount: 0,
    currency: "USD",
    notes: "",
  };
};

export const getLabels = (template: TemplateType) => {
  const defaults = {
    businessSection: "Your Details",
    businessName: "Business / Your Name",
    clientSection: "Client Details",
    clientName: "Client Name",
    clientEmail: "Client Email",
    clientAddress: "Client Address",
    invoiceNumber: "Invoice #",
    issueDate: "Issue Date",
    dueDate: "Due Date",
    lineItemsSection: "Line Items",
    lineItemsDesc: "Description",
    lineItemsQty: "Qty",
    lineItemsPrice: "Price",
    tax: "Tax %",
    discount: "Discount %",
    notesSection: "Notes / Terms",
    notesPlaceholder: "Payment due within 30 days...",
  };

  if (template === "salaries") {
    return {
      ...defaults,
      businessSection: "Employer Details",
      businessName: "Employer Name",
      clientSection: "Employee Details",
      clientName: "Employee Name",
      clientEmail: "Employee Email",
      clientAddress: "Employee Address",
      invoiceNumber: "Payslip #",
      issueDate: "Pay Date",
      dueDate: "Pay Period End",
      lineItemsSection: "Earnings",
      lineItemsDesc: "Earnings Description",
      lineItemsQty: "Qty/Hrs",
      lineItemsPrice: "Rate / Salary",
      tax: "Tax Withheld %",
      discount: "Bonus / Other %",
    };
  }

  if (template === "contractor") {
    return {
      ...defaults,
      lineItemsSection: "Services/Work",
      lineItemsDesc: "Description of Work",
      lineItemsQty: "Hours/Qty",
      lineItemsPrice: "Rate",
    };
  }

  if (template === "creative") {
    return {
      ...defaults,
      clientSection: "Project For",
      lineItemsSection: "Deliverables",
    };
  }

  if (template === "minimal") {
    return {
      ...defaults,
      businessName: "From (Your Name)",
      clientName: "To (Client Name)",
    };
  }

  if (template === "corporate") {
    return {
      ...defaults,
      clientName: "Bill To",
    };
  }

  if (template === "modern") {
    return {
      ...defaults,
      clientSection: "Client Information",
      lineItemsSection: "Services",
      lineItemsDesc: "Service Description",
    };
  }

  return defaults;
};

export const CURRENCIES = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "PKR", label: "Pakistani Rupee (Rs)" },
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "CAD", label: "Canadian Dollar (CA$)" },
  { value: "AUD", label: "Australian Dollar (AU$)" },
  { value: "CHF", label: "Swiss Franc (Fr)" },
  { value: "CNY", label: "Chinese Yuan (¥)" },
  { value: "BRL", label: "Brazilian Real (R$)" },
  { value: "RUB", label: "Russian Ruble (₽)" },
  { value: "KRW", label: "South Korean Won (₩)" },
  { value: "SAR", label: "Saudi Riyal (SR)" },
  { value: "AED", label: "UAE Dirham (AED)" },
  { value: "ZAR", label: "South African Rand (R)" },
  { value: "TRY", label: "Turkish Lira (₺)" },
  { value: "MXN", label: "Mexican Peso ($)" },
  { value: "SGD", label: "Singapore Dollar (S$)" },
  { value: "HKD", label: "Hong Kong Dollar (HK$)" },
  { value: "NZD", label: "New Zealand Dollar (NZ$)" },
  { value: "THB", label: "Thai Baht (฿)" },
  { value: "IDR", label: "Indonesian Rupiah (Rp)" },
  { value: "MYR", label: "Malaysian Ringgit (RM)" },
  { value: "PHP", label: "Philippine Peso (₱)" },
  { value: "VND", label: "Vietnamese Dong (₫)" },
  { value: "EGP", label: "Egyptian Pound (E£)" },
  { value: "NGN", label: "Nigerian Naira (₦)" },
  { value: "KES", label: "Kenyan Shilling (KSh)" },
  { value: "GHS", label: "Ghanaian Cedi (GH₵)" },
  { value: "SEK", label: "Swedish Krona (kr)" },
  { value: "NOK", label: "Norwegian Krone (kr)" },
  { value: "DKK", label: "Danish Krone (kr)" },
  { value: "PLN", label: "Polish Zloty (zł)" },
  { value: "CZK", label: "Czech Koruna (Kč)" },
  { value: "HUF", label: "Hungarian Forint (Ft)" },
  { value: "ILS", label: "Israeli New Shekel (₪)" },
  { value: "TWD", label: "Taiwan New Dollar (NT$)" },
  { value: "CLP", label: "Chilean Peso ($)" },
  { value: "COP", label: "Colombian Peso ($)" },
  { value: "PEN", label: "Peruvian Sol (S/.)" },
  { value: "ARS", label: "Argentine Peso ($)" },
  { value: "BDT", label: "Bangladeshi Taka (৳)" },
  { value: "UAH", label: "Ukrainian Hryvnia (₴)" },
  { value: "RON", label: "Romanian Leu (lei)" },
];

let resolutionCanvas: HTMLCanvasElement | null = null;
let resolutionCtx: CanvasRenderingContext2D | null = null;

/**
 * Resolves modern CSS colors (oklch, oklab, lab, lch, hwb, relative colors)
 * to standard RGB/RGBA strings using a canvas shim.
 * html2canvas/html2pdf does not support modern color spaces, so we must
 * convert them before cloning the document for printing.
 */
export const resolveModernColor = (colorStr: string): string => {
  if (!colorStr) return colorStr;
  
  // Check if the color string contains modern color functions or relative syntax
  const modernPattern = /(oklch|oklab|lab|lch|hwb|from)/;
  if (!modernPattern.test(colorStr)) return colorStr;
  if (typeof document === "undefined") return colorStr;

  try {
    if (!resolutionCanvas) {
      resolutionCanvas = document.createElement("canvas");
      resolutionCanvas.width = 1;
      resolutionCanvas.height = 1;
    }
    if (!resolutionCtx) {
      resolutionCtx = resolutionCanvas.getContext("2d", { willReadFrequently: true });
    }
    if (!resolutionCtx) return colorStr;

    // Clear previous state
    resolutionCtx.clearRect(0, 0, 1, 1);
    resolutionCtx.fillStyle = colorStr;
    resolutionCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = resolutionCtx.getImageData(0, 0, 1, 1).data;
    
    // If alpha is 255, return simple rgb, otherwise rgba
    if (a === 255) {
      return `rgb(${r}, ${g}, ${b})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${parseFloat((a / 255).toFixed(3))})`;
  } catch (e) {
    console.warn("Failed to resolve modern color:", colorStr, e);
    return colorStr;
  }
};
