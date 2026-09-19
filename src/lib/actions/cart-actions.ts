"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireUserId(): Promise<string | ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You need to sign in to do that." };
  }
  return session.user.id;
}

export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (typeof userId !== "string") return userId;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true, isActive: true },
  });

  if (!product || !product.isActive) {
    return { ok: false, error: "This product is no longer available." };
  }

  if (product.stock <= 0) {
    return { ok: false, error: "This product is out of stock." };
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  const nextQuantity = Math.min(
    (existing?.quantity ?? 0) + quantity,
    product.stock
  );

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: nextQuantity },
    create: { cartId: cart.id, productId, quantity: nextQuantity },
  });

  revalidatePath("/cart");
  revalidatePath("/", "layout"); // refreshes the navbar cart count
  return { ok: true };
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (typeof userId !== "string") return userId;

  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true, product: { select: { stock: true } } },
  });

  if (!item || item.cart.userId !== userId) {
    return { ok: false, error: "Cart item not found." };
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: Math.min(quantity, item.product.stock) },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function removeCartItem(
  cartItemId: string
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (typeof userId !== "string") return userId;

  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId) {
    return { ok: false, error: "Cart item not found." };
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return { ok: true };
}
