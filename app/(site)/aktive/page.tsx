import type { Metadata } from "next";
import { GroupHome } from "@/components/groups/GroupHome";
import { getSchoolGroupProfile } from "@/services/groups";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getSchoolGroupProfile("aktiv");
  return {
    title: profile.seoTitle || "Активе",
    description: profile.seoDescription || profile.summary || undefined,
  };
}

export default function AktivPage() {
  return <GroupHome group="aktiv" />;
}
