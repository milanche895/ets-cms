import Grid from "@mui/material/Grid";
import type { Metadata } from "next";
import Link from "next/link";
import { ProgramCard } from "@/components/common/ProgramCard";
import { Section } from "@/components/common/Section";
import { PageHeader } from "@/components/pages/PageHeader";
import { getPrograms } from "@/services/programs";

export const metadata: Metadata = {
  title: "Образовни профили",
  description: "Електротехничар рачунара, администратор рачунарских мрежа и електричар.",
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <PageHeader
        title="Образовни профили"
        subtitle="Школа образује ученике за три профила у подручју електротехнике."
      />
      <Section>
        <Grid container spacing={2.5}>
          {programs.map((program) => (
            <Grid key={program.id} size={{ xs: 12, md: 4 }}>
              <Link href={`/obrazovni-profili/${program.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <ProgramCard program={program} />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Section>
    </>
  );
}
