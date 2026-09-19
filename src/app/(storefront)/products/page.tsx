import { getProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import type { ProductType } from "@prisma/client";

const TYPE_LABELS: Record<ProductType, string> = {
  EQUIPMENT: "Equipment",
  SUPPLEMENT: "Supplements",
  ACCESSORY: "Accessories",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const type = params.type as ProductType | undefined;

  const [products, categories] = await Promise.all([
    getProducts({
      type,
      categorySlug: params.category,
      search: params.q,
    }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-950">
          {type ? TYPE_LABELS[type] : "All Products"}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-700">
              Type
            </h2>
            <ul className="mb-6 space-y-1">
              <FilterLink
                href="/products"
                active={!type}
                label="All"
              />
              {(Object.keys(TYPE_LABELS) as ProductType[]).map((t) => (
                <FilterLink
                  key={t}
                  href={`/products?type=${t}`}
                  active={type === t}
                  label={TYPE_LABELS[t]}
                />
              ))}
            </ul>

            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-700">
              Category
            </h2>
            <ul className="space-y-1">
              {categories.map((c) => (
                <FilterLink
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  active={params.category === c.slug}
                  label={c.name}
                />
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-600 shadow-sm">
              No products match these filters yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${active
            ? "bg-emerald-100 text-emerald-800"
            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
          }`}
      >
        {label}
      </Link>
    </li>
  );
}
