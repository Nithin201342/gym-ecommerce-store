"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
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
      className={`flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-opacity ${isPending ? "opacity-60" : ""
        }`}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-24 sm:w-24"
      >
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 96px, 80px"
            className="object-contain p-1"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-medium text-neutral-950 hover:underline"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-neutral-600">
            {formatCents(product.priceCents)} each
          </p>
          {(product.color || product.size) && (
            <p className="mt-1 text-xs text-neutral-500">
              {[product.color && `Color: ${product.color}`, product.size && `Size: ${product.size}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200">
            <button
              onClick={() => setQuantity(item.quantity - 1)}
              disabled={isPending}
              className="px-3 py-1 text-neutral-700 transition-colors hover:text-neutral-950 disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="flex w-8 items-center justify-center text-sm text-neutral-950">
              {isPending ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" /> : item.quantity}
            </span>
            <button
              onClick={() => setQuantity(item.quantity + 1)}
              disabled={isPending || atMaxStock}
              className="px-3 py-1 text-neutral-700 transition-colors hover:text-neutral-950 disabled:opacity-50"
              aria-label="Increase quantity"
              title={atMaxStock ? "No more stock available" : undefined}
            >
              +
            </button>
          </div>

          <button
            onClick={remove}
            disabled={isPending}
            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
            aria-label={`Remove ${product.name} from cart`}
            title="Remove from cart"
          >
            {isPending ? (
              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-red-400/30 border-t-red-500" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="text-right text-sm font-medium text-neutral-950">
        {formatCents(product.priceCents * item.quantity)}
      </div>
    </div>
  );
}
