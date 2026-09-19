import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/../auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // proxy.ts already blocks non-admins from /admin at the routing layer —
  // this check is defense-in-depth, and gives this layout the session.
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
