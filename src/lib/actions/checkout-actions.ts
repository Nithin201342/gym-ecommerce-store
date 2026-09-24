"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { auth } from "@/../auth";
import { MAX_CART_QUANTITY } from "@/lib/cart";
import { computeOrderTotals } from "@/lib/pricing";
import { shippingSchema, type ShippingInput } from "@/lib/validations/checkout";

type ActionResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string };

export async function createCheckoutSession(
  shipping: ShippingInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You need to sign in to check out." };
  }
  const userId = session.user.id;

  const parsed = shippingSchema.safeParse(shipping);
  if (!parsed.success) {
    return { ok: false, error: "Please check the shipping details and try again." };
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity > MAX_CART_QUANTITY) {
    return {
      ok: false,
      error: `You can only purchase ${MAX_CART_QUANTITY} items at a time. Update your cart to continue.`,
    };
  }

  // Re-validate stock at checkout time — it may have changed since items
  // were added to the cart.
  for (const item of cart.items) {
    if (!item.product.isActive) {
      return {
        ok: false,
        error: `${item.product.name} is no longer available. Remove it from your cart to continue.`,
      };
    }
    if (item.quantity > item.product.stock) {
      return {
        ok: false,
        error: `Only ${item.product.stock} of "${item.product.name}" left in stock. Update the quantity in your cart.`,
      };
    }
  }

  const subtotalCents = cart.items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );
  const { shippingFeeCents, taxCents, totalCents } =
    computeOrderTotals(subtotalCents);

  // Create the order up front as PENDING. The webhook flips it to PAID —
  // this order record is what Stripe's metadata points back to.
  const order = await prisma.order.create({
    data: {
      userId,
      status: "PENDING",
      subtotalCents,
      taxCents,
      shippingFeeCents,
      totalCents,
      ...parsed.data,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          productNameSnapshot: item.product.name,
          productImageSnapshot: item.product.images[0] ?? null,
          quantity: item.quantity,
          priceAtPurchaseCents: item.product.priceCents,
        })),
      },
    },
  });

  const origin = (await headers()).get("origin") ?? process.env.NEXTAUTH_URL;

  const lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string; images?: string[] };
      unit_amount: number;
    };
    quantity: number;
  }> = cart.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
        images: item.product.images[0] ? [item.product.images[0]] : undefined,
      },
      unit_amount: item.product.priceCents,
    },
    quantity: item.quantity,
  }));

  if (shippingFeeCents > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: shippingFeeCents,
      },
      quantity: 1,
    });
  }

  try {
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: session.user.email ?? undefined,
      metadata: { orderId: order.id },
      success_url: `${origin}/checkout/success?orderId=${order.id}`,
      cancel_url: `${origin}/checkout?canceled=1`,
    });

    if (!checkoutSession.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return { ok: true, checkoutUrl: checkoutSession.url };
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    // Clean up the pending order so it doesn't linger as an orphan.
    await prisma.order.delete({ where: { id: order.id } }).catch(() => { });
    return {
      ok: false,
      error: "Something went wrong starting checkout. Please try again.",
    };
  }
}
