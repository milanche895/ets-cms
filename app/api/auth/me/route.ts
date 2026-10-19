import { jsonError, jsonOk } from "@/lib/json";
import { getSession } from "@/lib/current-user";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return jsonError("Нисте пријављени.", 401);
  }

  return jsonOk({ user: session });
}
