import { notFound } from "next/navigation";
import { getAdminOrderById } from "@/lib/admin";
import { formatCents } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { FadeIn } from "@/components/admin/fade-in";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-white">
        Order #{order.id.slice(-8).toUpperCase()}
      </h1>

      <FadeIn className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-neutral-400">Customer</p>
          <p className="text-white">{order.user.name ?? order.user.email}</p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </FadeIn>

      <FadeIn className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Items
        </h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-300">
                {item.productNameSnapshot} ×{item.quantity}
              </span>
              <span className="text-neutral-200">
                {formatCents(item.priceAtPurchaseCents * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>
      </FadeIn>

      <FadeIn className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Shipping
        </h2>
        <p className="text-sm text-neutral-300">{order.shippingName}</p>
        <p className="text-sm text-neutral-400">{order.shippingAddress}</p>
        <p className="text-sm text-neutral-400">
          {order.shippingCity}, {order.shippingState} {order.shippingZip}
        </p>
        <p className="text-sm text-neutral-400">{order.shippingCountry}</p>
      </FadeIn>
    </div>
  );
}
