import { jsonError } from "@/lib/json";
import { getSession } from "@/lib/current-user";
import { canAccessAdmin, canManageSite, canManageUnion, type Role } from "@/lib/roles";
import type { SchoolGroupId } from "@/lib/school-groups";
import { schoolGroups } from "@/lib/school-groups";
import type { SessionUser } from "@/lib/session";

export async function requireAdmin(): Promise<SessionUser | Response> {
  const session = await getSession();
  if (!session || !canManageSite(session.role)) {
    return jsonError("Нисте пријављени.", 401);
  }
  return session;
}

export async function requireUnionEditor(): Promise<SessionUser | Response> {
  const session = await getSession();
  if (!session || !canManageUnion(session.role)) {
    return jsonError("Нисте пријављени.", 401);
  }
  return session;
}

export async function requireGroupEditor(group: SchoolGroupId): Promise<SessionUser | Response> {
  const session = await getSession();
  if (!session || !canEditGroup(session.role, group)) {
    return jsonError("Нисте пријављени.", 401);
  }
  return session;
}

export function canEditGroup(role: Role, group: SchoolGroupId): boolean {
  return role === "ADMIN" || role === schoolGroups[group].role;
}

/** Отпремање слика за садржај који корисник сме да мења. */
export async function requireContentEditor(): Promise<SessionUser | Response> {
  const session = await getSession();
  if (!session || !canAccessAdmin(session.role)) {
    return jsonError("Нисте пријављени.", 401);
  }
  return session;
}

export function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}
