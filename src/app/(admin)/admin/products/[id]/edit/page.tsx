import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/admin";
import { getCategories } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";
import { FadeIn } from "@/components/admin/fade-in";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Edit product</h1>
      <FadeIn>
        <ProductForm categories={categories} initialProduct={product} />
      </FadeIn>
    </div>
  );
}
