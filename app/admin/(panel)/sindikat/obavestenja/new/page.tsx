import type { Metadata } from "next";
import { UnionPostEditor } from "@/components/admin/UnionPostEditor";

export const metadata: Metadata = { title: "Ново обавештење" };

export default function NewUnionAnnouncementPage() {
  return <UnionPostEditor kind="ANNOUNCEMENT" />;
}
