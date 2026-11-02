import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { deleteStoredImage } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { articleSchema } from "@/lib/schemas";
import { slugify } from "@/lib/slug";
import { createArticle, getPublishedArticles, type ArticleInput } from "@/services/articles";

function toInput(data: {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string | null;
  categoryId?: string | null;
  status: ArticleInput["status"];
  seoTitle?: string | null;
  seoDescription?: string | null;
}, slug: string): ArticleInput {
  return {
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    featuredImage: data.featuredImage ?? null,
    categoryId: data.categoryId ?? null,
    status: data.status,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
  };
}

export async function GET() {
  const articles = await getPublishedArticles();
  return jsonOk({ articles });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const body = await readJson(request, articleSchema);
  if (isResponse(body)) {
    return body;
  }

  const slug = slugify(body.slug || body.title);
  if (!slug) {
    return jsonError("Наслов не може да се претвори у слаг.", 400);
  }

  let article;
  try {
    article = await createArticle(toInput(body, slug), admin.id);
  } catch (error) {
    await deleteStoredImage(body.featuredImage);
    return fail(error);
  }

  revalidatePath("/");
  revalidatePath("/vesti");
  revalidatePath(`/vesti/${article.slug}`);
  return jsonOk({ article }, 201);
}
