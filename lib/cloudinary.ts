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

export async function deleteAdminImage(publicId: string): Promise<void> {
  const api = client();
  if (!api || !publicId) {
    return;
  }
  await api.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
}
