"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
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
  const [isRemoving, setIsRemoving] = useState(false);
  const [quantity, setQuantityValue] = useState(item.quantity);
  const confirmedQuantity = useRef(item.quantity);
  const desiredQuantity = useRef(item.quantity);
  const savingQuantity = useRef(false);
  const { product } = item;
  const image = product.images[0];
  const atMaxStock = quantity >= product.stock;

  function dispatchCartChange(quantityDelta: number) {
    window.dispatchEvent(new CustomEvent("novafit:cart-count", { detail: quantityDelta }));
    window.dispatchEvent(
      new CustomEvent("novafit:cart-subtotal", {
        detail: product.priceCents * quantityDelta,
      })
    );
  }

  function persistQuantity() {
    if (savingQuantity.current) return;
    savingQuantity.current = true;

    void (async () => {
      try {
        while (desiredQuantity.current !== confirmedQuantity.current) {
          const targetQuantity = desiredQuantity.current;
          let result: Awaited<ReturnType<typeof updateCartItemQuantity>>;

          try {
            result = await updateCartItemQuantity(item.id, targetQuantity);
          } catch {
            result = { ok: false, error: "Could not update your cart." };
          }

          if (result.ok) {
            confirmedQuantity.current = targetQuantity;
            continue;
          }

          if (desiredQuantity.current !== targetQuantity) continue;

          const rollbackDelta = confirmedQuantity.current - targetQuantity;
          desiredQuantity.current = confirmedQuantity.current;
          setQuantityValue(confirmedQuantity.current);
          dispatchCartChange(rollbackDelta);
        }
      } finally {
        savingQuantity.current = false;
        if (desiredQuantity.current !== confirmedQuantity.current) {
          persistQuantity();
        }
      }
    })();
  }

  function setQuantity(next: number) {
    const nextQuantity = Math.max(0, Math.min(next, product.stock));
    const delta = nextQuantity - quantity;
    desiredQuantity.current = nextQuantity;
    setQuantityValue(nextQuantity);
    dispatchCartChange(delta);
    persistQuantity();
  }

  function remove() {
    setIsRemoving(true);
    window.dispatchEvent(new CustomEvent("novafit:cart-count", { detail: -quantity }));
    startTransition(async () => {
      try {
        const result = await removeCartItem(item.id);
        if (result.ok) return;
      } catch {
        setIsRemoving(false);
        window.dispatchEvent(new CustomEvent("novafit:cart-count", { detail: quantity }));
        return;
      }

      setIsRemoving(false);
      window.dispatchEvent(new CustomEvent("novafit:cart-count", { detail: quantity }));
    });
  }

  return (
    <div
      className="flex gap-4 rounded-2xl border border-neutral-200 bg-[#fbfcf8] p-4 shadow-sm"
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
          {product.stock <= 5 ? (
            <p
              role="alert"
              className={`mt-2 text-xs font-semibold ${product.stock === 0 ? "text-red-700" : "text-amber-800"}`}
            >
              {product.stock === 0
                ? "Out of stock"
                : `Low stock: only ${product.stock} left`}
            </p>
          ) : (
            <p className="mt-2 text-xs text-neutral-500">{product.stock} in stock</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200">
            <button
              onClick={() => setQuantity(quantity - 1)}
              className="px-3 py-1 text-neutral-700 transition-colors hover:text-neutral-950 disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="flex w-8 items-center justify-center text-sm text-neutral-950" aria-live="polite">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={atMaxStock}
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
            {isRemoving ? (
              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-red-400/30 border-t-red-500" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="text-right text-sm font-medium text-neutral-950">
        {formatCents(product.priceCents * quantity)}
      </div>
    </div>
  );
}
