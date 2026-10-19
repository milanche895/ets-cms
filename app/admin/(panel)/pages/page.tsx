import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { AdminTable } from "@/components/admin/AdminTable";
import { statusLabels } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { getPages } from "@/services/pages";

export const metadata: Metadata = { title: "Странице" };

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <>
      <AdminHeading
        title="Странице"
        description="Страница са слагом o-skoli се приказује на адреси /o-skoli."
        action={{ href: "/admin/pages/new", label: "Нова страница" }}
      />
      <DbNotice />
      <AdminTable
        headers={["Наслов", "Слаг", "Статус"]}
        rows={pages.map((page) => ({
          href: `/admin/pages/${page.id}`,
          cells: [page.title, page.slug, statusLabels[page.status] ?? page.status],
        }))}
      />
    </>
  );
}
