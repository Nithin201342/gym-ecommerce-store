"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { formatCents } from "@/lib/format";
import {
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/actions/cart-actions";
import type { CartWithItems } from "@/lib/cart";

export function CartItemRow({
  item,
}: {
  item: CartWithItems["items"][number];
}) {
  const [isPending, startTransition] = useTransition();
  const { product } = item;
  const image = product.images[0];
  const atMaxStock = item.quantity >= product.stock;

  function setQuantity(next: number) {
    startTransition(async () => {
      await updateCartItemQuantity(item.id, next);
    });
  }

  function remove() {
    startTransition(async () => {
      await removeCartItem(item.id);
    });
  }

  return (
    <div
      className={`flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-opacity ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-900"
      >
        {image && (
          <Image src={image} alt={product.name} fill className="object-cover" />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-medium text-white hover:underline"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-neutral-400">
            {formatCents(product.priceCents)} each
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-lg border border-white/10">
            <button
              onClick={() => setQuantity(item.quantity - 1)}
              disabled={isPending}
              className="px-3 py-1 text-neutral-300 transition-colors hover:text-white disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-sm text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => setQuantity(item.quantity + 1)}
              disabled={isPending || atMaxStock}
              className="px-3 py-1 text-neutral-300 transition-colors hover:text-white disabled:opacity-50"
              aria-label="Increase quantity"
              title={atMaxStock ? "No more stock available" : undefined}
            >
              +
            </button>
          </div>

          <button
            onClick={remove}
            disabled={isPending}
            className="text-xs text-neutral-500 hover:text-red-400"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-right text-sm font-medium text-white">
        {formatCents(product.priceCents * item.quantity)}
      </div>
    </div>
  );
}
