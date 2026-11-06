import { prisma } from "@/lib/prisma";
import { isGalleryPhoto } from "@/services/gallery";

export type DashboardCounts = {
  connected: boolean;
  articles: number | null;
  categories: number | null;
  users: number | null;
  menus: number | null;
  unionPosts: number | null;
  parliamentPosts: number | null;
  aktivPosts: number | null;
  gallery: number | null;
};

const emptyCounts: DashboardCounts = {
  connected: false,
  articles: null,
  categories: null,
  users: null,
  menus: null,
  unionPosts: null,
  parliamentPosts: null,
  aktivPosts: null,
  gallery: null,
};

export async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const [articles, categories, users, menus, unionPosts, parliamentPosts, aktivPosts, media] = await Promise.all([
      prisma.article.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.menu.count(),
      prisma.unionPost.count(),
      prisma.schoolGroupPost.count({ where: { groupKey: "PARLIAMENT" } }),
      prisma.schoolGroupPost.count({ where: { groupKey: "AKTIV" } }),
      prisma.media.findMany({ select: { mimeType: true, filename: true } }),
    ]);
    const gallery = media.filter((item) => isGalleryPhoto(item) || item.mimeType.startsWith("video/")).length;

    return { connected: true, articles, categories, users, menus, unionPosts, parliamentPosts, aktivPosts, gallery };
  } catch {
    return emptyCounts;
  }
}
