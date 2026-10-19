import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { pageSchema } from "@/lib/schemas";
import { slugify } from "@/lib/slug";
import { createPage, getPages } from "@/services/pages";

export async function GET() {
  const pages = (await getPages()).filter((page) => page.status === "PUBLISHED");
  return jsonOk({ pages });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const body = await readJson(request, pageSchema);
  if (isResponse(body)) {
    return body;
  }

  const slug = slugify(body.slug || body.title);
  if (!slug) {
    return jsonError("Наслов не може да се претвори у слаг.", 400);
  }

  try {
    const page = await createPage(
      {
        title: body.title,
        slug,
        content: body.content,
        featuredImage: body.featuredImage ?? null,
        status: body.status,
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
      },
      admin.id,
    );
    revalidatePath("/");
    revalidatePath(`/${page.slug}`);
    return jsonOk({ page }, 201);
  } catch (error) {
    return fail(error);
  }
}
