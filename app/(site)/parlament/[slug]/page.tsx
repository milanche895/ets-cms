import type { Metadata } from "next";
import { GroupPostView } from "@/components/groups/GroupPostView";
import { getSchoolGroupPostBySlug } from "@/services/groups";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getSchoolGroupPostBySlug("parliament", slug);
  if (!post) {
    return { title: "Ђачки парламент" };
  }
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt };
}

export default async function ParliamentPostPage({ params }: PageProps) {
  const { slug } = await params;
  return <GroupPostView group="parliament" slug={slug} />;
}
