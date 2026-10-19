import { fail, readJson } from "@/lib/api";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { userDeleteSchema, userSchema } from "@/lib/schemas";
import { createUser, deleteUser, getUsers } from "@/services/users";

export async function GET() {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const users = await getUsers();
  return jsonOk({ users });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const body = await readJson(request, userSchema);
  if (isResponse(body)) {
    return body;
  }

  try {
    const user = await createUser(body);
    return jsonOk({ user }, 201);
  } catch (error) {
    return fail(error, "Ова е-пошта је већ заузета.");
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const body = await readJson(request, userDeleteSchema);
  if (isResponse(body)) {
    return body;
  }

  try {
    await deleteUser(body.id, admin.id);
    return jsonOk({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "self") {
      return jsonError("Не можете да обришете сопствени налог.", 400);
    }
    return fail(error);
  }
}
