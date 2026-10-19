import { jsonError, jsonOk } from "@/lib/json";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$runCommandRaw({ ping: 1 });
    return jsonOk({ database: "ok" });
  } catch {
    return jsonError("База није доступна.", 503);
  }
}
