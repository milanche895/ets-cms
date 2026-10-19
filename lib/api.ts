import { Prisma } from "@prisma/client";
import type { ZodType } from "zod";
import { jsonError } from "@/lib/json";

export async function readJson<T>(request: Request, schema: ZodType<T>): Promise<T | Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Подаци нису исправни.", 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Подаци нису исправни.", 400);
  }

  return parsed.data;
}

function databaseUnavailable(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ["P1000", "P1001", "P1017"].includes(error.code);
  }
  return error instanceof Error && /ECONNREFUSED|Can't reach database|db-timeout|timeout/i.test(error.message);
}

export function fail(error: unknown, duplicateMessage = "Овај слаг већ постоји."): Response {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return jsonError(duplicateMessage, 409);
    }
    if (error.code === "P2003") {
      return jsonError("Запис је повезан са другим подацима и не може да се обрише.", 409);
    }
    if (error.code === "P2025") {
      return jsonError("Запис није пронађен.", 404);
    }
  }

  if (databaseUnavailable(error)) {
    return jsonError("База података није доступна. Проверите DATABASE_URL и npm run db:setup.", 503);
  }

  console.error(error);
  return jsonError("Чување није успело.", 500);
}
