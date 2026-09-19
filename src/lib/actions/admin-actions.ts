"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { dollarsToCents } from "@/lib/format";
import type { ProductType, OrderStatus } from "@prisma/client";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin(): Promise<true | ActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { ok: false, error: "Admin access required." };
  }
  return true;
}

type EquipmentInput = {
  material?: string;
  dimensions?: string;
  weightKg?: number;
  maxUserWeightKg?: number;
  warrantyMonths?: number;
  assemblyRequired?: boolean;
} | null;

type SupplementInput = {
  servingSize?: string;
  servingsPerContainer?: number;
  flavor?: string;
  ingredients?: string;
  allergenInfo?: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  sugarG?: number;
} | null;

export type ProductActionInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  stock: number;
  type: ProductType;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  equipment: EquipmentInput;
  supplement: SupplementInput;
};

function nutritionFactsFromInput(s: SupplementInput) {
  if (!s) return undefined;
  const facts: Record<string, number> = {};
  if (s.calories != null) facts.calories = s.calories;
  if (s.proteinG != null) facts.protein_g = s.proteinG;
  if (s.carbsG != null) facts.carbs_g = s.carbsG;
  if (s.fatG != null) facts.fat_g = s.fatG;
  if (s.sugarG != null) facts.sugar_g = s.sugarG;
  return Object.keys(facts).length > 0 ? facts : undefined;
}

function supplementCreateData(s: SupplementInput) {
  return {
    servingSize: s?.servingSize,
    servingsPerContainer: s?.servingsPerContainer,
    flavor: s?.flavor,
    ingredients: s?.ingredients,
    allergenInfo: s?.allergenInfo,
    nutritionFacts: nutritionFactsFromInput(s),
  };
}

function validateBasics(input: ProductActionInput): string | null {
  if (!input.name || input.name.trim().length < 2) return "Name is required.";
  if (!input.slug || !/^[a-z0-9-]+$/.test(input.slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens only.";
  }
  if (!input.description || input.description.trim().length < 10) {
    return "Add a longer description.";
  }
  if (!(input.price > 0)) return "Price must be greater than 0.";
  if (!input.categoryId) return "Choose a category.";
  if (input.stock < 0) return "Stock can't be negative.";
  return null;
}

export async function createProduct(
  input: ProductActionInput
): Promise<ActionResult> {
  const check = await requireAdmin();
  if (check !== true) return check;

  const validationError = validateBasics(input);
  if (validationError) return { ok: false, error: validationError };

  const existing = await prisma.product.findUnique({
    where: { slug: input.slug },
  });
  if (existing) {
    return { ok: false, error: "A product with this slug already exists." };
  }

  try {
    await prisma.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        priceCents: dollarsToCents(input.price),
        compareAtPriceCents:
          input.compareAtPrice != null
            ? dollarsToCents(input.compareAtPrice)
            : null,
        images: input.imageUrl ? [input.imageUrl] : [],
        stock: input.stock,
        type: input.type,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
        categoryId: input.categoryId,
        ...(input.type === "EQUIPMENT" && input.equipment
          ? { equipmentDetails: { create: input.equipment } }
          : {}),
        ...(input.type === "SUPPLEMENT" && input.supplement
          ? {
              supplementDetails: {
                create: supplementCreateData(input.supplement),
              },
            }
          : {}),
      },
    });
  } catch (err) {
    console.error("createProduct failed:", err);
    return { ok: false, error: "Something went wrong creating the product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateProduct(
  productId: string,
  input: ProductActionInput
): Promise<ActionResult> {
  const check = await requireAdmin();
  if (check !== true) return check;

  const validationError = validateBasics(input);
  if (validationError) return { ok: false, error: validationError };

  const existing = await prisma.product.findUnique({
    where: { slug: input.slug },
  });
  if (existing && existing.id !== productId) {
    return { ok: false, error: "A different product already uses this slug." };
  }

  try {
    const supplementData = supplementCreateData(input.supplement);

    await prisma.product.update({
      where: { id: productId },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        priceCents: dollarsToCents(input.price),
        compareAtPriceCents:
          input.compareAtPrice != null
            ? dollarsToCents(input.compareAtPrice)
            : null,
        images: input.imageUrl ? [input.imageUrl] : [],
        stock: input.stock,
        type: input.type,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
        categoryId: input.categoryId,
        ...(input.type === "EQUIPMENT" && input.equipment
          ? {
              equipmentDetails: {
                upsert: { create: input.equipment, update: input.equipment },
              },
            }
          : {}),
        ...(input.type === "SUPPLEMENT" && input.supplement
          ? {
              supplementDetails: {
                upsert: { create: supplementData, update: supplementData },
              },
            }
          : {}),
      },
    });
  } catch (err) {
    console.error("updateProduct failed:", err);
    return { ok: false, error: "Something went wrong saving the product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${input.slug}`);
  revalidatePath("/", "layout");
  return { ok: true };
}

// Products are hidden, never hard-deleted — OrderItem still references
// productId for historical orders (see README's notes on this).
export async function toggleProductActive(
  productId: string,
  isActive: boolean
): Promise<ActionResult> {
  const check = await requireAdmin();
  if (check !== true) return check;

  await prisma.product.update({
    where: { id: productId },
    data: { isActive },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function createCategory(input: {
  name: string;
  slug: string;
  description?: string;
}): Promise<ActionResult> {
  const check = await requireAdmin();
  if (check !== true) return check;

  if (!input.name || input.name.trim().length < 2) {
    return { ok: false, error: "Name is required." };
  }
  if (!input.slug || !/^[a-z0-9-]+$/.test(input.slug)) {
    return {
      ok: false,
      error: "Slug must be lowercase letters, numbers, and hyphens only.",
    };
  }

  const existing = await prisma.category.findUnique({
    where: { slug: input.slug },
  });
  if (existing) {
    return { ok: false, error: "A category with this slug already exists." };
  }

  await prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { ok: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult> {
  const check = await requireAdmin();
  if (check !== true) return check;

  await prisma.order.update({ where: { id: orderId }, data: { status } });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}
