import Grid from "@mui/material/Grid";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/common/ProjectCard";
import { Section } from "@/components/common/Section";
import { PageHeader } from "@/components/pages/PageHeader";
import { getProjects } from "@/services/projects";

export const metadata: Metadata = {
  title: "Пројекти",
  description: "Роботика, програмирање и школски пројекти.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader title="Наши пројекти" subtitle="Роботика, програмирање и заједнички радови ученика и наставника." />
      <Section>
        <Grid container spacing={2.5}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      </Section>
    </>
  );
}
