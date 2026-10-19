import { articles } from "@/data/articles";
import { queryDatabase } from "@/lib/database";
import { emptyToNull, mapArticle } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { Article, ContentStatus } from "@/types/content";

const articleInclude = { category: true } as const;

export type ArticleInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  categoryId: string | null;
  status: ContentStatus;
  seoTitle: string | null;
  seoDescription: string | null;
};

function publishedMock(): Article[] {
  return articles
    .filter((article) => article.status === "PUBLISHED")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getPublishedArticles(): Promise<Article[]> {
  const rows = await queryDatabase(() =>
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
    }),
  );

  if (rows === "down") {
    return publishedMock();
  }

  return rows.map(mapArticle);
}

export async function getLatestArticles(limit = 3): Promise<Article[]> {
  const published = await getPublishedArticles();
  return published.slice(0, limit);
}

export async function getAllArticles(): Promise<Article[]> {
  const rows = await queryDatabase(() =>
    prisma.article.findMany({
      include: articleInclude,
      orderBy: { updatedAt: "desc" },
    }),
  );

  if (rows === "down") {
    return [...articles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  return rows.map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const row = await queryDatabase(() =>
    prisma.article.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: articleInclude,
    }),
  );

  if (row === "down") {
    return publishedMock().find((article) => article.slug === slug) ?? null;
  }

  return row ? mapArticle(row) : null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const row = await queryDatabase(() =>
    prisma.article.findUnique({
      where: { id },
      include: articleInclude,
    }),
  );

  if (row === "down") {
    return articles.find((article) => article.id === id) ?? null;
  }

  return row ? mapArticle(row) : null;
}

export async function createArticle(input: ArticleInput, authorId: string): Promise<Article> {
  const row = await prisma.article.create({
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      featuredImage: emptyToNull(input.featuredImage),
      categoryId: emptyToNull(input.categoryId),
      status: input.status,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      seoTitle: emptyToNull(input.seoTitle),
      seoDescription: emptyToNull(input.seoDescription),
      authorId,
    },
    include: articleInclude,
  });

  return mapArticle(row);
}

export async function updateArticle(id: string, input: ArticleInput): Promise<Article> {
  const current = await prisma.article.findUnique({ where: { id } });
  const publishedAt =
    input.status === "PUBLISHED" ? (current?.publishedAt ?? new Date()) : current?.publishedAt ?? null;

  const row = await prisma.article.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      featuredImage: emptyToNull(input.featuredImage),
      categoryId: emptyToNull(input.categoryId),
      status: input.status,
      publishedAt,
      seoTitle: emptyToNull(input.seoTitle),
      seoDescription: emptyToNull(input.seoDescription),
    },
    include: articleInclude,
  });

  return mapArticle(row);
}

export async function deleteArticle(id: string): Promise<void> {
  await prisma.article.delete({ where: { id } });
}
