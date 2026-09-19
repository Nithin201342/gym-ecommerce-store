"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Circle, Search } from "lucide-react";

const CATEGORY_LINKS = [
  { label: "Equipment", href: "/products?type=EQUIPMENT" },
  { label: "Supplements", href: "/products?type=SUPPLEMENT" },
  { label: "Accessories", href: "/products?type=ACCESSORY" },
];

export function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-950">
          <Circle size={21} strokeWidth={2.5} className="fill-neutral-950 text-neutral-950" />
          Iron<span className="text-neutral-500">&amp;</span>Fuel
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
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-100"
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
        </div>
      </nav>
    </header>
  );
}
