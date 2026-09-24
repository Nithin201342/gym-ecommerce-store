import "server-only";
import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";

export const MAX_CART_QUANTITY = 10;

export async function getCurrentUserCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: "asc" },
      },
    },
  });
}

export type CartWithItems = NonNullable<
  Awaited<ReturnType<typeof getCurrentUserCart>>
>;

export async function getCartItemCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { select: { quantity: true } } },
  });

  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
