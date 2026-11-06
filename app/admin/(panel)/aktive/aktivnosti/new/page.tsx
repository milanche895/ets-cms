import type { Metadata } from "next";
import { GroupPostEditor } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Нова активност" };

export default function NewAktivActivityPage() {
  return <GroupPostEditor group="aktiv" kind="ACTIVITY" />;
}
