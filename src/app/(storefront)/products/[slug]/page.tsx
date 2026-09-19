import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatCents } from "@/lib/format";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductImage } from "@/components/product/product-image";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

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
