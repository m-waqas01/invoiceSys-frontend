/**
 * Format date to readable form
 * Example: 2025-09-15 → 15 Sep 2025
 */
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format currency
 * Example: 2500 → $2,500.00
 */
export const formatCurrency = (amount) => {
  if (!amount) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Calculate invoice total from items
 * items = [{ quantity, price, tax }]
 */
export const calculateInvoiceTotal = (items = []) => {
  return items.reduce((total, item) => {
    const subtotal = item.quantity * item.price;
    const taxAmount = (subtotal * (item.tax || 0)) / 100;
    return total + subtotal + taxAmount;
  }, 0);
};

/**
 * Get invoice status color (UI helper)
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "green";
    case "partial":
      return "orange";
    case "unpaid":
      return "red";
    default:
      return "gray";
  }
};
