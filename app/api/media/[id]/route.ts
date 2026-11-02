import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { fail } from "@/lib/api";
import { deleteAdminImage } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { deleteMedia } from "@/services/gallery";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const { id } = await context.params;

  try {
    const media = await deleteMedia(id);
    if (!media) {
      return jsonError("Запис није пронађен.", 404);
    }

    if (media.publicId) {
      await deleteAdminImage(media.publicId).catch(() => undefined);
    } else if (media.url.startsWith("/uploads/")) {
      const folder = path.join(process.cwd(), "public", "uploads");
      const target = path.resolve(folder, path.basename(media.url));
      if (target.startsWith(folder)) {
        await unlink(target).catch(() => undefined);
      }
    }

    revalidatePath("/galerija");
    revalidatePath("/");
    return jsonOk({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
