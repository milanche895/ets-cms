import type { Metadata } from "next";
import { GroupPostEditAdmin } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Измена активности" };

export default async function EditParliamentActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroupPostEditAdmin group="parliament" kind="ACTIVITY" id={id} />;
}
