import "server-only";
import { prisma } from "@/lib/prisma";

export function getAdminProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { equipmentDetails: true, supplementDetails: true },
  });
}

export function getAdminProductChoices(excludeId?: string) {
  return prisma.product.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { id: true, name: true, type: true, variantGroup: true },
    orderBy: { name: "asc" },
  });
}

export function getAdminOrders() {
  return prisma.order.findMany({
    include: { items: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getAdminUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getAdminOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { name: true, email: true } } },
  });
}

export async function getDashboardStats() {
  const [totalProducts, totalOrders, revenueOrders, lowStockCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({
        where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
        select: { totalCents: true },
      }),
      prisma.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
    ]);

  const revenueCents = revenueOrders.reduce((sum, o) => sum + o.totalCents, 0);

  return { totalProducts, totalOrders, revenueCents, lowStockCount };
}
