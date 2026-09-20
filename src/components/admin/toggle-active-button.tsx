"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleProductActive } from "@/lib/actions/admin-actions";

export function ToggleActiveButton({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await toggleProductActive(productId, !isActive);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isActive ? "Hide" : "Unhide"}
    </button>
  );
}
