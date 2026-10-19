import { jsonError } from "@/lib/json";
import { getSession } from "@/lib/current-user";
import { canAccessAdmin } from "@/lib/roles";
import type { SessionUser } from "@/lib/session";

export async function requireAdmin(): Promise<SessionUser | Response> {
  const session = await getSession();
  if (!session || !canAccessAdmin(session.role)) {
    return jsonError("Нисте пријављени.", 401);
  }
  return session;
}

export function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}
