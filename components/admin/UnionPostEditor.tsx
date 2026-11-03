import { AdminHeading } from "@/components/admin/AdminHeading";
import { statusOptions, unionPostKindOptions } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";
import { UnionNav } from "@/components/admin/UnionNav";
import { formatEventDate } from "@/services/union";
import type { UnionPost, UnionPostKind } from "@/types/content";

export function UnionPostEditor({ kind, post }: { kind: UnionPostKind; post?: UnionPost }) {
  const isActivity = (post?.kind ?? kind) === "ACTIVITY";
  const listHref = isActivity ? "/admin/sindikat/aktivnosti" : "/admin/sindikat/obavestenja";

  return (
    <>
      <AdminHeading
        title={post ? post.title : isActivity ? "Нова активност" : "Ново обавештење"}
        description={
          post
            ? undefined
            : isActivity
              ? "Термин, место и опис активности синдикалне организације."
              : "Обавештење председника синдиката за чланове и запослене."
        }
      />
      <UnionNav current={isActivity ? "activities" : "announcements"} />
      <DbNotice />
      <SaveForm
        endpoint={post ? `/api/union/posts/${post.id}` : "/api/union/posts"}
        method={post ? "PUT" : "POST"}
        redirectTo={listHref}
        deleteEndpoint={post ? `/api/union/posts/${post.id}` : undefined}
        fields={[
          {
            name: "kind",
            label: "Врста",
            type: "select",
            value: post?.kind ?? kind,
            options: unionPostKindOptions,
          },
          { name: "title", label: "Наслов", required: true, value: post?.title },
          { name: "slug", label: "Слаг", value: post?.slug, helperText: "Ако остане празно, прави се из наслова." },
          { name: "excerpt", label: "Кратак опис", multiline: true, rows: 3, value: post?.excerpt },
          {
            name: "content",
            label: "Садржај",
            multiline: true,
            rows: 10,
            value: post?.content,
            helperText: "Нови пасус: празан ред.",
          },
          { name: "featuredImage", label: "Слика", type: "image", value: post?.featuredImage ?? "" },
          { name: "location", label: "Место", value: post?.location ?? "", helperText: "За активност: где се одржава." },
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
