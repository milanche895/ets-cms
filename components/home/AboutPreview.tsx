import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Section } from "@/components/common/Section";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { SiteSettings } from "@/types/content";

export function AboutPreview({ site }: { site: SiteSettings }) {
  const paragraphs = site.aboutTeaser.split("\n\n").filter(Boolean);

  return (
    <Section id="o-skoli" tone="gray">
      <Box
        sx={{
          display: "grid",
          gap: { xs: 3, md: 6 },
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
          alignItems: "start",
        }}
      >
        <Box>
          <SectionTitle
            kicker={site.location}
            title={site.schoolName}
            action={{ href: "/o-skoli", label: "О школи" }}
          />
          {paragraphs.map((paragraph) => (
            <Typography key={paragraph.slice(0, 24)} sx={{ mb: 1.5, fontSize: "1.05rem" }}>
              {paragraph}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: "grid", gap: 1.5 }}>
          {site.aboutFacts.map((fact) => (
            <Box key={fact.label} sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 2, p: 2 }}>
              <Typography variant="overline" color="secondary">
                {fact.label}
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>{fact.value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
