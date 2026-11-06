import type { Metadata } from "next";
import { GroupPostListAdmin } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Обавештења парламента" };

export default function ParliamentAnnouncementsPage() {
  return <GroupPostListAdmin group="parliament" kind="ANNOUNCEMENT" />;
}
