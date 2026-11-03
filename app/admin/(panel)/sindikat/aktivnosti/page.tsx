import type { Metadata } from "next";
import { UnionPostSection } from "@/components/admin/UnionPostSection";

export const metadata: Metadata = { title: "Активности синдиката" };

export default function UnionActivitiesPage() {
  return <UnionPostSection kind="ACTIVITY" />;
}
