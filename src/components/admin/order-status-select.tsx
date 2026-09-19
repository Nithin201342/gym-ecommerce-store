"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/admin-actions";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: OrderStatus) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next);
      if (result.ok) {
        router.refresh();
      } else {
        setStatus(previous);
      }
    });
  }

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/50 disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-neutral-900">
          {s}
        </option>
      ))}
    </select>
  );
}
