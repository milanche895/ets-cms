import type { Metadata } from "next";
import { Competitions } from "@/components/home/Competitions";
import { PageHeader } from "@/components/pages/PageHeader";
import { getActivities } from "@/services/activities";

export const metadata: Metadata = {
  title: "Такмичења",
  description: "Такмичења, роботика, програмирање и ученички парламент.",
};

export default async function CompetitionsPage() {
  const activities = await getActivities();

  return (
    <>
      <PageHeader title="Такмичења и активности" subtitle="Роботика, програмирање, такмичења и ученички парламент." />
      <Competitions activities={activities} showHeading={false} />
    </>
  );
}
