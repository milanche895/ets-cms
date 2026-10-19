import { revalidatePath } from "next/cache";
import { fail, readJson } from "@/lib/api";
import { jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { settingsSchema } from "@/lib/schemas";
import { getSiteSettings, parseFacts, updateSiteSettings } from "@/services/site";

export async function GET() {
  const settings = await getSiteSettings();
  return jsonOk({ settings });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const body = await readJson(request, settingsSchema);
  if (isResponse(body)) {
    return body;
  }

  try {
    const settings = await updateSiteSettings({
      ...body,
      phoneAlt: body.phoneAlt,
      facebookUrl: body.facebookUrl,
      instagramUrl: body.instagramUrl,
      youtubeUrl: body.youtubeUrl,
      aboutFacts: parseFacts(body.aboutFacts),
    });
    revalidatePath("/", "layout");
    return jsonOk({ settings });
  } catch (error) {
    return fail(error);
  }
}
