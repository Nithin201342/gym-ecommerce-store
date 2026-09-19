import { notFound } from "next/navigation";
import { getCategoryBySlug, getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const products = await getProducts({ categorySlug: slug });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">{category.name}</h1>
        {category.description && (
          <p className="mt-1 max-w-2xl text-sm text-neutral-400">
            {category.description}
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-neutral-400 backdrop-blur-xl">
          No products in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
