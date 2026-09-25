import { InvoiceData, TemplateType } from "@/lib/schema";

export const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

export const getNextInvoiceNumber = (lastNumber: string): string => {
  if (!lastNumber) return "INV-001";
  
  // Find the last group of digits in the string
  const match = lastNumber.match(/^(.*?)(\d+)([^\d]*)$/);
  
  if (!match) {
    // If no digits found, just append -001
    return `${lastNumber}-001`;
  }
  
  const [_, prefix, numStr, suffix] = match;
  const nextNum = parseInt(numStr, 10) + 1;
  
  // Preserve leading zeros
  const paddedNum = nextNum.toString().padStart(numStr.length, "0");
  
  return `${prefix}${paddedNum}${suffix}`;
};

export const toInputDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calculateDueDateByTerms = (issueDateStr: string, terms: string): string => {
  if (!issueDateStr) return toInputDate(new Date());
  const date = new Date(issueDateStr);
  if (isNaN(date.getTime())) return issueDateStr;

  if (terms === "Due on receipt") {
    return issueDateStr;
  } else if (terms === "Net 7") {
    date.setDate(date.getDate() + 7);
  } else if (terms === "Net 15") {
    date.setDate(date.getDate() + 15);
  } else if (terms === "Net 30") {
    date.setDate(date.getDate() + 30);
  } else if (terms === "Net 60") {
    date.setDate(date.getDate() + 60);
  }
  return toInputDate(date);
};

export const getDefaultInvoiceData = (): InvoiceData => {
  const issueDate = new Date();
  return {
    businessName: "",
    businessEmail: "",
    businessAddress: "",
    logoUrl: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: "0001",
    issueDate: toInputDate(issueDate),
    dueDate: toInputDate(issueDate),
    terms: "Due on receipt",
    lineItems: [{ id: "item-1", description: "", quantity: 1, unitPrice: 0 }],
    taxRate: 0,
    discount: 0,
    shipping: 0,
    amountPaid: 0,
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
  { value: "USD", label: "USD — US dollar", symbol: "$" },
  { value: "EUR", label: "EUR — Euro", symbol: "€" },
  { value: "GBP", label: "GBP — British pound", symbol: "£" },
  { value: "CAD", label: "CAD — Canadian dollar", symbol: "CA$" },
  { value: "AUD", label: "AUD — Australian dollar", symbol: "AU$" },
  { value: "INR", label: "INR — Indian rupee", symbol: "₹" },
  { value: "PKR", label: "PKR — Pakistani rupee", symbol: "Rs" },
  { value: "JPY", label: "JPY — Japanese yen", symbol: "¥" },
  { value: "CHF", label: "CHF — Swiss franc", symbol: "Fr" },
  { value: "SGD", label: "SGD — Singapore dollar", symbol: "S$" },
  { value: "AED", label: "AED — UAE dirham", symbol: "AED" },
  { value: "SAR", label: "SAR — Saudi riyal", symbol: "SR" },
  { value: "NZD", label: "NZD — New Zealand dollar", symbol: "NZ$" },
  { value: "CNY", label: "CNY — Chinese yuan", symbol: "¥" },
  { value: "BRL", label: "BRL — Brazilian real", symbol: "R$" },
  { value: "ZAR", label: "ZAR — South African rand", symbol: "R" },
  { value: "TRY", label: "TRY — Turkish lira", symbol: "₺" },
  { value: "MXN", label: "MXN — Mexican peso", symbol: "$" },
  { value: "SEK", label: "SEK — Swedish krona", symbol: "kr" },
  { value: "NOK", label: "NOK — Norwegian krone", symbol: "kr" },
];

let resolutionCanvas: HTMLCanvasElement | null = null;

let resolutionCtx: CanvasRenderingContext2D | null = null;

/**
 * Resolves a single modern CSS color (oklch, oklab, lab, lch, hwb) 
 * to standard RGB/RGBA using a canvas shim.
 */
const resolveSingleModernColor = (colorStr: string): string => {
  if (!colorStr) return colorStr;
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
    
    // We try to set the fillStyle. If the browser supports it, it will work.
    // If not, fillStyle will remain its previous value (or default).
    const prevFillStyle = resolutionCtx.fillStyle;
    resolutionCtx.fillStyle = colorStr;
    
    // If setting fillStyle failed (invalid color for this browser's canvas), return original
    if (resolutionCtx.fillStyle === prevFillStyle && colorStr !== prevFillStyle) {
      return colorStr;
    }

    resolutionCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = resolutionCtx.getImageData(0, 0, 1, 1).data;
    
    if (a === 255) {
      return `rgb(${r}, ${g}, ${b})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${parseFloat((a / 255).toFixed(3))})`;
  } catch (e) {
    return colorStr;
  }
};

/**
 * Resolves modern CSS colors (oklch, oklab, lab, lch, hwb, relative colors)
 * to standard RGB/RGBA strings. Handles complex strings like gradients and shadows.
 * html2canvas/html2pdf does not support modern color spaces, so we must
 * convert them before cloning the document for printing.
 */
export const resolveModernColor = (value: string): string => {
  if (!value) return value;
  
  // Check if the string contains modern color functions
  const modernPattern = /(oklch|oklab|lab|lch|hwb|from|color-mix)/;
  if (!modernPattern.test(value)) return value;
  if (typeof document === "undefined") return value;

  try {
    // Regex to find color functions: oklch(...), oklab(...), color-mix(...), etc.
    // Handles one level of nested parentheses (like var() or nested color functions)
    const colorRegex = /(oklch|oklab|lab|lch|hwb|color-mix)\((?:[^()]+|\([^()]*\))*\)/g;
    
    // If it's a simple color string (just the function), resolve it directly
    if (value.match(/^(oklch|oklab|lab|lch|hwb|color-mix)\([^)]+\)$/)) {
      return resolveSingleModernColor(value);
    }

    // If it's a complex string (gradient, box-shadow), replace all occurrences
    return value.replace(colorRegex, (match) => resolveSingleModernColor(match));
  } catch (e) {
    console.warn("Failed to resolve modern color:", value, e);
    return value;
  }
};
