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

