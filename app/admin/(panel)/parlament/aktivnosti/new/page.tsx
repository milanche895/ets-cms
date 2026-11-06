import type { Metadata } from "next";
import { GroupPostEditor } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Нова активност" };

export default function NewParliamentActivityPage() {
  return <GroupPostEditor group="parliament" kind="ACTIVITY" />;
}
