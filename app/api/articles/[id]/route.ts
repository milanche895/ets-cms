import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { articleSchema } from "@/lib/schemas";
import { slugify } from "@/lib/slug";
import { deleteArticle, getArticleById, updateArticle } from "@/services/articles";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const { id } = await context.params;
  const body = await readJson(request, articleSchema);
  if (isResponse(body)) {
    return body;
  }

  const slug = slugify(body.slug || body.title);
  if (!slug) {
    return jsonError("Наслов не може да се претвори у слаг.", 400);
  }

  const previous = await getArticleById(id);

  try {
    const article = await updateArticle(id, {
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage ?? null,
      categoryId: body.categoryId ?? null,
      status: body.status,
      seoTitle: body.seoTitle ?? null,
      seoDescription: body.seoDescription ?? null,
    });
    revalidatePath("/");
    revalidatePath("/vesti");
    revalidatePath(`/vesti/${article.slug}`);
    if (previous && previous.slug !== article.slug) {
      revalidatePath(`/vesti/${previous.slug}`);
    }
    return jsonOk({ article });
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
  const previous = await getArticleById(id);

  try {
    await deleteArticle(id);
    revalidatePath("/");
    revalidatePath("/vesti");
    if (previous) {
      revalidatePath(`/vesti/${previous.slug}`);
    }
    return jsonOk({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
