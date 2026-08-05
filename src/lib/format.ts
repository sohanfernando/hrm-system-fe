/** Formats a numeric amount as Sri Lankan Rupees, e.g. "LKR 125,000.50". */
export function formatCurrency(value: string | number): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(amount);
}
