import type { Metadata } from "next";
import { GroupProfileAdmin } from "@/components/groups/GroupAdmin";

export const metadata: Metadata = { title: "Активе" };

export default function AdminAktivPage() {
  return <GroupProfileAdmin group="aktiv" />;
}
