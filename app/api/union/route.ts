import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { deleteStoredImage } from "@/lib/cloudinary";
import { jsonOk } from "@/lib/json";
import { isResponse, requireUnionEditor } from "@/lib/require-admin";
import { unionProfileSchema } from "@/lib/schemas";
import { getUnionProfile, updateUnionProfile } from "@/services/union";

export async function GET() {
  const profile = await getUnionProfile();
  return jsonOk({ profile });
}

export async function PUT(request: Request) {
  const editor = await requireUnionEditor();
  if (isResponse(editor)) {
    return editor;
  }

  const body = await readJson(request, unionProfileSchema);
  if (isResponse(body)) {
    return body;
  }

  const previous = await getUnionProfile();

  try {
    const profile = await updateUnionProfile({
      ...body,
      logo: body.logo ?? null,
      facebookUrl: body.facebookUrl,
    });
    if (previous.logo && previous.logo !== profile.logo) {
      await deleteStoredImage(previous.logo);
    }
    revalidatePath("/sindikat");
    return jsonOk({ profile });
  } catch (error) {
    if (body.logo && body.logo !== previous.logo) {
      await deleteStoredImage(body.logo);
    }
    return fail(error);
  }
}
