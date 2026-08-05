import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE_NAME = "hrm_token";

const PROTECTED_PREFIXES = ["/dashboard", "/departments", "/positions", "/employees", "/payroll"];
const AUTH_ONLY_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE_NAME)?.value);

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isAuthOnlyRoute = AUTH_ONLY_PATHS.includes(pathname);

  if (isProtectedRoute && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnlyRoute && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasToken ? "/dashboard" : "/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/departments/:path*", "/positions/:path*", "/employees/:path*", "/payroll/:path*"],
};
