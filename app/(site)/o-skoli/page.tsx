import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/common/LinkButton";
import { Section } from "@/components/common/Section";
import { ContentText } from "@/components/pages/ContentText";
import { PageHeader } from "@/components/pages/PageHeader";
import { getPageBySlug } from "@/services/pages";
import { getSiteSettings } from "@/services/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("o-skoli");
  return {
    title: page?.seoTitle || "О школи",
    description: page?.seoDescription || undefined,
  };
}

export default async function AboutPage() {
  const [page, site] = await Promise.all([getPageBySlug("o-skoli"), getSiteSettings()]);
  if (!page) {
    notFound();
  }

  return (
    <>
      <PageHeader title={page.title} subtitle={site.location} />
      <Section>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 3, md: 6 },
            gridTemplateColumns: { xs: "1fr", md: "1.3fr 0.7fr" },
          }}
        >
          <ContentText content={page.content} />
          <Box sx={{ display: "grid", gap: 1.5, alignContent: "start" }}>
            {site.aboutFacts.map((fact) => (
              <Box key={fact.label} sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2 }}>
                <Box component="p" sx={{ m: 0, color: "secondary.main", fontWeight: 700, fontSize: 13 }}>
                  {fact.label}
                </Box>
                <Box component="p" sx={{ m: 0, mt: 0.5, fontWeight: 700 }}>
                  {fact.value}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 4 }}>
          <LinkButton href="/projekti" variant="outlined">
            Пројекти ученика
          </LinkButton>
          <LinkButton href="/vesti?kategorija=projekti" variant="outlined">
            Вести о пројектима
          </LinkButton>
          <LinkButton href="/vesti?kategorija=takmicenja" variant="outlined">
            Такмичења
          </LinkButton>
          <LinkButton href="/parlament" variant="outlined">
            Ђачки парламент
          </LinkButton>
          <LinkButton href="/aktive" variant="outlined">
            Активе
          </LinkButton>
        </Box>
      </Section>
    </>
  );
}
