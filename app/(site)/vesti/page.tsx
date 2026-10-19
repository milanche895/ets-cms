import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { NewsCard } from "@/components/common/NewsCard";
import { Section } from "@/components/common/Section";
import { PageHeader } from "@/components/pages/PageHeader";
import { formatDate } from "@/lib/format";
import { getPublishedArticles } from "@/services/articles";

export const metadata: Metadata = {
  title: "Актуелно",
  description: "Вести и обавештења Електротехничке школе „Михајло Пупин“.",
};

export default async function NewsPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <PageHeader title="Актуелно" subtitle="Вести и обавештења из живота школе." />
      <Section>
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
    </>
  );
}
