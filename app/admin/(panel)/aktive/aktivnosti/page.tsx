import type { Metadata } from "next";
import { GroupPostListAdmin } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Активности актива" };

export default function AktivActivitiesPage() {
  return <GroupPostListAdmin group="aktiv" kind="ACTIVITY" />;
}
