import Link from "next/link";
import { getCurrentUserCart } from "@/lib/cart";
import { formatCents } from "@/lib/format";
import { computeOrderTotals, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/pricing";
import { ShippingForm } from "@/components/checkout/shipping-form";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;
  const cart = await getCurrentUserCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-neutral-950">Checkout</h1>
        <p className="mt-3 text-neutral-600">
          Your cart is empty — add something before checking out.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const subtotalCents = cart.items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );
  const { shippingFeeCents, taxCents, totalCents } =
    computeOrderTotals(subtotalCents);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-semibold text-neutral-950">Checkout</h1>

      {canceled && (
        <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Checkout was canceled — your cart is still saved.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ShippingForm />

        <div className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-950">
            Order summary
          </h2>

          <ul className="space-y-3">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-neutral-800">
                  {item.product.name}{" "}
                  <span className="text-neutral-600">×{item.quantity}</span>
                </span>
                <span className="font-medium text-neutral-950">
                  {formatCents(item.product.priceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
            <div className="flex justify-between text-neutral-700">
              <span>Subtotal</span>
              <span>{formatCents(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Shipping</span>
              <span>
                {shippingFeeCents === 0
                  ? "Free"
                  : formatCents(shippingFeeCents)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Tax</span>
              <span>{formatCents(taxCents)}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-950">
            <span>Total</span>
            <span>{formatCents(totalCents)}</span>
          </div>

          {shippingFeeCents > 0 && (
            <p className="mt-3 text-xs text-neutral-600">
              Free shipping on orders over{" "}
              {formatCents(FREE_SHIPPING_THRESHOLD_CENTS)}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
