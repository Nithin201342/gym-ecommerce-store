import Link from "next/link";
import { formatCents } from "@/lib/format";
import type { ProductListItem } from "@/lib/products";
import { ProductImage } from "@/components/product/product-image";

export function ProductCard({ product }: { product: ProductListItem }) {
  const image = product.images[0];
  const onSale =
    product.compareAtPriceCents != null &&
    product.compareAtPriceCents > product.priceCents;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <ProductImage
          src={image}
          alt={product.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-neutral-950">
            Sale
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/70 backdrop-blur-sm">
            <span className="text-sm font-medium text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs uppercase tracking-wide text-neutral-500">
          {product.category.name}
        </span>
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
          {product.name}
        </h3>

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-semibold text-neutral-950">
            {formatCents(product.priceCents)}
          </span>
          {onSale && (
            <span className="text-sm text-neutral-500 line-through">
              {formatCents(product.compareAtPriceCents!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
