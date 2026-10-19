import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, type SessionUser } from "@/lib/session";

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}
