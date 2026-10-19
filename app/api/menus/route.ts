import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { menuSchema } from "@/lib/schemas";
import { formatMenu, getMenuLines, parseMenu, replaceMainMenu } from "@/services/navigation";

export async function GET() {
  const items = await getMenuLines();
  return jsonOk({ text: formatMenu(items), items });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const body = await readJson(request, menuSchema);
  if (isResponse(body)) {
    return body;
  }

  const items = parseMenu(body.text);
  if (items.length === 0) {
    return jsonError("Унесите бар једну ставку: ознака | /путања", 400);
  }

  try {
    await replaceMainMenu(items);
    revalidatePath("/", "layout");
    return jsonOk({ items });
  } catch (error) {
    return fail(error);
  }
}
