import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/common/LinkButton";
import { ProjectCard } from "@/components/common/ProjectCard";
import { ContentText } from "@/components/pages/ContentText";
import { PageHeader } from "@/components/pages/PageHeader";
import { getProjectBySlug, getProjects } from "@/services/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return {
    title: project?.title ?? "Пројекат",
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) {
    notFound();
  }

  const others = projects.filter((item) => item.id !== project.id);

  return (
    <>
      <PageHeader title={project.title} subtitle={project.summary} />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 3, md: 5 },
            gridTemplateColumns: { xs: "1fr", md: "0.85fr 1.15fr" },
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              position: "relative",
              alignSelf: "stretch",
              height: { xs: 240, md: "100%" },
              minHeight: { xs: 240, md: 320 },
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "primary.main",
            }}
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 480px"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </Box>
          <Box>
            <ContentText content={project.body} />
            <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: { xs: 2, md: 2.5 }, mt: 1 }}>
              <Typography variant="h2" sx={{ fontSize: "1.15rem", mb: 1.5 }}>
                На овом пројекту
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.25, display: "grid", gap: 0.75 }}>
                {project.highlights.map((item) => (
                  <Typography key={item} component="li" sx={{ fontSize: "1.02rem" }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
            <LinkButton href="/projekti" variant="outlined" sx={{ mt: 3 }}>
              Сви пројекти
            </LinkButton>
          </Box>
        </Box>

        {others.length > 0 ? (
          <Box sx={{ mt: { xs: 5, md: 7 } }}>
            <Typography variant="h2" sx={{ fontSize: "1.35rem", mb: 2 }}>
              Остали пројекти
            </Typography>
            <Grid container spacing={2}>
              {others.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <ProjectCard project={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}
      </Container>
    </>
  );
}
