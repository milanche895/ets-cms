import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/common/LinkButton";
import { ContentText } from "@/components/pages/ContentText";
import { PageHeader } from "@/components/pages/PageHeader";
import { formatDate } from "@/lib/format";
import { getArticleBySlug, getPublishedArticles } from "@/services/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: "Вест" };
  }
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const others = (await getPublishedArticles()).filter((item) => item.id !== article.id).slice(0, 3);

  return (
    <>
      <PageHeader title={article.title} subtitle={formatDate(article.publishedAt)} />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {article.categoryName ? <Chip label={article.categoryName} color="secondary" variant="outlined" sx={{ mb: 2 }} /> : null}
        {article.featuredImage ? (
          <Box sx={{ position: "relative", height: { xs: 220, md: 380 }, borderRadius: 2, overflow: "hidden", mb: 3 }}>
            {article.featuredImage.startsWith("http") ? (
              <Box component="img" src={article.featuredImage} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Image src={article.featuredImage} alt="" fill priority sizes="800px" style={{ objectFit: "cover" }} />
            )}
          </Box>
        ) : null}
        <ContentText content={article.content} />
        <LinkButton href="/vesti" variant="outlined" sx={{ mt: 2 }}>
          Све вести
        </LinkButton>
        {others.length > 0 ? (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h2" sx={{ fontSize: "1.35rem", mb: 2 }}>
              Још вести
            </Typography>
            {others.map((item) => (
              <Box key={item.id} sx={{ mb: 1.5 }}>
                <LinkButton href={`/vesti/${item.slug}`} sx={{ px: 0 }}>
                  {item.title}
                </LinkButton>
              </Box>
            ))}
          </Box>
        ) : null}
      </Container>
    </>
  );
}
