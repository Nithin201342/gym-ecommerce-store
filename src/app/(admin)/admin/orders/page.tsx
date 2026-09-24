import Link from "next/link";
import { getAdminOrders } from "@/lib/admin";
import { formatCents } from "@/lib/format";
import { FadeIn } from "@/components/admin/fade-in";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-neutral-500/15 text-neutral-400",
  PAID: "bg-emerald-500/15 text-emerald-400",
  PROCESSING: "bg-blue-500/15 text-blue-400",
  SHIPPED: "bg-cyan-500/15 text-cyan-400",
  DELIVERED: "bg-emerald-500/15 text-emerald-400",
  CANCELLED: "bg-red-500/15 text-red-400",
  REFUNDED: "bg-amber-500/15 text-amber-400",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Orders</h1>

      <FadeIn className="hidden overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-[0_15px_35px_rgba(17,17,17,0.04)] md:block">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-neutral-200 transition-colors last:border-0 hover:bg-neutral-50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-medium text-emerald-700 hover:underline"
                  >
                    #{o.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {o.user.name ?? o.user.email}
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {formatCents(o.totalCents)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[o.status]}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {o.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </FadeIn>

      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="block rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-emerald-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-emerald-700">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-1 text-sm text-neutral-700">
                  {order.user.name ?? order.user.email}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-sm">
              <span className="font-semibold text-neutral-900">{formatCents(order.totalCents)}</span>
              <span className="text-neutral-500">{order.createdAt.toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
        {orders.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-8 text-center text-sm text-neutral-500">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
