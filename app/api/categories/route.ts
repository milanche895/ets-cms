import { fail, readJson } from "@/lib/api";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { categorySchema } from "@/lib/schemas";
import { slugify } from "@/lib/slug";
import { createCategory, getCategories } from "@/services/categories";

export async function GET() {
  const categories = await getCategories();
  return jsonOk({ categories });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const body = await readJson(request, categorySchema);
  if (isResponse(body)) {
    return body;
  }

  const slug = slugify(body.slug || body.name);
  if (!slug) {
    return jsonError("Назив не може да се претвори у слаг.", 400);
  }

  try {
    const category = await createCategory({ name: body.name, slug, description: body.description });
    return jsonOk({ category }, 201);
  } catch (error) {
    return fail(error);
  }
}
