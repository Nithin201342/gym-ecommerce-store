import Link from "next/link";
import { getProducts } from "@/lib/products";
import { Hero } from "@/components/home/hero";
import { AnimatedProductGrid } from "@/components/product/animated-product-grid";

export default async function HomePage() {
  const featured = await getProducts({ featured: true });

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-neutral-950">Featured</h2>
          <Link
            href="/products"
            className="text-sm text-neutral-600 hover:text-neutral-950 hover:underline"
          >
            View all
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-neutral-600">
            No featured products yet — run{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">
              npx prisma db seed
            </code>{" "}
            to load demo data.
          </p>
        ) : (
          <AnimatedProductGrid products={featured} />
        )}
      </section>
    </div>
  );
}
