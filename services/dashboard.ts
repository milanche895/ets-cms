import { prisma } from "@/lib/prisma";

export type DashboardCounts = {
  connected: boolean;
  pages: number | null;
  articles: number | null;
  categories: number | null;
  media: number | null;
  users: number | null;
  menus: number | null;
};

const emptyCounts: DashboardCounts = {
  connected: false,
  pages: null,
  articles: null,
  categories: null,
  media: null,
  users: null,
  menus: null,
};

export async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const [pages, articles, categories, media, users, menus] = await Promise.all([
      prisma.page.count(),
      prisma.article.count(),
      prisma.category.count(),
      prisma.media.count(),
      prisma.user.count(),
      prisma.menu.count(),
    ]);

    return { connected: true, pages, articles, categories, media, users, menus };
  } catch {
    return emptyCounts;
  }
}
