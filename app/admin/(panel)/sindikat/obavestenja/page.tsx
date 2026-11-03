import type { Metadata } from "next";
import { UnionPostSection } from "@/components/admin/UnionPostSection";

export const metadata: Metadata = { title: "Обавештења синдиката" };

export default function UnionAnnouncementsPage() {
  return <UnionPostSection kind="ANNOUNCEMENT" />;
}
