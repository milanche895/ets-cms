import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/common/LinkButton";
import { unionPostKindLabels } from "@/components/admin/contentFields";
import { ContentText } from "@/components/pages/ContentText";
import { PageHeader } from "@/components/pages/PageHeader";
import { formatDate } from "@/lib/format";
import { getUnionPostBySlug } from "@/services/union";

type UnionPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: UnionPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getUnionPostBySlug(slug);
  if (!post) {
    return { title: "Синдикат" };
  }
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function UnionPostPage({ params }: UnionPostPageProps) {
  const { slug } = await params;
  const post = await getUnionPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const when = formatDate(post.startsAt ?? post.publishedAt);
  const subtitle = [when, post.location].filter(Boolean).join(" · ");

  return (
    <>
      <PageHeader title={post.title} subtitle={subtitle || undefined} />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Chip label={unionPostKindLabels[post.kind] ?? post.kind} color="secondary" variant="outlined" sx={{ mb: 2 }} />
        {post.featuredImage ? (
          <Box
            component="img"
            src={post.featuredImage}
            alt=""
            sx={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 2, mb: 3 }}
          />
        ) : null}
        <ContentText content={post.content || post.excerpt} />
        <LinkButton href="/sindikat" variant="outlined" sx={{ mt: 2 }}>
          Синдикат
        </LinkButton>
      </Container>
    </>
  );
}
