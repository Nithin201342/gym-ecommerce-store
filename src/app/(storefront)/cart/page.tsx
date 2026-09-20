import Link from "next/link";
import { ShoppingBag, Sparkles, Truck } from "lucide-react";
import { getCurrentUserCart } from "@/lib/cart";
import { getProducts } from "@/lib/products";
import { formatCents } from "@/lib/format";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { ProductCard } from "@/components/product/product-card";

export default async function CartPage() {
    const cart = await getCurrentUserCart();
    const suggestedProducts = await getProducts({ featured: true });

    if (!cart) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-10">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-600">
                            <ShoppingBag size={28} />
                        </div>
                        <h1 className="mt-6 text-3xl font-semibold text-neutral-950">
                            Your cart is waiting for its next upgrade
                        </h1>
                        <p className="mt-3 text-neutral-600">
                            Sign in to keep your gear saved and build a routine that keeps
                            getting stronger.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                href="/login?callbackUrl=/cart"
                                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                            >
                                Browse products
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-neutral-700">
                            <Sparkles size={15} className="text-emerald-400" />
                            Recommended for your routine
                        </div>
                        <div className="grid gap-5 md:grid-cols-3">
                            {suggestedProducts.slice(0, 3).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-10">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-600">
                            <ShoppingBag size={28} />
                        </div>
                        <h1 className="mt-6 text-3xl font-semibold text-neutral-950">
                            Your cart is empty
                        </h1>
                        <p className="mt-3 text-neutral-600">
                            Start with essentials that support recovery, performance, and every
                            day consistency.
                        </p>
                        <Link
                            href="/products"
                            className="mt-8 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400"
                        >
                            Browse products
                        </Link>
                    </div>

                    <div className="mt-12">
                        <div className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-neutral-700">
                            <Sparkles size={15} className="text-emerald-400" />
                            Popular picks
                        </div>
                        <div className="grid gap-5 md:grid-cols-3">
                            {suggestedProducts.slice(0, 3).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const subtotalCents = cart.items.reduce(
        (sum, item) => sum + item.product.priceCents * item.quantity,
        0
    );

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
                        Your bag
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-neutral-950">Cart</h1>
                </div>
                <Link
                    href="/products"
                    className="hidden rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50 sm:inline-flex"
                >
                    Continue shopping
                </Link>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.8fr)_360px]">
                <div className="space-y-4">
                    {cart.items.map((item) => (
                        <CartItemRow key={item.id} item={item} />
                    ))}
                </div>

                <aside className="rounded-[24px] border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-950">Summary</h2>

                    <div className="mt-5 space-y-4 text-sm text-neutral-700">
                        <div className="flex items-center justify-between gap-3">
                            <span>Subtotal</span>
                            <span className="font-medium text-neutral-950">
                                {formatCents(subtotalCents)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span>Shipping</span>
                            <span className="text-emerald-700">Calculated at checkout</span>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-50 p-4 text-sm text-neutral-800">
                        <div className="flex items-center gap-2 font-medium text-emerald-700">
                            <Truck size={16} />
                            Fast delivery
                        </div>
                        <p className="mt-2 text-neutral-700">
                            Free shipping on orders over $75 and easy returns within 30 days.
                        </p>
                    </div>

                    <Link
                        href="/checkout"
                        className="mt-6 block w-full rounded-lg bg-emerald-500 px-6 py-3 text-center text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400"
                    >
                        Proceed to checkout
                    </Link>
                </aside>
            </div>

            <div className="mt-12">
                <div className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-neutral-700">
                    <Sparkles size={15} className="text-emerald-400" />
                    Complete the setup
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    {suggestedProducts.slice(0, 3).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
