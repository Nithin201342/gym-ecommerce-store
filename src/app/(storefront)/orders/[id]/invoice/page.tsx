import { notFound, redirect } from "next/navigation";
import { auth } from "@/../auth";
import { getOrderForUser } from "@/lib/orders";
import { formatCents } from "@/lib/format";
import { PrintInvoiceButton } from "@/components/orders/print-invoice-button";

export default async function InvoicePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { id } = await params;
    const order = await getOrderForUser(id, session.user.id);
    if (!order) notFound();

    return (
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="no-print mb-6 flex items-center justify-between gap-4">
                <p className="text-sm text-neutral-600">Order invoice</p>
                <PrintInvoiceButton />
            </div>

            <article className="invoice-sheet rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
                <header className="flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 sm:flex-row">
                    <div>
                        <p className="text-xl font-bold text-neutral-950">Iron &amp; Fuel</p>
                        <p className="mt-2 text-sm text-neutral-600">Premium training essentials</p>
                    </div>
                    <div className="sm:text-right">
                        <h1 className="text-2xl font-semibold text-neutral-950">Invoice</h1>
                        <p className="mt-2 text-sm text-neutral-600">
                            #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-neutral-600">
                            {order.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                </header>

                <section className="grid gap-6 border-b border-neutral-200 py-8 text-sm sm:grid-cols-2">
                    <div>
                        <h2 className="font-semibold text-neutral-950">Billed to</h2>
                        <p className="mt-2 text-neutral-700">{order.shippingName}</p>
                        <p className="text-neutral-600">{order.shippingAddress}</p>
                        <p className="text-neutral-600">
                            {order.shippingCity}, {order.shippingState} {order.shippingZip}
                        </p>
                        <p className="text-neutral-600">{order.shippingCountry}</p>
                    </div>
                    <div className="sm:text-right">
                        <h2 className="font-semibold text-neutral-950">Payment status</h2>
                        <p className="mt-2 font-medium text-neutral-700">{order.status}</p>
                    </div>
                </section>

                <section className="py-8">
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-neutral-200 pb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        <span>Item</span>
                        <span>Qty</span>
                        <span>Amount</span>
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {order.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-4 py-4 text-sm text-neutral-700">
                                <span>{item.productNameSnapshot}</span>
                                <span>{item.quantity}</span>
                                <span className="font-medium text-neutral-950">
                                    {formatCents(item.priceAtPurchaseCents * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="ml-auto max-w-xs space-y-3 border-t border-neutral-200 pt-5 text-sm">
                    <div className="flex justify-between text-neutral-600">
                        <span>Subtotal</span>
                        <span>{formatCents(order.subtotalCents)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                        <span>Shipping</span>
                        <span>{formatCents(order.shippingFeeCents)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                        <span>Tax</span>
                        <span>{formatCents(order.taxCents)}</span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold text-neutral-950">
                        <span>Total</span>
                        <span>{formatCents(order.totalCents)}</span>
                    </div>
                </section>
            </article>
        </main>
    );
}
