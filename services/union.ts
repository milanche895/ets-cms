import { unionProfile } from "@/data/union";
import { queryDatabase } from "@/lib/database";
import { emptyToNull, mapUnionPost, mapUnionProfile } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { ContentStatus, UnionPost, UnionPostKind, UnionProfile } from "@/types/content";

export type UnionProfileInput = UnionProfile;

export type UnionPostInput = {
  kind: UnionPostKind;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  location: string | null;
  startsAt: Date | null;
  status: ContentStatus;
  seoTitle: string | null;
  seoDescription: string | null;
};

export function parseEventDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error("date");
  }
  const date = new Date(`${trimmed}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("date");
  }
  return date;
}

export function formatEventDate(value: string | null): string {
  if (!value) {
    return "";
  }
  return value.slice(0, 10);
}

function byNewest(a: UnionPost, b: UnionPost): number {
  const left = a.startsAt ?? a.publishedAt ?? a.createdAt;
  const right = b.startsAt ?? b.publishedAt ?? b.createdAt;
  return right.localeCompare(left);
}

export async function getUnionProfile(): Promise<UnionProfile> {
  const row = await queryDatabase(() => prisma.unionProfile.findUnique({ where: { id: "default" } }));
  if (row === "down" || !row) {
    return unionProfile;
  }
  return mapUnionProfile(row);
}

export async function updateUnionProfile(input: UnionProfileInput): Promise<UnionProfile> {
  const data = {
    name: input.name,
    logo: emptyToNull(input.logo),
    summary: input.summary,
    about: input.about,
    presidentName: input.presidentName,
    email: input.email,
    phone: input.phone,
    office: input.office,
    officeHours: input.officeHours,
    membership: input.membership,
    benefits: input.benefits,
    affiliation: input.affiliation,
    facebookUrl: emptyToNull(input.facebookUrl),
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
  };

  const row = await prisma.unionProfile.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return mapUnionProfile(row);
}

export async function getPublishedUnionPosts(): Promise<UnionPost[]> {
  const rows = await queryDatabase(() =>
    prisma.unionPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    }),
  );

  if (rows === "down") {
    return [];
  }

  return rows.map(mapUnionPost).sort(byNewest);
}

export async function getAllUnionPosts(): Promise<UnionPost[]> {
  const rows = await queryDatabase(() => prisma.unionPost.findMany({ orderBy: { updatedAt: "desc" } }));
  if (rows === "down") {
    return [];
  }
  return rows.map(mapUnionPost);
}

export async function getUnionPostBySlug(slug: string): Promise<UnionPost | null> {
  const row = await queryDatabase(() => prisma.unionPost.findFirst({ where: { slug, status: "PUBLISHED" } }));
  if (row === "down" || !row) {
    return null;
  }
  return mapUnionPost(row);
}

export async function getUnionPostById(id: string): Promise<UnionPost | null> {
  const row = await queryDatabase(() => prisma.unionPost.findUnique({ where: { id } }));
  if (row === "down" || !row) {
    return null;
  }
  return mapUnionPost(row);
}

export async function createUnionPost(input: UnionPostInput, authorId: string): Promise<UnionPost> {
  const row = await prisma.unionPost.create({
    data: {
      kind: input.kind,
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      featuredImage: emptyToNull(input.featuredImage),
      location: emptyToNull(input.location),
      startsAt: input.startsAt,
      status: input.status,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      seoTitle: emptyToNull(input.seoTitle),
      seoDescription: emptyToNull(input.seoDescription),
      authorId,
    },
  });

  return mapUnionPost(row);
}

export async function updateUnionPost(id: string, input: UnionPostInput): Promise<UnionPost> {
  const current = await prisma.unionPost.findUnique({ where: { id } });
  const publishedAt = input.status === "PUBLISHED" ? (current?.publishedAt ?? new Date()) : (current?.publishedAt ?? null);

  const row = await prisma.unionPost.update({
    where: { id },
    data: {
      kind: input.kind,
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      featuredImage: emptyToNull(input.featuredImage),
      location: emptyToNull(input.location),
      startsAt: input.startsAt,
      status: input.status,
      publishedAt,
      seoTitle: emptyToNull(input.seoTitle),
      seoDescription: emptyToNull(input.seoDescription),
    },
  });

  return mapUnionPost(row);
}

export async function deleteUnionPost(id: string): Promise<void> {
  await prisma.unionPost.delete({ where: { id } });
}
