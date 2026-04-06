import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_SHOP === "false") {
    const path = request.nextUrl.pathname;
    if (path.startsWith("/shop") || path === "/cart" || path.startsWith("/cart/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/shop", "/shop/:path*", "/cart", "/cart/:path*"],
};
