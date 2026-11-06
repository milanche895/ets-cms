import type { Metadata } from "next";
import { GroupPostEditAdmin } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Измена активности" };

export default async function EditAktivActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroupPostEditAdmin group="aktiv" kind="ACTIVITY" id={id} />;
}