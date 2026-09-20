import Link from "next/link";
import { getAdminProducts } from "@/lib/admin";
import { formatCents } from "@/lib/format";
import { ToggleActiveButton } from "@/components/admin/toggle-active-button";
import { FadeIn } from "@/components/admin/fade-in";
import { ProductImage } from "@/components/product/product-image";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400"
        >
          + New product
        </Link>
      </div>

      <FadeIn className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-[0_15px_35px_rgba(17,17,17,0.04)]">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="px-4 py-3 font-medium">Image</th>
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
              <tr
                key={p.id}
                className="border-b border-neutral-200 transition-colors last:border-0 hover:bg-neutral-50"
              >
                <td className="px-4 py-3">
                  {p.images[0] ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                      <ProductImage
                        src={p.images[0]}
                        alt={p.name}
                        sizes="48px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-100 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                      IMG
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                <td className="px-4 py-3 text-neutral-600">{p.type}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {p.category.name}
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {formatCents(p.priceCents)}
                </td>
                <td
                  className={`px-4 py-3 ${p.stock <= 5 ? "text-amber-600" : "text-neutral-700"
                    }`}
                >
                  {p.stock}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${p.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-200 text-neutral-600"
                      }`}
                  >
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
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
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </FadeIn>
    </div>
  );
}
