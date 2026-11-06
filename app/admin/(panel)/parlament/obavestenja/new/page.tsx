import type { Metadata } from "next";
import { GroupPostEditor } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Ново обавештење" };

export default function NewParliamentAnnouncementPage() {
  return <GroupPostEditor group="parliament" kind="ANNOUNCEMENT" />;
}
