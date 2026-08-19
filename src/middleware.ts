import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAdminAuthConfigured,
  readAdminSessionCookie,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if (isLoginApi) {
    return NextResponse.next();
  }

  if (!isAdminAuthConfigured()) {
    if (isLoginPage) return NextResponse.next();
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { ok: false, error: "Admin no configurado (ADMIN_USERNAME / ADMIN_PASSWORD)" },
        { status: 503 },
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "config");
    return NextResponse.redirect(url);
  }

  const token = readAdminSessionCookie(request);
  const ok = await verifyAdminSessionToken(token);

  if (isLoginPage) {
    if (ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/eventos";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
