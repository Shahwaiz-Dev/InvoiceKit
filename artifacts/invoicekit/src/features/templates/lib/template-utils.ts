import { InvoiceData } from "@/lib/schema";

export const getTemplateUtils = (data: InvoiceData) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency || 'USD',
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return data.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * (data.taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const discountAmount = subtotal * (data.discount / 100);
    return subtotal + tax - discountAmount;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const discountAmount = subtotal * (data.discount / 100);
  const total = calculateTotal();

  return {
    formatCurrency,
    subtotal,
    tax,
    discountAmount,
    total,
  };
};
