"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NovaFitLogo } from "@/components/brand/novafit-logo";

const CATEGORY_LINKS = [
  { label: "Equipment", href: "/products?type=EQUIPMENT" },
  { label: "Supplements", href: "/products?type=SUPPLEMENT" },
  { label: "Accessories", href: "/products?type=ACCESSORY" },
];

export function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  return <NavbarView key={cartCount} cartCount={cartCount} />;
}

function NavbarView({ cartCount }: { cartCount: number }) {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [displayCartCount, setDisplayCartCount] = useState(cartCount);
  const pathname = usePathname();

  useEffect(() => {
    function updateCartCount(event: Event) {
      const quantityDelta = (event as CustomEvent<number>).detail;
      setDisplayCartCount((count) => Math.max(0, count + quantityDelta));
    }

    window.addEventListener("novafit:cart-count", updateCartCount);
    return () => window.removeEventListener("novafit:cart-count", updateCartCount);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d9e1d7] bg-[#f4f7f1]/95 backdrop-blur">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="NovaFit home" className="flex items-center">
          <NovaFitLogo className="h-4 w-16 sm:h-5 sm:w-18 object-cover object-center" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="nav-link navbar-control text-sm text-neutral-700">Home</Link>
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link navbar-control text-sm text-neutral-700"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/products" className="nav-link navbar-control text-sm text-neutral-700">About</Link>
          <Link href="/products" aria-label="Search products" className="nav-icon navbar-control inline-flex h-9 w-9 items-center justify-center text-neutral-700"><Search size={17} /></Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-current={pathname === "/cart" ? "page" : undefined}
            className={`nav-link navbar-control relative text-sm ${pathname === "/cart" ? "text-emerald-950" : "text-neutral-700"}`}
          >
            Cart
            {displayCartCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-neutral-950">
                {displayCartCount}
              </span>
            )}
          </Link>

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/orders"
                className="navbar-control hidden px-2 py-2 text-sm text-neutral-700 sm:block"
              >
                Orders
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="navbar-control px-2 py-2 text-sm text-neutral-600"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="navbar-control hidden border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 sm:block"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="navbar-control bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="navbar-control border border-neutral-200 p-2 text-neutral-700 md:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

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
                className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white p-4 shadow-xl md:hidden"
              >
                <div className="mb-6 flex items-center justify-between">
                  <Link href="/" aria-label="NovaFit home" onClick={() => setMobileOpen(false)}>
                    <NovaFitLogo className="h-4 w-16 object-cover object-center" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="navbar-control border border-neutral-200 bg-neutral-50 p-1.5 text-neutral-700"
                    aria-label="Close navigation menu"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="grid gap-1">
                  <Link href="/" onClick={() => setMobileOpen(false)} className="navbar-control w-full px-3 py-2.5 text-sm text-neutral-700">
                    Home
                  </Link>
                  {CATEGORY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="navbar-control w-full px-3 py-2.5 text-sm text-neutral-700"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/products" onClick={() => setMobileOpen(false)} className="navbar-control w-full px-3 py-2.5 text-sm text-neutral-700">
                    About
                  </Link>
                  {status === "authenticated" && (
                    <Link href="/orders" onClick={() => setMobileOpen(false)} className="navbar-control w-full px-3 py-2.5 text-sm text-neutral-700">
                      Orders
                    </Link>
                  )}
                  {status === "authenticated" && session.user.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="navbar-control w-full px-3 py-2.5 text-sm text-neutral-700">
                      Admin
                    </Link>
                  )}
                  {status === "authenticated" && (
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="navbar-control mt-2 w-full border border-neutral-200 px-3 py-2.5 text-left text-sm text-neutral-700"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
