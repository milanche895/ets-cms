import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { fail } from "@/lib/api";
import { CloudinaryConfigError, deleteAdminImage, uploadAdminImage } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";
import { createMedia } from "@/services/gallery";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
const maxBytes = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (isResponse(admin)) {
    return admin;
  }

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");

  if (!(file instanceof File)) {
    return jsonError("Изаберите фајл.", 400);
  }
  if (!allowed.has(file.type)) {
    return jsonError("Дозвољене су слике (JPG, PNG, WEBP, GIF) и PDF.", 400);
  }
  if (file.size > maxBytes) {
    return jsonError("Фајл је већи од 8 MB.", 400);
  }

  const extension = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const base = slugify(path.basename(file.name, path.extname(file.name))) || "fajl";
  const filename = `${Date.now()}-${base}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    if (file.type.startsWith("image/")) {
      const uploaded = await uploadAdminImage(bytes, `${Date.now()}-${base}`);
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
        revalidatePath("/galerija");
        revalidatePath("/");
        return jsonOk({ media }, 201);
      } catch (error) {
        await deleteAdminImage(uploaded.publicId).catch(() => undefined);
        throw error;
      }
    }

    const folder = path.join(process.cwd(), "public", "uploads");
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, filename), bytes);
    const media = await createMedia({
      filename,
      url: `/uploads/${filename}`,
      alt,
      mimeType: file.type,
      size: file.size,
      uploadedById: admin.id,
    });
    revalidatePath("/galerija");
    revalidatePath("/");
    return jsonOk({ media }, 201);
  } catch (error) {
    if (error instanceof CloudinaryConfigError) {
      return jsonError("Cloudinary није подешен. Додајте кључеве у .env.", 500);
    }
    return fail(error);
  }
}
