import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { deleteStoredImage } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireUnionEditor } from "@/lib/require-admin";
import { unionPostSchema } from "@/lib/schemas";
import { slugify } from "@/lib/slug";
import { deleteUnionPost, getUnionPostById, parseEventDate, updateUnionPost } from "@/services/union";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const editor = await requireUnionEditor();
  if (isResponse(editor)) {
    return editor;
  }

  const { id } = await context.params;
  const body = await readJson(request, unionPostSchema);
  if (isResponse(body)) {
    return body;
  }

  const slug = slugify(body.slug || body.title);
  if (!slug) {
    return jsonError("Наслов не може да се претвори у слаг.", 400);
  }

  const previous = await getUnionPostById(id);

  try {
    const post = await updateUnionPost(id, {
      kind: body.kind,
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage ?? null,
      location: body.location,
      startsAt: parseEventDate(body.startsAt),
      status: body.status,
      seoTitle: body.seoTitle ?? null,
      seoDescription: body.seoDescription ?? null,
    });
    revalidatePath("/sindikat");
    revalidatePath(`/sindikat/${post.slug}`);
    if (previous && previous.slug !== post.slug) {
      revalidatePath(`/sindikat/${previous.slug}`);
    }
    if (previous?.featuredImage && previous.featuredImage !== post.featuredImage) {
      await deleteStoredImage(previous.featuredImage);
    }
    return jsonOk({ post });
  } catch (error) {
    if (error instanceof Error && error.message === "date") {
      return jsonError("Датум није исправан. Унесите га у облику ГГГГ-ММ-ДД.", 400);
    }
    return fail(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const editor = await requireUnionEditor();
  if (isResponse(editor)) {
    return editor;
  }

  const { id } = await context.params;
  const previous = await getUnionPostById(id);

  try {
    await deleteUnionPost(id);
    revalidatePath("/sindikat");
    if (previous) {
      revalidatePath(`/sindikat/${previous.slug}`);
      await deleteStoredImage(previous.featuredImage);
    }
    return jsonOk({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
