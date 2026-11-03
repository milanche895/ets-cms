import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { Section } from "@/components/common/Section";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ContentText } from "@/components/pages/ContentText";
import { PageHeader } from "@/components/pages/PageHeader";
import { UnionPostCard } from "@/components/union/UnionPostCard";
import { phoneHref } from "@/lib/format";
import { getPublishedUnionPosts, getUnionProfile } from "@/services/union";
import type { UnionPost, UnionProfile } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getUnionProfile();
  return {
    title: profile.seoTitle || "Синдикат",
    description: profile.seoDescription || profile.summary || undefined,
  };
}

function contactFacts(profile: UnionProfile) {
  return [
    profile.presidentName ? { label: "Председник", value: profile.presidentName } : null,
    profile.affiliation ? { label: "Грански синдикат", value: profile.affiliation } : null,
    profile.office ? { label: "Канцеларија", value: profile.office } : null,
    profile.officeHours ? { label: "Термини за чланове", value: profile.officeHours } : null,
    profile.phone ? { label: "Телефон", value: profile.phone, href: phoneHref(profile.phone) } : null,
    profile.email ? { label: "Е-пошта", value: profile.email, href: `mailto:${profile.email}` } : null,
    profile.facebookUrl ? { label: "Facebook", value: "Страница синдиката", href: profile.facebookUrl } : null,
  ].filter((item): item is { label: string; value: string; href?: string } => Boolean(item));
}

function PostList({ posts, empty }: { posts: UnionPost[]; empty: string }) {
  if (posts.length === 0) {
    return <Typography color="text.secondary">{empty}</Typography>;
  }

  return (
    <Grid container spacing={2.5}>
      {posts.map((post) => (
        <Grid key={post.id} size={{ xs: 12, md: 4 }}>
          <UnionPostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
}

export default async function UnionPage() {
  const [profile, posts] = await Promise.all([getUnionProfile(), getPublishedUnionPosts()]);
  const announcements = posts.filter((post) => post.kind === "ANNOUNCEMENT");
  const activities = posts.filter((post) => post.kind === "ACTIVITY");
  const facts = contactFacts(profile);

  return (
    <>
      <PageHeader title={profile.name} subtitle={profile.summary} />
      <Section>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 3, md: 6 },
            gridTemplateColumns: { xs: "1fr", md: profile.logo ? "1.3fr 0.7fr" : "1fr" },
            alignItems: "start",
          }}
        >
          <ContentText content={profile.about} />
          {profile.logo ? (
            <Box
              component="img"
              src={profile.logo}
              alt=""
              sx={{ width: "100%", maxWidth: 280, maxHeight: 180, objectFit: "contain", justifySelf: { md: "end" } }}
            />
          ) : null}
        </Box>
      </Section>

      {facts.length > 0 || profile.membership || profile.benefits ? (
        <Section tone="gray">
          <SectionTitle title="Организација" subtitle="Контакт, чланство и оно што синдикат ради за запослене." />
          {facts.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                mb: profile.membership || profile.benefits ? 3 : 0,
              }}
            >
              {facts.map((fact) => (
                <Box key={fact.label} sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2, bgcolor: "background.paper" }}>
                  <Typography sx={{ color: "secondary.main", fontWeight: 700, fontSize: 13 }}>{fact.label}</Typography>
                  {fact.href ? (
                    <Link
                      href={fact.href}
                      underline="hover"
                      target={fact.href.startsWith("http") ? "_blank" : undefined}
                      rel={fact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      sx={{ display: "inline-block", mt: 0.5, fontWeight: 700 }}
                    >
                      {fact.value}
                    </Link>
                  ) : (
                    <Typography sx={{ mt: 0.5, fontWeight: 700, whiteSpace: "pre-wrap" }}>{fact.value}</Typography>
                  )}
                </Box>
              ))}
            </Box>
          ) : null}
          <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
            {profile.membership ? (
              <Box>
                <Typography variant="h3" sx={{ fontSize: "1.2rem", mb: 1 }}>
                  Учлањење
                </Typography>
                <ContentText content={profile.membership} />
              </Box>
            ) : null}
            {profile.benefits ? (
              <Box>
                <Typography variant="h3" sx={{ fontSize: "1.2rem", mb: 1 }}>
                  Чланство
                </Typography>
                <ContentText content={profile.benefits} />
              </Box>
            ) : null}
          </Box>
        </Section>
      ) : null}

      <Section>
        <SectionTitle title="Обавештења" subtitle="Поруке председника синдиката за чланове и запослене." />
        <PostList posts={announcements} empty="Тренутно нема објављених обавештења." />
      </Section>

      <Section tone="gray">
        <SectionTitle title="Активности" subtitle="Састанци, акције и други термини синдикалне организације." />
        <PostList posts={activities} empty="Тренутно нема објављених активности." />
      </Section>
    </>
  );
}
