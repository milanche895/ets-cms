import { galleryItems } from "@/data/gallery";
import { queryDatabase } from "@/lib/database";
import { mapMedia } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { Media } from "@/types/content";

export async function getMedia(): Promise<Media[]> {
  const rows = await queryDatabase(() => prisma.media.findMany({ orderBy: { createdAt: "desc" } }));
  if (rows === "down") {
    return galleryItems;
  }
  return rows.map(mapMedia);
}

export function isGalleryPhoto(item: Pick<Media, "mimeType" | "filename">): boolean {
  if (!item.mimeType.startsWith("image/")) {
    return false;
  }
  const name = item.filename.toLowerCase();
  return !/(logo|sindikat|unijasprs|^vls|mpn-|site-icon|about-img|about-image|blog-|banner|client|review-)/.test(name);
}

export async function getGalleryImages(): Promise<Media[]> {
  const items = await getMedia();
  return items.filter(isGalleryPhoto);
}

export async function getVideos(): Promise<Media[]> {
  const items = await getMedia();
  return items.filter((item) => item.mimeType.startsWith("video/"));
}

export async function getGalleryPreview(limit = 6): Promise<Media[]> {
  const items = await getGalleryImages();
  return items.slice(0, limit);
}

export async function createMedia(input: {
  filename: string;
  url: string;
  publicId?: string | null;
  alt: string;
  mimeType: string;
  size: number;
  uploadedById: string;
}): Promise<Media> {
  const row = await prisma.media.create({ data: input });
  return mapMedia(row);
}

export async function deleteMedia(id: string): Promise<Media | null> {
  const row = await prisma.media.findUnique({ where: { id } });
  if (!row) {
    return null;
  }
  await prisma.media.delete({ where: { id } });
  return mapMedia(row);
}

