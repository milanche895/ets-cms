import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { NewsCard } from "@/components/common/NewsCard";
import { NewsFilters } from "@/components/common/NewsFilters";
import { Section } from "@/components/common/Section";
import { PageHeader } from "@/components/pages/PageHeader";
import { formatDate } from "@/lib/format";
import { getPublishedArticles } from "@/services/articles";
import { getCategories } from "@/services/categories";
import type { Article } from "@/types/content";

export const metadata: Metadata = {
  title: "Актуелно",
  description: "Вести и обавештења Електротехничке школе „Михајло Пупин“.",
};

type NewsPageProps = {
  searchParams: Promise<{ kategorija?: string }>;
};

const categoryOrder = ["aktuelnosti", "projekti", "takmicenja", "robotika", "programiranje", "tehnologija"];

function inCategory(article: Article, slug: string, id: string) {
  return article.categorySlug === slug || article.categoryId === slug || article.categoryId === id;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { kategorija } = await searchParams;
  const [articles, categories] = await Promise.all([getPublishedArticles(), getCategories()]);
  const ordered = [...categories].sort((a, b) => {
    const left = categoryOrder.indexOf(a.slug);
    const right = categoryOrder.indexOf(b.slug);
    return (left === -1 ? 99 : left) - (right === -1 ? 99 : right);
  });
  const active = ordered.find((category) => category.slug === kategorija);
  const visible = active ? articles.filter((article) => inCategory(article, active.slug, active.id)) : articles;

  return (
    <>
      <PageHeader
        title="Актуелно"
        subtitle={active?.description || "Вести и обавештења из живота школе."}
      />
      <Section>
        <NewsFilters categories={ordered} activeSlug={active?.slug} />
        {visible.length === 0 ? (
          <Typography color="text.secondary">Нема вести у овој категорији.</Typography>
        ) : (
          <Grid container spacing={2.5}>
            {visible.map((article) => (
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
