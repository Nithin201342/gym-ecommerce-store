"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Dumbbell,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

function SidebarLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const Icon = link.icon;
        const active =
          pathname === link.href ||
          (link.href !== "/admin" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="relative block"
          >
            {active && (
              <motion.div
                layoutId="admin-active-link"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-emerald-500/15"
              />
            )}
            <span
              className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "text-emerald-400"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-white/10 bg-white/5 p-4 backdrop-blur-xl md:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-semibold text-white">
          <Dumbbell className="h-5 w-5 text-emerald-400" />
          Iron<span className="text-emerald-400">&amp;</span>Fuel
        </Link>
        <p className="mb-4 px-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
          Admin
        </p>
        <SidebarLinks pathname={pathname} />
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-auto flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold text-white">
          <Dumbbell className="h-5 w-5 text-emerald-400" />
          Iron<span className="text-emerald-400">&amp;</span>Fuel
          <span className="text-xs font-normal text-neutral-500">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-neutral-300"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile slide-over */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-neutral-950/95 p-4 backdrop-blur-xl md:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Dumbbell className="h-5 w-5 text-emerald-400" />
                  Admin
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-neutral-300"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-auto flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
