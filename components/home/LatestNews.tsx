import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { NewsCard } from "@/components/common/NewsCard";
import { Section } from "@/components/common/Section";
import { SectionTitle } from "@/components/common/SectionTitle";
import { formatDate } from "@/lib/format";
import type { Article } from "@/types/content";

export function LatestNews({ articles }: { articles: Article[] }) {
  return (
    <Section id="vesti">
      <SectionTitle
        kicker="Актуелно"
        title="Најновије вести"
        subtitle="Обавештења и дешавања из живота школе."
        action={{ href: "/vesti", label: "Све вести" }}
      />
      {articles.length === 0 ? (
        <Typography color="text.secondary">Тренутно нема објављених вести.</Typography>
      ) : (
        <Grid container spacing={2.5}>
          {articles.map((article) => (
            <Grid key={article.id} size={{ xs: 12, md: 4 }}>
              <NewsCard article={article} dateLabel={formatDate(article.publishedAt)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Section>
  );
}
