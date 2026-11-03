import path from "node:path";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fail, readJson } from "@/lib/api";
import { CloudinaryConfigError, deleteAdminImage, uploadAdminImage } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";
import { createMedia } from "@/services/gallery";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBytes = 8 * 1024 * 1024;

const videoSchema = z.object({
  url: z.string().trim().min(1),
  alt: z.string().trim().optional().default(""),
});

function youtubeId(url: string): string | null {
  const match = /(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/.exec(url);
  return match?.[1] ?? null;
}

function refreshGallery() {
  revalidatePath("/");
  revalidatePath("/galerija");
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await readJson(request, videoSchema);
    if (isResponse(body)) {
      return body;
    }
    const id = youtubeId(body.url);
    if (!id) {
      return jsonError("Унесите адресу YouTube снимка.", 400);
    }

    try {
      const media = await createMedia({
        filename: `${id}.youtube`,
        url: `https://www.youtube.com/watch?v=${id}`,
        alt: body.alt,
        mimeType: "video/youtube",
        size: 0,
        uploadedById: admin.id,
      });
      refreshGallery();
      return jsonOk({ media }, 201);
    } catch (error) {
      return fail(error);
    }
  }

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return jsonError("Изаберите слику.", 400);
  }
  if (!allowed.has(file.type)) {
    return jsonError("Дозвољене су слике JPG, PNG, WEBP и GIF.", 400);
  }
  if (file.size > maxBytes) {
    return jsonError("Слика је већа од 8 MB.", 400);
  }

  const extension = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const base = slugify(path.basename(file.name, path.extname(file.name))) || "slika";
  const filename = `${Date.now()}-${base}${extension}`;

  try {
    const uploaded = await uploadAdminImage(Buffer.from(await file.arrayBuffer()), `${Date.now()}-${base}`);
    try {
      const media = await createMedia({
        filename,
        url: uploaded.url,
        publicId: uploaded.publicId,
        alt,
        mimeType: file.type,
        size: file.size,
        uploadedById: admin.id,
      });
      refreshGallery();
      return jsonOk({ media }, 201);
    } catch (error) {
      await deleteAdminImage(uploaded.publicId).catch(() => undefined);
      throw error;
    }
  } catch (error) {
    if (error instanceof CloudinaryConfigError) {
      return jsonError("Cloudinary није подешен. Додајте кључеве у .env.", 500);
    }
    return fail(error);
  }
}
