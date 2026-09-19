import Link from "next/link";
import { getCurrentUserCart } from "@/lib/cart";
import { formatCents } from "@/lib/format";
import { CartItemRow } from "@/components/cart/cart-item-row";

export default async function CartPage() {
  const cart = await getCurrentUserCart();

  if (!cart) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-white">Your cart</h1>
        <p className="mt-3 text-neutral-400">
          Sign in to view your cart and start adding items.
        </p>
        <Link
          href="/login?callbackUrl=/cart"
          className="mt-6 inline-block rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-white">Your cart</h1>
        <p className="mt-3 text-neutral-400">
          Your cart is empty. Let&apos;s fix that.
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-semibold text-white">Your cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between text-lg">
          <span className="text-neutral-300">Subtotal</span>
          <span className="font-semibold text-white">
            {formatCents(subtotalCents)}
          </span>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          Shipping and tax calculated at checkout.
        </p>

        <Link
          href="/checkout"
          className="mt-6 block w-full rounded-lg bg-emerald-500 px-6 py-3 text-center text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
