import type { Metadata } from "next";
import { GroupPostListAdmin } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Обавештења актива" };

export default function AktivAnnouncementsPage() {
  return <GroupPostListAdmin group="aktiv" kind="ANNOUNCEMENT" />;
}
