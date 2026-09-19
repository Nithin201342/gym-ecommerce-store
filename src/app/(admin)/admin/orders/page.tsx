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
      <h1 className="mb-6 text-2xl font-semibold text-white">Orders</h1>

      <FadeIn className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-neutral-400">
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
                className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-emerald-400 hover:underline"
                  >
                    #{o.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-300">
                  {o.user.name ?? o.user.email}
                </td>
                <td className="px-4 py-3 text-neutral-300">
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
    </div>
  );
}
