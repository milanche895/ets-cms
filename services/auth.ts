import { compare } from "bcryptjs";
import { canAccessAdmin } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { isAuthConfigured, signSession, type SessionUser } from "@/lib/session";

type LoginResult =
  | { ok: true; token: string; user: SessionUser }
  | { ok: false; status: number; message: string };

export async function loginWithPassword(email: string, password: string): Promise<LoginResult> {
  if (!isAuthConfigured()) {
    return {
      ok: false,
      status: 500,
      message: "Пријава није подешена. У .env фајлу недостаје AUTH_SECRET од најмање 32 знака.",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { ok: false, status: 401, message: "Погрешна е-пошта или лозинка." };
    }

    const passwordMatches = await compare(password, user.passwordHash);
    if (!passwordMatches) {
      return { ok: false, status: 401, message: "Погрешна е-пошта или лозинка." };
    }

    if (!canAccessAdmin(user.role)) {
      return {
        ok: false,
        status: 403,
        message: "Ова улога још нема приступ администрацији.",
      };
    }

    const sessionUser: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = await signSession(sessionUser);
    return { ok: true, token, user: sessionUser };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "База података није доступна. Проверите DATABASE_URL.",
    };
  }
}
