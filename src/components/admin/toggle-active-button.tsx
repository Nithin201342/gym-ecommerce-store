"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleProductActive } from "@/lib/actions/admin-actions";
import { Eye, Trash2 } from "lucide-react";

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
      className={`inline-flex items-center justify-center rounded-lg border p-2 transition-all disabled:cursor-not-allowed disabled:opacity-60 ${isActive
        ? "border-red-200 bg-red-50 text-red-600 hover:border-red-400 hover:bg-red-100"
        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100"
        }`}
      aria-label={isActive ? "Hide product" : "Show product"}
      title={isActive ? "Hide product" : "Show product"}
    >
      {isActive ? <Trash2 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}
