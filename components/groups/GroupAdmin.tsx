import { notFound, redirect } from "next/navigation";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { AdminTable } from "@/components/admin/AdminTable";
import { statusLabels, statusOptions, unionPostKindOptions } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";
import { LinkButton } from "@/components/common/LinkButton";
import { formatDate } from "@/lib/format";
import { schoolGroups, type SchoolGroupId } from "@/lib/school-groups";
import { formatEventDate, getAllSchoolGroupPosts, getSchoolGroupPostById, getSchoolGroupProfile } from "@/services/groups";
import type { UnionPost, UnionPostKind } from "@/types/content";
import Stack from "@mui/material/Stack";

function GroupNav({ group, current }: { group: SchoolGroupId; current: "profile" | "announcements" | "activities" }) {
  const base = schoolGroups[group].adminPath;
  const links = [
    { key: "profile", href: base, label: "Организација" },
    { key: "announcements", href: `${base}/obavestenja`, label: "Обавештења" },
    { key: "activities", href: `${base}/aktivnosti`, label: "Активности" },
  ] as const;

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
      {links.map((item) => (
        <LinkButton key={item.key} href={item.href} variant={current === item.key ? "contained" : "outlined"} size="small">
          {item.label}
        </LinkButton>
      ))}
    </Stack>
  );
}

export async function GroupProfileAdmin({ group }: { group: SchoolGroupId }) {
  const config = schoolGroups[group];
  const profile = await getSchoolGroupProfile(group);

  return (
    <>
      <AdminHeading
        title={config.title}
        description="Подаци о организацији. Обавештења и активности додају се дугмадима десно или из менија."
        actions={[
          { href: `${config.adminPath}/obavestenja/new`, label: "Ново обавештење" },
          { href: `${config.adminPath}/aktivnosti/new`, label: "Нова активност" },
        ]}
      />
      <GroupNav group={group} current="profile" />
      <DbNotice />
      <SaveForm
        endpoint={`/api/groups/${group}`}
        method="PUT"
        redirectTo={config.adminPath}
        fields={[
          { name: "name", label: "Назив", required: true, value: profile.name },
          { name: "logo", label: "Лого", type: "image", imageFit: "contain", value: profile.logo ?? "" },
          { name: "summary", label: "Кратак увод", multiline: true, rows: 2, value: profile.summary },
          { name: "about", label: "О организацији", multiline: true, rows: 8, value: profile.about, helperText: "Нови пасус: празан ред." },
          { name: "presidentName", label: config.presidentLabel, value: profile.presidentName },
          { name: "affiliation", label: config.affiliationLabel, value: profile.affiliation },
          { name: "email", label: "Е-пошта", type: "email", value: profile.email },
          { name: "phone", label: "Телефон", value: profile.phone },
          { name: "office", label: "Просторија", value: profile.office },
          { name: "officeHours", label: "Термини", multiline: true, rows: 2, value: profile.officeHours },
          { name: "membership", label: config.membershipTitle, multiline: true, rows: 4, value: profile.membership },
          { name: "benefits", label: config.benefitsTitle, multiline: true, rows: 4, value: profile.benefits },
          { name: "facebookUrl", label: "Facebook", value: profile.facebookUrl ?? "" },
          { name: "seoTitle", label: "SEO наслов", value: profile.seoTitle },
          { name: "seoDescription", label: "SEO опис", multiline: true, rows: 2, value: profile.seoDescription },
        ]}
      />
    </>
  );
}

const listCopy = {
  ANNOUNCEMENT: {
    title: "Обавештења",
    description: "На сајту се виде само објављена обавештења.",
    action: "Ново обавештење",
    segment: "obavestenja",
    nav: "announcements",
  },
  ACTIVITY: {
    title: "Активности",
    description: "На сајту се виде само објављене активности.",
    action: "Нова активност",
    segment: "aktivnosti",
    nav: "activities",
  },
} as const;

export async function GroupPostListAdmin({ group, kind }: { group: SchoolGroupId; kind: UnionPostKind }) {
  const config = schoolGroups[group];
  const section = listCopy[kind];
  const href = `${config.adminPath}/${section.segment}`;
  const posts = (await getAllSchoolGroupPosts(group)).filter((post) => post.kind === kind);

  return (
    <>
      <AdminHeading title={section.title} description={section.description} action={{ href: `${href}/new`, label: section.action }} />
      <GroupNav group={group} current={section.nav} />
      <DbNotice />
      <AdminTable
        headers={["Наслов", "Статус", "Датум"]}
        rows={posts.map((post) => ({
          href: `${href}/${post.id}`,
          cells: [post.title, statusLabels[post.status] ?? post.status, formatDate(post.startsAt ?? post.publishedAt) || "—"],
        }))}
      />
    </>
  );
}

export function GroupPostEditor({ group, kind, post }: { group: SchoolGroupId; kind: UnionPostKind; post?: UnionPost }) {
  const config = schoolGroups[group];
  const isActivity = (post?.kind ?? kind) === "ACTIVITY";
  const listHref = `${config.adminPath}/${isActivity ? "aktivnosti" : "obavestenja"}`;

  return (
    <>
      <AdminHeading
        title={post ? post.title : isActivity ? "Нова активност" : "Ново обавештење"}
        description={post ? undefined : isActivity ? `Термин, место и опис за ${config.title.toLowerCase()}.` : `Обавештење за ${config.title.toLowerCase()}.`}
      />
      <GroupNav group={group} current={isActivity ? "activities" : "announcements"} />
      <DbNotice />
      <SaveForm
        endpoint={post ? `/api/groups/${group}/posts/${post.id}` : `/api/groups/${group}/posts`}
        method={post ? "PUT" : "POST"}
        redirectTo={listHref}
        deleteEndpoint={post ? `/api/groups/${group}/posts/${post.id}` : undefined}
        fields={[
          { name: "kind", label: "Врста", type: "select", value: post?.kind ?? kind, options: unionPostKindOptions },
          { name: "title", label: "Наслов", required: true, value: post?.title },
          { name: "slug", label: "Слаг", value: post?.slug, helperText: "Ако остане празно, прави се из наслова." },
          { name: "excerpt", label: "Кратак опис", multiline: true, rows: 3, value: post?.excerpt },
          { name: "content", label: "Садржај", multiline: true, rows: 10, value: post?.content, helperText: "Нови пасус: празан ред." },
          { name: "featuredImage", label: "Слика", type: "image", value: post?.featuredImage ?? "" },
          { name: "location", label: "Место", value: post?.location ?? "" },
          {
            name: "startsAt",
            label: "Датум",
            type: "date",
            value: formatEventDate(post?.startsAt ?? null),
            helperText: "За активност: кад се одржава. За обавештење може да остане празно.",
          },
          { name: "status", label: "Статус", type: "select", value: post?.status ?? "DRAFT", options: statusOptions },
          { name: "seoTitle", label: "SEO наслов", value: post?.seoTitle ?? "" },
          { name: "seoDescription", label: "SEO опис", multiline: true, rows: 2, value: post?.seoDescription ?? "" },
        ]}
      />
    </>
  );
}

export async function GroupPostEditAdmin({ group, kind, id }: { group: SchoolGroupId; kind: UnionPostKind; id: string }) {
  const post = await getSchoolGroupPostById(id);
  if (!post || post.groupId !== group) {
    notFound();
  }
  if (post.kind !== kind) {
    const segment = post.kind === "ACTIVITY" ? "aktivnosti" : "obavestenja";
    redirect(`${schoolGroups[group].adminPath}/${segment}/${post.id}`);
  }
  return <GroupPostEditor group={group} kind={kind} post={post} />;
}
