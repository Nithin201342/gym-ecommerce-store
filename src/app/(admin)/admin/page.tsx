import { getDashboardStats } from "@/lib/admin";
import { formatCents } from "@/lib/format";
import { StatsGrid } from "@/components/admin/stats-grid";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Dashboard</h1>

      <StatsGrid
        totalProducts={stats.totalProducts.toString()}
        totalOrders={stats.totalOrders.toString()}
        revenue={formatCents(stats.revenueCents)}
        lowStockCount={stats.lowStockCount.toString()}
      />
    </div>
  );
}
