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
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="no-print mb-6 flex items-center justify-between gap-4">
                <p className="text-sm text-neutral-600">Order invoice</p>
                <PrintInvoiceButton />
            </div>

            <article className="invoice-sheet border border-neutral-300 bg-white p-6 text-[11px] text-neutral-900 shadow-sm sm:p-10">
                <header className="flex items-start justify-between border-b-2 border-neutral-700 pb-6">
                    <div>
                        <p className="text-base font-bold italic">NovaFit</p>
                        <p className="mt-1 text-[10px] italic text-neutral-600">Premium training essentials</p>
                        <p className="mt-3 leading-4 text-neutral-600">NovaFit Fitness Store<br />Customer Support: support@novafit.com<br />Online orders and delivery</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-3xl font-bold uppercase tracking-wide text-neutral-500">Invoice</h1>
                        <p className="mt-3">Invoice no: <span className="font-semibold">{order.id.slice(-8).toUpperCase()}</span></p>
                        <p>Date: {order.createdAt.toLocaleDateString()}</p>
                    </div>
                </header>

                <section className="grid gap-6 border-b border-neutral-300 py-6 sm:grid-cols-2">
                    <div>
                        <h2 className="font-bold uppercase">Bill to:</h2>
                        <p className="mt-2">{order.shippingName}</p>
                        <p>{order.shippingAddress}</p>
                        <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                        <p>{order.shippingCountry}</p>
                    </div>
                    <div>
                        <h2 className="font-bold uppercase">Ship to:</h2>
                        <p className="mt-2">{order.shippingName}</p>
                        <p>{order.shippingAddress}</p>
                        <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                        <p>{order.shippingCountry}</p>
                    </div>
                </section>

                <p className="border-b border-neutral-300 py-4 font-bold uppercase">Comments or special instructions:</p>

                <section className="py-6">
                    <div className="grid grid-cols-[1.1fr_1.2fr_1.2fr_1.1fr_1fr_1fr] border border-neutral-400 text-center text-[9px] font-bold uppercase">
                        <span className="border-r border-neutral-400 p-2">Salesperson</span>
                        <span className="border-r border-neutral-400 p-2">P.O. number</span>
                        <span className="border-r border-neutral-400 p-2">Requisitioner</span>
                        <span className="border-r border-neutral-400 p-2">Shipped via</span>
                        <span className="border-r border-neutral-400 p-2">F.O.B. point</span>
                        <span className="p-2">Terms</span>
                    </div>
                    <div className="mt-8 grid grid-cols-[auto_1fr_auto_auto] border border-neutral-400 text-[10px]">
                        <span className="border-r border-neutral-400 p-2 font-bold uppercase">Quantity</span>
                        <span className="border-r border-neutral-400 p-2 text-center font-bold uppercase">Description</span>
                        <span className="border-r border-neutral-400 p-2 font-bold uppercase">Unit price</span>
                        <span className="p-2 font-bold uppercase">Total</span>
                    </div>
                    <div className="divide-y divide-neutral-300 border-x border-b border-neutral-400">
                        {order.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-[auto_1fr_auto_auto] text-[11px]">
                                <span className="border-r border-neutral-300 px-3 py-4">{item.quantity}</span>
                                <span className="border-r border-neutral-300 px-3 py-4">{item.productNameSnapshot}</span>
                                <span className="border-r border-neutral-300 px-3 py-4">{formatCents(item.priceAtPurchaseCents)}</span>
                                <span className="px-3 py-4">{formatCents(item.priceAtPurchaseCents * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="ml-auto w-full max-w-xs space-y-2 text-[11px]">
                    <div className="flex justify-between border-b border-neutral-300 pb-2">
                        <span>Subtotal</span>
                        <span>{formatCents(order.subtotalCents)}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-300 pb-2">
                        <span>Tax</span>
                        <span>{formatCents(order.taxCents)}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-300 pb-2">
                        <span>Shipping & handling</span>
                        <span>{formatCents(order.shippingFeeCents)}</span>
                    </div>
                    <div className="flex justify-between pt-1 font-bold uppercase">
                        <span>Total due</span>
                        <span>{formatCents(order.totalCents)}</span>
                    </div>
                </section>

                <footer className="mt-8 border border-neutral-400 p-3 text-[10px] leading-4">
                    <p>Make all checks payable to NovaFit.</p>
                    <p>Questions about this invoice? Contact support@novafit.com.</p>
                    <p className="mt-2">Thank you for your business!</p>
                </footer>
            </article>
        </main>
    );
}
