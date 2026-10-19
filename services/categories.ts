import { categories } from "@/data/categories";
import { queryDatabase } from "@/lib/database";
import { mapCategory } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { Category } from "@/types/content";

export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
};

export async function getCategories(): Promise<Category[]> {
  const rows = await queryDatabase(() => prisma.category.findMany({ orderBy: { name: "asc" } }));
  if (rows === "down") {
    return categories;
  }
  return rows.map(mapCategory);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const row = await queryDatabase(() => prisma.category.findUnique({ where: { id } }));
  if (row === "down") {
    return categories.find((category) => category.id === id) ?? null;
  }
  return row ? mapCategory(row) : null;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const row = await prisma.category.create({ data: input });
  return mapCategory(row);
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const row = await prisma.category.update({ where: { id }, data: input });
  return mapCategory(row);
}

export async function deleteCategory(id: string): Promise<void> {
  await prisma.category.delete({ where: { id } });
}
