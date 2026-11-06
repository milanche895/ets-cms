import type { Metadata } from "next";
import { GroupHome } from "@/components/groups/GroupHome";
import { getSchoolGroupProfile } from "@/services/groups";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getSchoolGroupProfile("parliament");
  return {
    title: profile.seoTitle || "Ђачки парламент",
    description: profile.seoDescription || profile.summary || undefined,
  };
}

export default function ParliamentPage() {
  return <GroupHome group="parliament" />;
}
