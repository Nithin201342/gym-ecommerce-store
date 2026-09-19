/**
 * Flat-rate shipping, no real tax calculation. Good enough to ship a working
 * checkout; swap taxCents for a real provider (Stripe Tax, TaxJar, Avalara)
 * before taking real payments in a jurisdiction that requires collecting it.
 */
const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
const FLAT_SHIPPING_FEE_CENTS = 999;

export function computeOrderTotals(subtotalCents: number) {
  const shippingFeeCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_FEE_CENTS;

  // No tax calculation implemented — placeholder is intentionally 0 rather
  // than a fabricated rate, since a wrong tax number is worse than none.
  const taxCents = 0;

  const totalCents = subtotalCents + shippingFeeCents + taxCents;

  return { subtotalCents, shippingFeeCents, taxCents, totalCents };
}

export { FREE_SHIPPING_THRESHOLD_CENTS };
