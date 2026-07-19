import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/auth/login";

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
