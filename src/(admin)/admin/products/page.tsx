import Link from "next/link";
import { getAdminProducts } from "@/lib/admin";
import { formatCents } from "@/lib/format";
import { ToggleActiveButton } from "@/components/admin/toggle-active-button";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400"
        >
          + New product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-neutral-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 text-white">{p.name}</td>
                <td className="px-4 py-3 text-neutral-400">{p.type}</td>
                <td className="px-4 py-3 text-neutral-400">
                  {p.category.name}
                </td>
                <td className="px-4 py-3 text-neutral-300">
                  {formatCents(p.priceCents)}
                </td>
                <td
                  className={`px-4 py-3 ${
                    p.stock <= 5 ? "text-amber-400" : "text-neutral-300"
                  }`}
                >
                  {p.stock}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.isActive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-neutral-500/15 text-neutral-400"
                    }`}
                  >
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-emerald-400 hover:underline"
                    >
                      Edit
                    </Link>
                    <ToggleActiveButton
                      productId={p.id}
                      isActive={p.isActive}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
