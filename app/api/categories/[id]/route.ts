import { fail, readJson } from "@/lib/api";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { categorySchema } from "@/lib/schemas";
import { slugify } from "@/lib/slug";
import { deleteCategory, updateCategory } from "@/services/categories";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const { id } = await context.params;
  const body = await readJson(request, categorySchema);
  if (isResponse(body)) {
    return body;
  }

  const slug = slugify(body.slug || body.name);
  if (!slug) {
    return jsonError("Назив не може да се претвори у слаг.", 400);
  }

  try {
    const category = await updateCategory(id, { name: body.name, slug, description: body.description });
    return jsonOk({ category });
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const { id } = await context.params;

  try {
    await deleteCategory(id);
    return jsonOk({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
