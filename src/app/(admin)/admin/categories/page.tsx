import { getCategories } from "@/lib/products";
import { CategoryForm } from "@/components/admin/category-form";
import { FadeIn } from "@/components/admin/fade-in";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Categories</h1>

      <div className="mb-8">
        <CategoryForm />
      </div>

      <FadeIn className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_15px_35px_rgba(17,17,17,0.04)]">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr
                key={c.id}
                className="border-b border-neutral-200 transition-colors last:border-0 hover:bg-neutral-50"
              >
                <td className="px-4 py-3 font-medium text-neutral-900">{c.name}</td>
                <td className="px-4 py-3 text-neutral-600">{c.slug}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {c.description ?? "—"}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-neutral-500">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </FadeIn>
    </div>
  );
}
