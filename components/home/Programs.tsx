import Grid from "@mui/material/Grid";
import { ProgramCard } from "@/components/common/ProgramCard";
import { Section } from "@/components/common/Section";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { Program } from "@/types/content";

export function Programs({ programs }: { programs: Program[] }) {
  return (
    <Section id="profili" tone="gray">
      <SectionTitle
        kicker="Упис"
        title="Образовни профили"
        subtitle="Школа образује ученике за два четворогодишња профила у подручју електротехнике."
        action={{ href: "/obrazovni-profili", label: "Сви профили" }}
      />
      <Grid container spacing={2.5}>
        {programs.map((program) => (
          <Grid key={program.id} size={{ xs: 12, md: 6 }}>
            <ProgramCard program={program} />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
