import path from "node:path";
import { fail } from "@/lib/api";
import { CloudinaryConfigError, deleteStoredImage, uploadAdminImage } from "@/lib/cloudinary";
import { jsonError, jsonOk } from "@/lib/json";
import { isResponse, requireContentEditor } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBytes = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const admin = await requireContentEditor();
  if (isResponse(admin)) {
    return admin;
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonError("Изаберите слику.", 400);
  }
  if (!allowed.has(file.type)) {
    return jsonError("Дозвољене су слике JPG, PNG, WEBP и GIF.", 400);
  }
  if (file.size > maxBytes) {
    return jsonError("Слика је већа од 8 MB.", 400);
  }

  const base = slugify(path.basename(file.name, path.extname(file.name))) || "slika";

  try {
    const uploaded = await uploadAdminImage(Buffer.from(await file.arrayBuffer()), `${Date.now()}-${base}`);
    return jsonOk({ url: uploaded.url });
  } catch (error) {
    if (error instanceof CloudinaryConfigError) {
      return jsonError("Cloudinary није подешен. Додајте кључеве у .env.", 500);
    }
    return fail(error);
  }
}

export async function DELETE(request: Request) {
  const admin = await requireContentEditor();
  if (isResponse(admin)) {
    return admin;
  }

  let url = "";
  try {
    const body = (await request.json()) as { url?: unknown };
    url = typeof body.url === "string" ? body.url : "";
  } catch {
    return jsonError("Подаци нису исправни.", 400);
  }

  if (!url) {
    return jsonError("Слика није пронађена.", 400);
  }

  await deleteStoredImage(url);
  return jsonOk({ ok: true });
}
