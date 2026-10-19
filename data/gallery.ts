import type { Media } from "@/types/content";
import { schoolMedia } from "@/data/schoolMedia";

/** Школске фотографије. Логотипи и видео остају у медијима, али нису плочице галерије. */
export const galleryItems: Media[] = schoolMedia.filter((item) => {
  if (!item.mimeType.startsWith("image/")) {
    return false;
  }
  const name = item.filename.toLowerCase();
  return !/(logo|sindikat|unijasprs|^vls|mpn-|site-icon|about-img|about-image|blog-|banner|client|review-)/.test(name);
});
