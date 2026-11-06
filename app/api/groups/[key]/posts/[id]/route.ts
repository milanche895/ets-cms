import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { deleteStoredImage } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireGroupEditor } from "@/lib/require-admin";
import { unionPostSchema } from "@/lib/schemas";
import { isSchoolGroupId, schoolGroups } from "@/lib/school-groups";
import { slugify } from "@/lib/slug";
import { deleteSchoolGroupPost, getSchoolGroupPostById, parseEventDate, updateSchoolGroupPost } from "@/services/groups";

type RouteContext = { params: Promise<{ key: string; id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { key, id } = await context.params;
  if (!isSchoolGroupId(key)) {
    return jsonError("Непозната организација.", 404);
  }

  const editor = await requireGroupEditor(key);
  if (isResponse(editor)) {
    return editor;
  }

  const existing = await getSchoolGroupPostById(id);
  if (!existing || existing.groupId !== key) {
    return jsonError("Објава није пронађена.", 404);
  }

  const body = await readJson(request, unionPostSchema);
  if (isResponse(body)) {
    return body;
  }

  const slug = slugify(body.slug || body.title);
  if (!slug) {
    return jsonError("Наслов не може да се претвори у слаг.", 400);
  }

  try {
    const post = await updateSchoolGroupPost(id, {
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
    const base = schoolGroups[key].publicPath;
    revalidatePath(base);
    revalidatePath(`${base}/${post.slug}`);
    if (existing.slug !== post.slug) {
      revalidatePath(`${base}/${existing.slug}`);
    }
    if (existing.featuredImage && existing.featuredImage !== post.featuredImage) {
      await deleteStoredImage(existing.featuredImage);
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
  const { key, id } = await context.params;
  if (!isSchoolGroupId(key)) {
    return jsonError("Непозната организација.", 404);
  }

  const editor = await requireGroupEditor(key);
  if (isResponse(editor)) {
    return editor;
  }

  const existing = await getSchoolGroupPostById(id);
  if (!existing || existing.groupId !== key) {
    return jsonError("Објава није пронађена.", 404);
  }

  try {
    await deleteSchoolGroupPost(id);
    revalidatePath(schoolGroups[key].publicPath);
    revalidatePath(`${schoolGroups[key].publicPath}/${existing.slug}`);
    await deleteStoredImage(existing.featuredImage);
    return jsonOk({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
