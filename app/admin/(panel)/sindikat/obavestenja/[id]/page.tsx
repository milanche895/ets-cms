import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { UnionPostEditor } from "@/components/admin/UnionPostEditor";
import { getUnionPostById } from "@/services/union";

type EditAnnouncementProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "Измена обавештења" };

export default async function EditUnionAnnouncementPage({ params }: EditAnnouncementProps) {
  const { id } = await params;
  const post = await getUnionPostById(id);
  if (!post) {
    notFound();
  }
  if (post.kind !== "ANNOUNCEMENT") {
    redirect(`/admin/sindikat/aktivnosti/${post.id}`);
  }

  return <UnionPostEditor kind="ANNOUNCEMENT" post={post} />;
}
