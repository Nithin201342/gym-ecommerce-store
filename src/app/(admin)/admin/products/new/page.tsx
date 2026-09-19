import { getCategories } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";
import { FadeIn } from "@/components/admin/fade-in";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">New product</h1>
      <FadeIn>
        <ProductForm categories={categories} />
      </FadeIn>
    </div>
  );
}
