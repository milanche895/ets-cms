import { AdminHeading } from "@/components/admin/AdminHeading";
import { AdminTable } from "@/components/admin/AdminTable";
import { statusLabels } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { UnionNav } from "@/components/admin/UnionNav";
import { formatDate } from "@/lib/format";
import { getAllUnionPosts } from "@/services/union";
import type { UnionPostKind } from "@/types/content";

const sections = {
  ANNOUNCEMENT: {
    title: "Обавештења",
    description: "Поруке за чланове и запослене. На сајту се виде само објављена обавештења.",
    action: "Ново обавештење",
    href: "/admin/sindikat/obavestenja",
    nav: "announcements",
  },
  ACTIVITY: {
    title: "Активности",
    description: "Састанци, акције и други термини. На сајту се виде само објављене активности.",
    action: "Нова активност",
    href: "/admin/sindikat/aktivnosti",
    nav: "activities",
  },
} as const;

export async function UnionPostSection({ kind }: { kind: UnionPostKind }) {
  const section = sections[kind];
  const posts = (await getAllUnionPosts()).filter((post) => post.kind === kind);

  return (
    <>
      <AdminHeading
        title={section.title}
        description={section.description}
        action={{ href: `${section.href}/new`, label: section.action }}
      />
      <UnionNav current={section.nav} />
      <DbNotice />
      <AdminTable
        headers={["Наслов", "Статус", "Датум"]}
        rows={posts.map((post) => ({
          href: `${section.href}/${post.id}`,
          cells: [post.title, statusLabels[post.status] ?? post.status, formatDate(post.startsAt ?? post.publishedAt) || "—"],
        }))}
      />
    </>
  );
}
