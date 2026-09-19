/**
 * All prices are stored as integer cents in the database (see prisma/schema.prisma
 * for why). This is the ONLY place that should format cents for display — never
 * hand-roll `(cents / 100).toFixed(2)` elsewhere, so currency/locale stays consistent.
 */
export function formatCents(
  cents: number,
  options: { currency?: string; locale?: string } = {}
): string {
  const { currency = "USD", locale = "en-US" } = options;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/** Convert a dollar amount (e.g. from an admin form input) to integer cents. */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}
