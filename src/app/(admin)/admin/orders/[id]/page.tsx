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
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">
        Order #{order.id.slice(-8).toUpperCase()}
      </h1>

      <FadeIn className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_15px_35px_rgba(17,17,17,0.04)] sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-neutral-500">Customer</p>
          <p className="text-neutral-900">{order.user.name ?? order.user.email}</p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </FadeIn>

      <FadeIn className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_15px_35px_rgba(17,17,17,0.04)]">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Items
        </h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-600">
                {item.productNameSnapshot} ×{item.quantity}
              </span>
              <span className="text-neutral-700">
                {formatCents(item.priceAtPurchaseCents * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold text-neutral-900">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>
      </FadeIn>

      <FadeIn className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_15px_35px_rgba(17,17,17,0.04)]">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Shipping
        </h2>
        <p className="text-sm text-neutral-700">{order.shippingName}</p>
        <p className="text-sm text-neutral-600">{order.shippingAddress}</p>
        <p className="text-sm text-neutral-600">
          {order.shippingCity}, {order.shippingState} {order.shippingZip}
        </p>
        <p className="text-sm text-neutral-600">{order.shippingCountry}</p>
      </FadeIn>
    </div>
  );
}
