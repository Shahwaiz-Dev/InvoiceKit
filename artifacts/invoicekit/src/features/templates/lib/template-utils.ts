import { InvoiceData } from "@/lib/schema";

export const getTemplateUtils = (data: InvoiceData) => {
  const safeNumber = (val: unknown, fallback = 0): number => {
    if (val === null || val === undefined || val === "") return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  const formatCurrency = (amount: number) => {
    const safeAmount = safeNumber(amount);
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: data.currency || 'USD',
      }).format(safeAmount);
    } catch {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(safeAmount);
    }
  };

  const lineItems = Array.isArray(data.lineItems) ? data.lineItems : [];

  const calculateSubtotal = () => {
    return lineItems.reduce((acc, item) => {
      const q = safeNumber(item.quantity, 0);
      const p = safeNumber(item.unitPrice, 0);
      return acc + (q * p);
    }, 0);
  };

  const calculateTax = (subtotal: number) => {
    const taxRate = safeNumber(data.taxRate, 0);
    return subtotal * (taxRate / 100);
  };

  const calculateDiscount = (subtotal: number) => {
    const discount = safeNumber(data.discount, 0);
    return subtotal * (discount / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const discountAmount = calculateDiscount(subtotal);
    return subtotal + tax - discountAmount;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const discountAmount = calculateDiscount(subtotal);
  const total = calculateTotal();

  return {
    formatCurrency,
    subtotal,
    tax,
    discountAmount,
    total,
    safeNumber,
  };
};
