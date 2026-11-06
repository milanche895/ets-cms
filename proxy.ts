import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminHome, canAccessAdmin } from "@/lib/roles";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * Штити /admin.
 * Администратор види цео панел. Задужени за синдикат, парламент и активе виде само свој модул.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  const isLoginPage = pathname === "/admin/login";
  const allowed = session ? canAccessAdmin(session.role) : false;
  const home = session ? adminHome(session.role) : "/admin";

  if (isLoginPage) {
    if (allowed) {
      return NextResponse.redirect(new URL(home, request.url));
    }
    return NextResponse.next();
  }

  if (!allowed || !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (home !== "/admin" && pathname !== home && !pathname.startsWith(`${home}/`)) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
