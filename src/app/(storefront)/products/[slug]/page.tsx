import { notFound } from "next/navigation";
import { getProductBySlug, getProductVariants, getProducts } from "@/lib/products";
import { formatCents } from "@/lib/format";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductImage } from "@/components/product/product-image";
import { ProductVariantPicker } from "@/components/product/product-variant-picker";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const variants = await getProductVariants(product.variantGroup);
  const relatedProducts = await getProducts({
    categorySlug: product.category.slug,
  });

  const suggestions = relatedProducts
    .filter((item) => item.id !== product.id && item.slug !== product.slug)
    .slice(0, 4);

  const image = product.images[0];
  const onSale =
    product.compareAtPriceCents != null &&
    product.compareAtPriceCents > product.priceCents;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
          <ProductImage
            src={image}
            alt={product.name}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
            priority
          />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wide text-neutral-500">
            {product.category.name}
          </span>
          <h1 className="mt-1 text-3xl font-semibold text-neutral-950">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-neutral-950">
              {formatCents(product.priceCents)}
            </span>
            {onSale && (
              <span className="text-lg text-neutral-500 line-through">
                {formatCents(product.compareAtPriceCents!)}
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-neutral-700">
            {product.description}
          </p>

          <ProductVariantPicker variants={variants} currentSlug={product.slug} />

          {product.type === "ACCESSORY" && (product.color || product.size) && (
            <SpecTable
              title="Available options"
              rows={[
                ["Color", product.color],
                ["Size", product.size],
              ]}
            />
          )}

          {product.type === "ACCESSORY" && product.size && <SizeGuide />}

          <div className="mt-6">
            <AddToCartButton
              productId={product.id}
              inStock={product.stock > 0}
            />
          </div>

          {/* Conditional spec block — equipment and supplements surface
              completely different attributes, driven by the product type. */}
          {product.type === "EQUIPMENT" && product.equipmentDetails && (
            <SpecTable
              title="Equipment Specs"
              rows={[
                ["Material", product.equipmentDetails.material],
                ["Dimensions", product.equipmentDetails.dimensions],
                [
                  "Weight",
                  product.equipmentDetails.weightKg
                    ? `${product.equipmentDetails.weightKg} kg`
                    : null,
                ],
                [
                  "Max user weight",
                  product.equipmentDetails.maxUserWeightKg
                    ? `${product.equipmentDetails.maxUserWeightKg} kg`
                    : null,
                ],
                [
                  "Warranty",
                  product.equipmentDetails.warrantyMonths
                    ? `${product.equipmentDetails.warrantyMonths} months`
                    : null,
                ],
                [
                  "Assembly required",
                  product.equipmentDetails.assemblyRequired ? "Yes" : "No",
                ],
              ]}
            />
          )}

          {product.type === "SUPPLEMENT" && product.supplementDetails && (
            <>
              <SpecTable
                title="Supplement Facts"
                rows={[
                  ["Serving size", product.supplementDetails.servingSize],
                  [
                    "Servings per container",
                    product.supplementDetails.servingsPerContainer?.toString() ??
                    null,
                  ],
                  ["Flavor", product.supplementDetails.flavor],
                  ["Allergen info", product.supplementDetails.allergenInfo],
                ]}
              />

              {product.supplementDetails.nutritionFacts != null && (
                <NutritionFactsBlock
                  facts={
                    product.supplementDetails.nutritionFacts as Record<
                      string,
                      unknown
                    >
                  }
                />
              )}

              {product.supplementDetails.ingredients && (
                <div className="mt-6">
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-700">
                    Ingredients
                  </h2>
                  <p className="text-sm leading-6 text-neutral-700">
                    {product.supplementDetails.ingredients}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-16 border-t border-neutral-200 pt-12">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Build your setup
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                Complete your routine
              </h2>
              <p className="mt-2 max-w-xl text-sm text-neutral-600">
                Pair your selection with more essentials from the {product.category.name.toLowerCase()} collection.
              </p>
            </div>
            <Link
              href={`/category/${product.category.slug}`}
              className="hidden rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50 sm:inline-flex"
            >
              View collection
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {suggestions.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecTable({
  title,
  rows,
}: {
  title: string;
  rows: [string, string | null | undefined][];
}) {
  const visibleRows = rows.filter(([, value]) => value != null && value !== "");
  if (visibleRows.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700">
        {title}
      </h2>
      <dl className="divide-y divide-neutral-200">
        {visibleRows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-6 py-2 text-sm">
            <dt className="text-neutral-600">{label}</dt>
            <dd className="text-right text-neutral-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SizeGuide() {
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700">
        Size guide
      </h2>
      <div className="grid gap-5 text-sm sm:grid-cols-2">
        <div>
          <p className="mb-2 font-medium text-neutral-900">Clothing</p>
          <dl className="divide-y divide-neutral-200 text-neutral-600">
            {[["S", "36-38 in chest"], ["M", "39-41 in chest"], ["L", "42-44 in chest"], ["XL", "45-47 in chest"]].map(([size, measurement]) => (
              <div key={size} className="flex justify-between gap-4 py-1.5">
                <dt>{size}</dt>
                <dd className="text-right">{measurement}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <p className="mb-2 font-medium text-neutral-900">Footwear</p>
          <dl className="divide-y divide-neutral-200 text-neutral-600">
            {[["7", "25 cm"], ["8", "26 cm"], ["9", "27 cm"], ["10", "28 cm"], ["11", "29 cm"]].map(([size, measurement]) => (
              <div key={size} className="flex justify-between gap-4 py-1.5">
                <dt>US {size}</dt>
                <dd className="text-right">{measurement}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

function NutritionFactsBlock({ facts }: { facts: Record<string, unknown> }) {
  const entries = Object.entries(facts).filter(([, v]) => v != null);
  if (entries.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700">
        Nutrition Facts
      </h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {entries.map(([key, value]) => (
          <div key={key} className="rounded-lg bg-neutral-50 p-3">
            <dt className="text-xs capitalize text-neutral-600">
              {key.replace(/_/g, " ")}
            </dt>
            <dd className="text-sm font-medium text-neutral-900">
              {String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
