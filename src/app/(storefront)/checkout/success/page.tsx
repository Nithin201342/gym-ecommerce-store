import Link from "next/link";
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

  let order = await getOrderForUser(orderId, session.user.id);
  if (!order) notFound();

  // The browser can return from Stripe before the webhook arrives. Verify
  // the session directly so the order is completed even if webhook delivery
  // is delayed or temporarily unavailable.
  if (order.status !== "PAID" && order.stripeSessionId) {
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
      order = await getOrderForUser(orderId, session.user.id);
      if (!order) notFound();
    }
  }

  const isPaid = order.status === "PAID";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <OrderStatusRefresh pending={!isPaid} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${isPaid ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-300"
            }`}
        >
          {isPaid ? "✓" : "…"}
        </div>

        <h1 className="text-2xl font-semibold text-white">
          {isPaid ? "Order confirmed" : "Finishing up your order"}
        </h1>
        <p className="mt-2 text-neutral-400">
          {isPaid
            ? `Thanks, ${order.shippingName.split(" ")[0]} — your order is confirmed.`
            : "Payment is processing. This usually takes just a few seconds."}
        </p>

        <div className="mt-8 space-y-3 text-left">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-300">
                {item.productNameSnapshot}{" "}
                <span className="text-neutral-500">×{item.quantity}</span>
              </span>
              <span className="text-neutral-200">
                {formatCents(item.priceAtPurchaseCents * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-white">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>

        <p className="mt-2 text-xs text-neutral-500">
          Order #{order.id.slice(-8).toUpperCase()} · shipping to{" "}
          {order.shippingAddress}, {order.shippingCity}
        </p>

        <Link
          href="/products"
          className="mt-8 inline-block rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
