import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { getCartItemCount } from "@/lib/cart";

export default async function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cartCount = await getCartItemCount();

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="flex-1">{children}</main>
    </>
  );
}
