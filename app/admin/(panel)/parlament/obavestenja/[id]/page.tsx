import type { Metadata } from "next";
import { GroupPostEditAdmin } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Измена обавештења" };

export default async function EditParliamentAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroupPostEditAdmin group="parliament" kind="ANNOUNCEMENT" id={id} />;
}
