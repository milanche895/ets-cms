import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { deleteStoredImage } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireGroupEditor } from "@/lib/require-admin";
import { unionPostSchema } from "@/lib/schemas";
import { schoolGroups, isSchoolGroupId } from "@/lib/school-groups";
import { slugify } from "@/lib/slug";
import { createSchoolGroupPost, getPublishedSchoolGroupPosts, parseEventDate } from "@/services/groups";
import type { UnionPostInput } from "@/services/union";

type RouteContext = { params: Promise<{ key: string }> };

function toInput(
  data: {
    kind: UnionPostInput["kind"];
    title: string;
    excerpt: string;
    content: string;
    featuredImage?: string | null;
    location: string;
    startsAt: string;
    status: UnionPostInput["status"];
    seoTitle?: string | null;
    seoDescription?: string | null;
  },
  slug: string,
): UnionPostInput {
  return {
    kind: data.kind,
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    featuredImage: data.featuredImage ?? null,
    location: data.location,
    startsAt: parseEventDate(data.startsAt),
    status: data.status,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const { key } = await context.params;
  if (!isSchoolGroupId(key)) {
    return jsonError("Непозната организација.", 404);
  }
  const posts = await getPublishedSchoolGroupPosts(key);
  return jsonOk({ posts });
}

export async function POST(request: Request, context: RouteContext) {
  const { key } = await context.params;
  if (!isSchoolGroupId(key)) {
    return jsonError("Непозната организација.", 404);
  }

  const editor = await requireGroupEditor(key);
  if (isResponse(editor)) {
    return editor;
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
    const post = await createSchoolGroupPost(key, toInput(body, slug), editor.id);
    revalidatePath(schoolGroups[key].publicPath);
    revalidatePath(`${schoolGroups[key].publicPath}/${post.slug}`);
    return jsonOk({ post }, 201);
  } catch (error) {
    await deleteStoredImage(body.featuredImage);
    if (error instanceof Error && error.message === "date") {
      return jsonError("Датум није исправан. Унесите га у облику ГГГГ-ММ-ДД.", 400);
    }
    return fail(error);
  }
}
