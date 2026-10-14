import { auth } from "@/../auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";
  const isBlocked = req.auth?.user?.isBlocked === true;

  if (isBlocked || (isAdminRoute && (!isLoggedIn || !isAdmin))) {
    const response = NextResponse.redirect(new URL("/login", req.nextUrl));
    if (isAdminRoute) {
      response.headers.set("Cache-Control", "private, no-store, no-cache, max-age=0, must-revalidate");
    }
    return response;
  }

  if (req.nextUrl.pathname.startsWith("/checkout") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAdminRoute) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, no-store, no-cache, max-age=0, must-revalidate");
    return response;
  }
});

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};
