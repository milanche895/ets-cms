import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/common/LinkButton";
import { ProgramCard } from "@/components/common/ProgramCard";
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

  const others = programs.filter((item) => item.id !== program.id);

  return (
    <>
      <PageHeader title={program.title} subtitle={program.summary} />
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
              src={program.image}
              alt={program.imageAlt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 480px"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </Box>
          <Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              <Chip label={program.duration} sx={{ bgcolor: "gold.light", color: "primary.main" }} />
              <Chip label={program.level} variant="outlined" color="secondary" />
            </Box>
            <ContentText content={program.body} />
            <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: { xs: 2, md: 2.5 }, mt: 1 }}>
              <Typography variant="h2" sx={{ fontSize: "1.15rem", mb: 1.5 }}>
                Шта профил обухвата
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.25, display: "grid", gap: 0.75 }}>
                {program.highlights.map((item) => (
                  <Typography key={item} component="li" sx={{ fontSize: "1.02rem" }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Link
              href="https://www.zetss.edu.rs/resursi/obrazovni-profili/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "inline-block", mt: 2, fontWeight: 700 }}
            >
              Преглед профила на сајту Заједнице
            </Link>
            <Box>
              <LinkButton href="/obrazovni-profili" variant="outlined" sx={{ mt: 2 }}>
                Сви профили
              </LinkButton>
            </Box>
          </Box>
        </Box>

        {others.length > 0 ? (
          <Box sx={{ mt: { xs: 5, md: 7 } }}>
            <Typography variant="h2" sx={{ fontSize: "1.35rem", mb: 2 }}>
              Остали профили
            </Typography>
            <Grid container spacing={2}>
              {others.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
                  <ProgramCard program={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}
      </Container>
    </>
  );
}
