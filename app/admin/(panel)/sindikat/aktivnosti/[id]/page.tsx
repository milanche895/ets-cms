import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { UnionPostEditor } from "@/components/admin/UnionPostEditor";
import { getUnionPostById } from "@/services/union";

type EditActivityProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "Измена активности" };

export default async function EditUnionActivityPage({ params }: EditActivityProps) {
  const { id } = await params;
  const post = await getUnionPostById(id);
  if (!post) {
    notFound();
  }
  if (post.kind !== "ACTIVITY") {
    redirect(`/admin/sindikat/obavestenja/${post.id}`);
  }

  return <UnionPostEditor kind="ACTIVITY" post={post} />;
}
