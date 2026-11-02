import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const folder = "ets-cms";

export class CloudinaryConfigError extends Error {
  constructor() {
    super("Cloudinary није подешен.");
  }
}

function client() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return cloudinary;
}

export async function uploadAdminImage(file: Buffer, publicId: string): Promise<{ url: string; publicId: string }> {
  const api = client();
  if (!api) {
    throw new CloudinaryConfigError();
  }

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = api.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
        unique_filename: false,
      },
      (error, uploaded) => {
        if (error || !uploaded) {
          reject(error ?? new Error("Отпремање на Cloudinary није успело."));
          return;
        }
        resolve(uploaded);
      },
    );
    stream.end(file);
  });

  return { url: result.secure_url, publicId: result.public_id };
}

export function publicIdFromCloudinaryUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (parsed.hostname !== "res.cloudinary.com") {
      return null;
    }
    if (cloudName && !parsed.pathname.startsWith(`/${cloudName}/`)) {
      return null;
    }
    const match = parsed.pathname.match(/\/image\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export async function deleteStoredImage(url: string | null | undefined): Promise<void> {
  const publicId = url ? publicIdFromCloudinaryUrl(url) : null;
  if (!publicId) {
    return;
  }
  await deleteAdminImage(publicId).catch(() => undefined);
}

export async function deleteAdminImage(publicId: string): Promise<void> {
  const api = client();
  if (!api || !publicId) {
    return;
  }
  await api.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
}
