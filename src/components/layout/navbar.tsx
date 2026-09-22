"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, Search, X } from "lucide-react";
import { NovaFitLogo } from "@/components/brand/novafit-logo";

const CATEGORY_LINKS = [
  { label: "Equipment", href: "/products?type=EQUIPMENT" },
  { label: "Supplements", href: "/products?type=SUPPLEMENT" },
  { label: "Accessories", href: "/products?type=ACCESSORY" },
];

export function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="NovaFit home" className="flex items-center">
          <NovaFitLogo className="h-4 w-16 sm:h-5 sm:w-18 object-cover object-center" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="nav-link text-sm text-neutral-700">Home</Link>
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm text-neutral-700"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/products" className="nav-link text-sm text-neutral-700">About</Link>
          <Link href="/products" aria-label="Search products" className="text-neutral-700 transition-colors hover:text-neutral-950"><Search size={17} /></Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-sm text-neutral-700 transition-colors hover:text-neutral-950"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-neutral-950">
                {cartCount}
              </span>
            )}
          </Link>

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/orders"
                className="hidden text-sm text-neutral-700 transition-colors hover:text-neutral-950 sm:block"
              >
                Orders
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-950"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="hidden rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-100 sm:block"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg border border-neutral-200 p-2 text-neutral-700 md:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="absolute left-0 right-0 top-16 border-t border-neutral-200 bg-white p-4 shadow-lg md:hidden">
            <div className="grid gap-1">
              <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100">
                Home
              </Link>
              {CATEGORY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/products" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100">
                About
              </Link>
              {status === "authenticated" && (
                <Link href="/orders" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100">
                  Orders
                </Link>
              )}
              {status === "authenticated" && session.user.role === "ADMIN" && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100">
                  Admin
                </Link>
              )}
              {status === "authenticated" && (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="mt-2 rounded-lg border border-neutral-200 px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Sign out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
