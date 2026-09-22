import "server-only";
import { prisma } from "@/lib/prisma";
import type { ProductType } from "@prisma/client";

const activeProductWhere = { isActive: true } as const;

export function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getProducts(params?: {
  categorySlug?: string;
  type?: ProductType;
  featured?: boolean;
  search?: string;
}) {
  const { categorySlug, type, featured, search } = params ?? {};

  return prisma.product.findMany({
    where: {
      ...activeProductWhere,
      ...(type ? { type } : {}),
      ...(featured ? { isFeatured: true } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, ...activeProductWhere },
    include: {
      category: true,
      equipmentDetails: true,
      supplementDetails: true,
    },
  });
}

export function getProductVariants(variantGroup: string | null) {
  if (!variantGroup) return Promise.resolve([]);

  return prisma.product.findMany({
    where: { variantGroup, ...activeProductWhere },
    select: {
      id: true,
      slug: true,
      name: true,
      color: true,
      size: true,
      images: true,
      stock: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

export type ProductWithDetails = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;

export type ProductListItem = Awaited<ReturnType<typeof getProducts>>[number];
