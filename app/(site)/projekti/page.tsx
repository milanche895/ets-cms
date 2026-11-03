import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import type { Metadata } from "next";
import { LinkButton } from "@/components/common/LinkButton";
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
      <PageHeader title="Наши пројекти" subtitle="Трајни радови ученика. Нова обавештења о пројектима стоје у Актуелном." />
      <Section>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2.5 }}>
          <LinkButton href="/vesti?kategorija=projekti" variant="outlined">
            Вести о пројектима
          </LinkButton>
        </Box>
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
