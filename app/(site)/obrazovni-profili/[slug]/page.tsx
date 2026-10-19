import { AppIcon } from "@/components/common/AppIcon";
import { LinkButton } from "@/components/common/LinkButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentText } from "@/components/pages/ContentText";
import { PageHeader } from "@/components/pages/PageHeader";
import { getProgramBySlug, getPrograms } from "@/services/programs";

type ProgramPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  return {
    title: program?.title ?? "Образовни профил",
    description: program?.summary,
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const [program, programs] = await Promise.all([getProgramBySlug(slug), getPrograms()]);
  if (!program) {
    notFound();
  }

  return (
    <>
      <PageHeader title={program.title} subtitle={program.summary} />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "secondary.main",
              color: "secondary.contrastText",
            }}
          >
            <AppIcon name={program.icon} />
          </Box>
          <Chip label={program.duration} sx={{ bgcolor: "gold.light", color: "primary.main" }} />
        </Box>
        <ContentText content={program.body} />
        <Typography variant="h2" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
          Остали профили
        </Typography>
        {programs
          .filter((item) => item.id !== program.id)
          .map((item) => (
            <Box key={item.id}>
              <LinkButton href={`/obrazovni-profili/${item.slug}`} sx={{ px: 0 }}>
                {item.title}
              </LinkButton>
            </Box>
          ))}
        <LinkButton href="/obrazovni-profili" variant="outlined" sx={{ mt: 3 }}>
          Сви профили
        </LinkButton>
      </Container>
    </>
  );
}
