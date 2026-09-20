import { getCategories } from "@/lib/products";
import { getAdminProductChoices } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";
import { FadeIn } from "@/components/admin/fade-in";

export default async function NewProductPage() {
  const [categories, productChoices] = await Promise.all([
    getCategories(),
    getAdminProductChoices(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">New product</h1>
      <FadeIn>
        <ProductForm categories={categories} productChoices={productChoices} />
      </FadeIn>
    </div>
  );
}
