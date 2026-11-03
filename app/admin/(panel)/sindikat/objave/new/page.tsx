import { redirect } from "next/navigation";

type LegacyNewPostProps = {
  searchParams: Promise<{ vrsta?: string }>;
};

export default async function LegacyNewUnionPostPage({ searchParams }: LegacyNewPostProps) {
  const { vrsta } = await searchParams;
  redirect(vrsta === "aktivnost" ? "/admin/sindikat/aktivnosti/new" : "/admin/sindikat/obavestenja/new");
}
