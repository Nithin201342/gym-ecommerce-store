"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { addToCart } from "@/lib/actions/cart-actions";

export function AddToCartButton({
  productId,
  inStock,
}: {
  productId: string;
  inStock: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-lg border border-neutral-300 bg-neutral-100 px-6 py-3 text-sm font-medium text-neutral-600 sm:w-auto"
      >
        Out of stock
      </button>
    );
  }

  function handleClick() {
    // Adding to cart requires an account — send guests to sign in and back.
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await addToCart(productId, 1);
      if (result.ok) {
        setFeedback({ type: "success", message: "Added to cart ✓" });
      } else {
        setFeedback({ type: "error", message: result.error });
      }
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-all hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {isPending && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-950/30 border-t-neutral-950" />
        )}
        <span>
          {isPending
            ? "Adding..."
            : status !== "authenticated"
              ? "Sign in to add to cart"
              : "Add to cart"}
        </span>
      </button>

      {feedback && (
        <p
          className={`mt-2 text-sm ${feedback.type === "success" ? "text-emerald-400" : "text-red-400"
            }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}
