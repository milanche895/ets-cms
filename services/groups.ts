import { schoolGroupProfiles } from "@/data/groups";
import { queryDatabase } from "@/lib/database";
import { emptyToNull, mapUnionPost, mapUnionProfile } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { schoolGroups, type SchoolGroupId } from "@/lib/school-groups";
import type { UnionPost, UnionPostKind, UnionProfile } from "@/types/content";
import type { UnionPostInput } from "@/services/union";

export { parseEventDate, formatEventDate } from "@/services/union";

function byNewest(a: UnionPost, b: UnionPost): number {
  const left = a.startsAt ?? a.publishedAt ?? a.createdAt;
  const right = b.startsAt ?? b.publishedAt ?? b.createdAt;
  return right.localeCompare(left);
}

function profileData(input: UnionProfile) {
  return {
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
}

export async function getSchoolGroupProfile(id: SchoolGroupId): Promise<UnionProfile> {
  const group = schoolGroups[id];
  const fallback = schoolGroupProfiles[group.key];
  const row = await queryDatabase(() => prisma.schoolGroup.findUnique({ where: { key: group.key } }));
  if (row === "down" || !row) {
    return fallback;
  }
  return mapUnionProfile(row);
}

export async function updateSchoolGroupProfile(id: SchoolGroupId, input: UnionProfile): Promise<UnionProfile> {
  const group = schoolGroups[id];
  const data = profileData(input);
  const row = await prisma.schoolGroup.upsert({
    where: { key: group.key },
    update: data,
    create: { key: group.key, ...data },
  });
  return mapUnionProfile(row);
}

export async function getPublishedSchoolGroupPosts(id: SchoolGroupId): Promise<UnionPost[]> {
  const group = schoolGroups[id];
  const rows = await queryDatabase(() =>
    prisma.schoolGroupPost.findMany({
      where: { groupKey: group.key, status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    }),
  );
  if (rows === "down") {
    return [];
  }
  return rows.map(mapUnionPost).sort(byNewest);
}

export async function getAllSchoolGroupPosts(id: SchoolGroupId): Promise<UnionPost[]> {
  const group = schoolGroups[id];
  const rows = await queryDatabase(() =>
    prisma.schoolGroupPost.findMany({
      where: { groupKey: group.key },
      orderBy: { updatedAt: "desc" },
    }),
  );
  if (rows === "down") {
    return [];
  }
  return rows.map(mapUnionPost);
}

export async function getSchoolGroupPostBySlug(id: SchoolGroupId, slug: string): Promise<UnionPost | null> {
  const group = schoolGroups[id];
  const row = await queryDatabase(() =>
    prisma.schoolGroupPost.findFirst({ where: { groupKey: group.key, slug, status: "PUBLISHED" } }),
  );
  if (row === "down" || !row) {
    return null;
  }
  return mapUnionPost(row);
}

export async function getSchoolGroupPostById(id: string): Promise<(UnionPost & { groupId: SchoolGroupId }) | null> {
  const row = await queryDatabase(() => prisma.schoolGroupPost.findUnique({ where: { id } }));
  if (row === "down" || !row) {
    return null;
  }
  const groupId = row.groupKey === "PARLIAMENT" ? "parliament" : "aktiv";
  return { ...mapUnionPost(row), groupId };
}

export async function createSchoolGroupPost(id: SchoolGroupId, input: UnionPostInput, authorId: string): Promise<UnionPost> {
  const group = schoolGroups[id];
  const row = await prisma.schoolGroupPost.create({
    data: {
      groupKey: group.key,
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

export async function updateSchoolGroupPost(id: string, input: UnionPostInput): Promise<UnionPost> {
  const current = await prisma.schoolGroupPost.findUnique({ where: { id } });
  const publishedAt = input.status === "PUBLISHED" ? (current?.publishedAt ?? new Date()) : (current?.publishedAt ?? null);
  const row = await prisma.schoolGroupPost.update({
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

export async function deleteSchoolGroupPost(id: string): Promise<void> {
  await prisma.schoolGroupPost.delete({ where: { id } });
}

export function postsOfKind(posts: UnionPost[], kind: UnionPostKind): UnionPost[] {
  return posts.filter((post) => post.kind === kind);
}
