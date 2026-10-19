import { mainNavigation } from "@/data/navigation";
import { quickLinks } from "@/data/quickLinks";
import { queryDatabase } from "@/lib/database";
import { prisma } from "@/lib/prisma";
import type { NavItem, QuickLink } from "@/types/content";

export async function getMainNavigation(): Promise<NavItem[]> {
  const menu = await queryDatabase(() =>
    prisma.menu.findUnique({
      where: { slug: "glavni" },
      include: { items: { orderBy: { sortOrder: "asc" } } },
    }),
  );

  if (menu === "down" || !menu) {
    return mainNavigation;
  }

  const items = menu.items.filter((item) => item.enabled).map((item) => ({ label: item.label, href: item.href }));
  return items.length > 0 ? items : mainNavigation;
}

export async function getQuickLinks(): Promise<QuickLink[]> {
  return quickLinks;
}

export type MenuLine = {
  label: string;
  href: string;
};

export async function getMenuLines(): Promise<MenuLine[]> {
  const items = await getMainNavigation();
  return items;
}

export function parseMenu(value: string): MenuLine[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: label.trim(), href: rest.join("|").trim() };
    })
    .filter((item) => item.label && item.href);
}

export function formatMenu(items: MenuLine[]): string {
  return items.map((item) => `${item.label} | ${item.href}`).join("\n");
}

export async function replaceMainMenu(items: MenuLine[]): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const menu = await tx.menu.upsert({
      where: { slug: "glavni" },
      update: { name: "Главни мени" },
      create: { name: "Главни мени", slug: "glavni" },
    });
    await tx.menuItem.deleteMany({ where: { menuId: menu.id } });
    await tx.menuItem.createMany({
      data: items.map((item, index) => ({
        label: item.label,
        href: item.href,
        sortOrder: index,
        menuId: menu.id,
      })),
    });
  });
}
