import { getDashboardStats } from "@/lib/admin";
import { formatCents } from "@/lib/format";
import { StatsGrid } from "@/components/admin/stats-grid";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
          Dashboard
        </h1>
      </div>

      <StatsGrid
        totalProducts={stats.totalProducts.toString()}
        totalOrders={stats.totalOrders.toString()}
        revenue={formatCents(stats.revenueCents)}
        lowStockCount={stats.lowStockCount.toString()}
      />
    </div>
  );
}
