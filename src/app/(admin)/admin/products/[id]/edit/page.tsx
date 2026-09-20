import { notFound } from "next/navigation";
import { getAdminProductById, getAdminProductChoices } from "@/lib/admin";
import { getCategories } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";
import { FadeIn } from "@/components/admin/fade-in";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, productChoices] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
    getAdminProductChoices(id),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Edit product</h1>
      <FadeIn>
        <ProductForm
          categories={categories}
          productChoices={productChoices}
          initialProduct={product}
        />
      </FadeIn>
    </div>
  );
}
