import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { pageSchema } from "@/lib/schemas";
import { slugify } from "@/lib/slug";
import { deletePage, getPageById, updatePage } from "@/services/pages";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const { id } = await context.params;
  const body = await readJson(request, pageSchema);
  if (isResponse(body)) {
    return body;
  }

  const slug = slugify(body.slug || body.title);
  if (!slug) {
    return jsonError("Наслов не може да се претвори у слаг.", 400);
  }

  const previous = await getPageById(id);

  try {
    const page = await updatePage(id, {
      title: body.title,
      slug,
      content: body.content,
      featuredImage: body.featuredImage ?? null,
      status: body.status,
      seoTitle: body.seoTitle ?? null,
      seoDescription: body.seoDescription ?? null,
    });
    revalidatePath("/");
    revalidatePath(`/${page.slug}`);
    if (previous && previous.slug !== page.slug) {
      revalidatePath(`/${previous.slug}`);
    }
    return jsonOk({ page });
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
  const previous = await getPageById(id);

  try {
    await deletePage(id);
    revalidatePath("/");
    if (previous) {
      revalidatePath(`/${previous.slug}`);
    }
    return jsonOk({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
