import { jwtVerify, SignJWT } from "jose";
import { isRole, type Role } from "@/lib/roles";

export const SESSION_COOKIE = "ets_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

function secretKey(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    return null;
  }

  return new TextEncoder().encode(secret);
}

export function isAuthConfigured(): boolean {
  return secretKey() !== null;
}

export async function signSession(user: SessionUser): Promise<string> {
  const secret = secretKey();
  if (!secret) {
    throw new Error("AUTH_SECRET није подешен.");
  }

  return new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  const secret = secretKey();
  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const id = payload.sub;
    const name = payload.name;
    const email = payload.email;

    if (typeof id !== "string" || typeof name !== "string" || typeof email !== "string" || !isRole(payload.role)) {
      return null;
    }

    return { id, name, email, role: payload.role };
  } catch {
    return null;
  }
}
