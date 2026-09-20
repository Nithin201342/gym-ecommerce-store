"use client";

import { motion, type Variants } from "framer-motion";
import {
  Package,
  ClipboardList,
  DollarSign,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

type Stat = {
  label: string;
  value: string;
  icon: LucideIcon;
  warn?: boolean;
};

export function StatsGrid({
  totalProducts,
  totalOrders,
  revenue,
  lowStockCount,
}: {
  totalProducts: string;
  totalOrders: string;
  revenue: string;
  lowStockCount: string;
}) {
  const stats: Stat[] = [
    { label: "Total products", value: totalProducts, icon: Package },
    { label: "Total orders", value: totalOrders, icon: ClipboardList },
    { label: "Revenue (paid+)", value: revenue, icon: DollarSign },
    {
      label: "Low stock (≤5)",
      value: lowStockCount,
      icon: AlertTriangle,
      warn: lowStockCount !== "0",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={item}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_15px_35px_rgba(17,17,17,0.04)] transition-colors hover:border-neutral-300"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
              {stat.label}
            </p>
            <stat.icon
              className={`h-4 w-4 ${stat.warn ? "text-amber-500" : "text-emerald-600"}`}
            />
          </div>
          <p
            className={`mt-3 text-3xl font-semibold tracking-tight ${stat.warn ? "text-amber-600" : "text-neutral-900"
              }`}
          >
            {stat.value}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
