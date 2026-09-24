import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { auth } from "@/../auth";
import { fulfillPaidOrder, getOrderForUser } from "@/lib/orders";
import { formatCents } from "@/lib/format";
import { OrderStatusRefresh } from "@/components/checkout/order-status-refresh";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const session = await auth();

  if (!orderId || !session?.user?.id) notFound();

  const initialOrder = await getOrderForUser(orderId, session.user.id);
  if (!initialOrder) notFound();
  let order = initialOrder as NonNullable<typeof initialOrder>;

  // The browser can return from Stripe before the webhook arrives. Verify
  // the session directly so the order is completed even if webhook delivery
  // is delayed or temporarily unavailable.
  if (order.status !== "PAID" && order.stripeSessionId) {
    try {
      const stripeSession = await getStripe().checkout.sessions.retrieve(
        order.stripeSessionId
      );
      const paymentIntentId =
        typeof stripeSession.payment_intent === "string"
          ? stripeSession.payment_intent
          : stripeSession.payment_intent?.id;

      if (
        stripeSession.metadata?.orderId === order.id &&
        stripeSession.payment_status === "paid"
      ) {
        await fulfillPaidOrder(order.id, paymentIntentId);
        revalidatePath("/", "layout");
        revalidatePath("/cart");
        const refreshedOrder = await getOrderForUser(orderId, session.user.id);
        if (!refreshedOrder) notFound();
        order = refreshedOrder as NonNullable<typeof refreshedOrder>;
      }
    } catch (error) {
      console.error("Unable to verify the paid checkout session:", error);
    }
  }

  const isPaid = order.status === "PAID";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <OrderStatusRefresh pending={!isPaid} />
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${isPaid ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-300"
            }`}
        >
          {isPaid ? "✓" : "…"}
        </div>

        <h1 className="text-2xl font-semibold text-neutral-950">
          {isPaid ? "Order confirmed" : "Finishing up your order"}
        </h1>
        <p className="mt-2 text-neutral-700">
          {isPaid
            ? `Thanks, ${order.shippingName.split(" ")[0]} — your order is confirmed.`
            : "Payment is processing. This usually takes just a few seconds."}
        </p>

        <div className="mt-8 space-y-3 text-left">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-800">
                {item.productNameSnapshot}{" "}
                <span className="text-neutral-600">×{item.quantity}</span>
              </span>
              <span className="font-medium text-neutral-950">
                {formatCents(item.priceAtPurchaseCents * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-950">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>

        <p className="mt-2 text-xs text-neutral-600">
          Order #{order.id.slice(-8).toUpperCase()} · shipping to{" "}
          {order.shippingAddress}, {order.shippingCity}
        </p>

        <Link
          href="/products"
          className="mt-8 inline-block rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
