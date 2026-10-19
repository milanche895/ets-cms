import Grid from "@mui/material/Grid";
import { ProjectCard } from "@/components/common/ProjectCard";
import { Section } from "@/components/common/Section";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { Project } from "@/types/content";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <Section id="projekti">
      <SectionTitle
        kicker="Рад ученика"
        title="Наши пројекти"
        subtitle="Роботика, програмирање и заједнички радови ученика и наставника."
        action={{ href: "/projekti", label: "Сви пројекти" }}
      />
      <Grid container spacing={2.5}>
        {projects.map((project) => (
          <Grid key={project.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
