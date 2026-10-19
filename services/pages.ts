import { pages } from "@/data/pages";
import { queryDatabase } from "@/lib/database";
import { emptyToNull, mapPage } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { ContentStatus, Page } from "@/types/content";

export type PageInput = {
  title: string;
  slug: string;
  content: string;
  featuredImage: string | null;
  status: ContentStatus;
  seoTitle: string | null;
  seoDescription: string | null;
};

export async function getPages(): Promise<Page[]> {
  const rows = await queryDatabase(() => prisma.page.findMany({ orderBy: { title: "asc" } }));
  if (rows === "down") {
    return pages;
  }
  return rows.map(mapPage);
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const row = await queryDatabase(() =>
    prisma.page.findFirst({
      where: { slug, status: "PUBLISHED" },
    }),
  );

  if (row === "down") {
    return pages.find((page) => page.slug === slug && page.status === "PUBLISHED") ?? null;
  }

  return row ? mapPage(row) : null;
}

export async function getPageById(id: string): Promise<Page | null> {
  const row = await queryDatabase(() => prisma.page.findUnique({ where: { id } }));
  if (row === "down") {
    return pages.find((page) => page.id === id) ?? null;
  }
  return row ? mapPage(row) : null;
}

export async function createPage(input: PageInput, createdById: string): Promise<Page> {
  const row = await prisma.page.create({
    data: {
      title: input.title,
      slug: input.slug,
      content: input.content,
      featuredImage: emptyToNull(input.featuredImage),
      status: input.status,
      seoTitle: emptyToNull(input.seoTitle),
      seoDescription: emptyToNull(input.seoDescription),
      createdById,
    },
  });
  return mapPage(row);
}

export async function updatePage(id: string, input: PageInput): Promise<Page> {
  const row = await prisma.page.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      content: input.content,
      featuredImage: emptyToNull(input.featuredImage),
      status: input.status,
      seoTitle: emptyToNull(input.seoTitle),
      seoDescription: emptyToNull(input.seoDescription),
    },
  });
  return mapPage(row);
}

export async function deletePage(id: string): Promise<void> {
  await prisma.page.delete({ where: { id } });
}
