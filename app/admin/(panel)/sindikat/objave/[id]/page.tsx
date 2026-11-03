import { notFound, redirect } from "next/navigation";
import { getUnionPostById } from "@/services/union";

type LegacyEditPostProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyEditUnionPostPage({ params }: LegacyEditPostProps) {
  const { id } = await params;
  const post = await getUnionPostById(id);
  if (!post) {
    notFound();
  }

  redirect(post.kind === "ACTIVITY" ? `/admin/sindikat/aktivnosti/${post.id}` : `/admin/sindikat/obavestenja/${post.id}`);
}
