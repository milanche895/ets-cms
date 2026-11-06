import type { Metadata } from "next";
import { GroupPostListAdmin } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Активности парламента" };

export default function ParliamentActivitiesPage() {
  return <GroupPostListAdmin group="parliament" kind="ACTIVITY" />;
}
