import type { Article, Category, ContentStatus, Media, Page, SiteSettings } from "@/types/content";
import type { Article as ArticleRow, Category as CategoryRow, Media as MediaRow, Page as PageRow, SiteSettings as SettingsRow } from "@prisma/client";

export function mapArticle(row: ArticleRow & { category?: CategoryRow | null }): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    featuredImage: row.featuredImage,
    categoryId: row.categoryId ?? "",
    categoryName: row.category?.name ?? "",
    status: row.status,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    authorId: row.authorId,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
}

export function mapPage(row: PageRow & { createdBy?: { id: string } | null }): Page {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    featuredImage: row.featuredImage,
    status: row.status,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    createdBy: row.createdById,
  };
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
  };
}

export function mapMedia(row: MediaRow): Media {
  return {
    id: row.id,
    filename: row.filename,
    url: row.url,
    publicId: row.publicId,
    alt: row.alt,
    mimeType: row.mimeType,
    size: row.size,
    createdAt: row.createdAt.toISOString(),
    uploadedBy: row.uploadedById,
  };
}

export function mapSettings(row: SettingsRow, fallbackFacts: SiteSettings["aboutFacts"]): SiteSettings {
  const facts = Array.isArray(row.aboutFacts)
    ? row.aboutFacts.flatMap((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          return [];
        }
        const record = item as { label?: unknown; value?: unknown };
        if (typeof record.label !== "string" || typeof record.value !== "string") {
          return [];
        }
        return [{ label: record.label, value: record.value }];
      })
    : fallbackFacts;

  return {
    schoolName: row.schoolName,
    shortName: row.shortName,
    nameLine1: row.nameLine1,
    nameLine2: row.nameLine2,
    location: row.location,
    tagline: row.tagline,
    aboutTeaser: row.aboutTeaser,
    aboutFacts: facts.length > 0 ? facts : fallbackFacts,
    address: row.address,
    city: row.city,
    postalCode: row.postalCode,
    phone: row.phone,
    phoneAlt: row.phoneAlt,
    email: row.email,
    facebookUrl: row.facebookUrl,
    instagramUrl: row.instagramUrl,
    youtubeUrl: row.youtubeUrl,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
}

export function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

export function isContentStatus(value: string): value is ContentStatus {
  return value === "DRAFT" || value === "PUBLISHED" || value === "HIDDEN";
}
