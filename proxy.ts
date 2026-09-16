import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, decryptSession } from "@/lib/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptSession(token);

  if (pathname.startsWith("/admin") && !isLogin && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLogin && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
