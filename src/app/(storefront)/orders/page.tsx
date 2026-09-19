import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/../auth";
import { getOrdersForUser } from "@/lib/orders";
import { formatCents } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";

const STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    PAID: "bg-emerald-100 text-emerald-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-cyan-100 text-cyan-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-orange-100 text-orange-800",
};

export default async function OrdersPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const orders = await getOrdersForUser(session.user.id);

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Account
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-neutral-950">
                    Order history
                </h1>
                <p className="mt-2 text-neutral-600">
                    Review your purchases and download an invoice for any order.
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-950">
                        No orders yet
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Your completed purchases will appear here.
                    </p>
                    <Link
                        href="/products"
                        className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
                    >
                        Browse products
                    </Link>
                </div>
            ) : (
                <div className="space-y-5">
                    {orders.map((order) => (
                        <article
                            key={order.id}
                            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-start">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                                        Order #{order.id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="mt-1 text-sm text-neutral-600">
                                        {order.createdAt.toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status] ?? "bg-neutral-100 text-neutral-700"}`}
                                    >
                                        {order.status}
                                    </span>
                                    <Link
                                        href={`/orders/${order.id}/invoice`}
                                        className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100"
                                    >
                                        Invoice
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                                                <ProductImage
                                                    src={item.productImageSnapshot ?? undefined}
                                                    alt={item.productNameSnapshot}
                                                    sizes="56px"
                                                />
                                            </div>
                                            <span className="min-w-0 text-neutral-700">
                                                <span className="block truncate">{item.productNameSnapshot}</span>
                                                <span className="text-neutral-500">x{item.quantity}</span>
                                            </span>
                                        </div>
                                        <span className="shrink-0 font-medium text-neutral-950">
                                            {formatCents(item.priceAtPurchaseCents * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-sm font-semibold text-neutral-950">
                                <span>Total</span>
                                <span>{formatCents(order.totalCents)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
