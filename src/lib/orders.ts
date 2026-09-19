import "server-only";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

/** Always scope by userId — never let one user fetch another's order by guessing an id. */
export function getOrderForUser(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });
}

/** Return only orders owned by the signed-in customer. */
export function getOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Mark a paid order as fulfilled exactly once. The conditional update makes
 * this safe when the success page and Stripe webhook run at the same time.
 */
export async function fulfillPaidOrder(
  orderId: string,
  paymentIntentId?: string
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.status === "PAID") return false;

  const fulfilled = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { id: orderId, status: { not: "PAID" } },
      data: {
        status: "PAID",
        ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
      },
    });

    if (updated.count === 0) return false;

    for (const item of order.items) {
      const result = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });

      if (result.count === 0) {
        console.warn(
          `Order ${order.id}: could not decrement stock for product ${item.productId} — insufficient stock on hand. Needs manual reconciliation.`
        );
      }
    }

    await tx.cartItem.deleteMany({
      where: { cart: { userId: order.userId } },
    });

    return true;
  });

  if (!fulfilled) return false;

  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return true;
}
