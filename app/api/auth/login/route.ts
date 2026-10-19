import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/json";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { loginWithPassword } from "@/services/auth";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Неисправан захтев.", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Унесите исправну е-пошту и лозинку од најмање 8 знакова.", 400);
  }

  const result = await loginWithPassword(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return jsonError(result.message, result.status);
  }

  const response = jsonOk({
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
  });

  response.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  return response;
}
