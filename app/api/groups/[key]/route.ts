import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { deleteStoredImage } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireGroupEditor } from "@/lib/require-admin";
import { unionProfileSchema } from "@/lib/schemas";
import { isSchoolGroupId } from "@/lib/school-groups";
import { getSchoolGroupProfile, updateSchoolGroupProfile } from "@/services/groups";

type RouteContext = { params: Promise<{ key: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { key } = await context.params;
  if (!isSchoolGroupId(key)) {
    return jsonError("Непозната организација.", 404);
  }
  const profile = await getSchoolGroupProfile(key);
  return jsonOk({ profile });
}

export async function PUT(request: Request, context: RouteContext) {
  const { key } = await context.params;
  if (!isSchoolGroupId(key)) {
    return jsonError("Непозната организација.", 404);
  }

  const editor = await requireGroupEditor(key);
  if (isResponse(editor)) {
    return editor;
  }

  const body = await readJson(request, unionProfileSchema);
  if (isResponse(body)) {
    return body;
  }

  const previous = await getSchoolGroupProfile(key);

  try {
    const profile = await updateSchoolGroupProfile(key, {
      ...body,
      logo: body.logo ?? null,
      facebookUrl: body.facebookUrl,
    });
    if (previous.logo && previous.logo !== profile.logo) {
      await deleteStoredImage(previous.logo);
    }
    revalidatePath(key === "parliament" ? "/parlament" : "/aktive");
    return jsonOk({ profile });
  } catch (error) {
    if (body.logo && body.logo !== previous.logo) {
      await deleteStoredImage(body.logo);
    }
    return fail(error);
  }
}
