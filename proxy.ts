import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccessAdmin } from "@/lib/roles";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * Штити /admin. У фази 1 улази само улога ADMIN.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  const isLoginPage = pathname === "/admin/login";
  const allowed = session ? canAccessAdmin(session.role) : false;

  if (isLoginPage) {
    if (allowed) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!allowed) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
