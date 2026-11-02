import { prisma } from "@/lib/prisma";

export type DashboardCounts = {
  connected: boolean;
  articles: number | null;
  categories: number | null;
  users: number | null;
  menus: number | null;
};

const emptyCounts: DashboardCounts = {
  connected: false,
  articles: null,
  categories: null,
  users: null,
  menus: null,
};

export async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const [articles, categories, users, menus] = await Promise.all([
      prisma.article.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.menu.count(),
    ]);

    return { connected: true, articles, categories, users, menus };
  } catch {
    return emptyCounts;
  }
}
