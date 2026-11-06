import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Section } from "@/components/common/Section";
import { SectionTitle } from "@/components/common/SectionTitle";
import { UnionPostCard } from "@/components/union/UnionPostCard";
import { ContentText } from "@/components/pages/ContentText";
import { PageHeader } from "@/components/pages/PageHeader";
import { phoneHref } from "@/lib/format";
import { schoolGroups, type SchoolGroupId } from "@/lib/school-groups";
import { getPublishedSchoolGroupPosts, getSchoolGroupProfile, postsOfKind } from "@/services/groups";
import type { UnionPost, UnionProfile } from "@/types/content";

function contactFacts(profile: UnionProfile, groupId: SchoolGroupId) {
  const group = schoolGroups[groupId];
  return [
    profile.presidentName ? { label: group.presidentLabel, value: profile.presidentName } : null,
    profile.affiliation ? { label: group.affiliationLabel, value: profile.affiliation } : null,
    profile.office ? { label: "Просторија", value: profile.office } : null,
    profile.officeHours ? { label: "Термини", value: profile.officeHours } : null,
    profile.phone ? { label: "Телефон", value: profile.phone, href: phoneHref(profile.phone) } : null,
    profile.email ? { label: "Е-пошта", value: profile.email, href: `mailto:${profile.email}` } : null,
    profile.facebookUrl ? { label: "Facebook", value: "Страница", href: profile.facebookUrl } : null,
  ].filter((item): item is { label: string; value: string; href?: string } => Boolean(item));
}

function PostList({ posts, empty, hrefBase }: { posts: UnionPost[]; empty: string; hrefBase: string }) {
  if (posts.length === 0) {
    return <Typography color="text.secondary">{empty}</Typography>;
  }

  return (
    <Grid container spacing={2.5}>
      {posts.map((post) => (
        <Grid key={post.id} size={{ xs: 12, md: 4 }}>
          <UnionPostCard post={post} hrefBase={hrefBase} />
        </Grid>
      ))}
    </Grid>
  );
}

export async function GroupHome({ group: groupId }: { group: SchoolGroupId }) {
  const group = schoolGroups[groupId];
  const [profile, posts] = await Promise.all([getSchoolGroupProfile(groupId), getPublishedSchoolGroupPosts(groupId)]);
  const facts = contactFacts(profile, groupId);

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
          <SectionTitle title="Организација" subtitle={group.organizationSubtitle} />
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
                  {group.membershipTitle}
                </Typography>
                <ContentText content={profile.membership} />
              </Box>
            ) : null}
            {profile.benefits ? (
              <Box>
                <Typography variant="h3" sx={{ fontSize: "1.2rem", mb: 1 }}>
                  {group.benefitsTitle}
                </Typography>
                <ContentText content={profile.benefits} />
              </Box>
            ) : null}
          </Box>
        </Section>
      ) : null}

      <Section>
        <SectionTitle title="Обавештења" subtitle={group.announcementsSubtitle} />
        <PostList posts={postsOfKind(posts, "ANNOUNCEMENT")} empty="Тренутно нема објављених обавештења." hrefBase={group.publicPath} />
      </Section>

      <Section tone="gray">
        <SectionTitle title="Активности" subtitle={group.activitiesSubtitle} />
        <PostList posts={postsOfKind(posts, "ACTIVITY")} empty="Тренутно нема објављених активности." hrefBase={group.publicPath} />
      </Section>
    </>
  );
}
