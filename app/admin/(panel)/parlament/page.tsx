import type { Metadata } from "next";
import { GroupProfileAdmin } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Ђачки парламент" };

export default function AdminParliamentPage() {
  return <GroupProfileAdmin group="parliament" />;
}
