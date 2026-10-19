import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { AdminTable } from "@/components/admin/AdminTable";
import { statusLabels } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { getAllArticles } from "@/services/articles";

export const metadata: Metadata = { title: "Вести" };

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <>
      <AdminHeading
        title="Вести"
        description="Објављене вести се виде на почетној страни и на /вести."
        action={{ href: "/admin/articles/new", label: "Нова вест" }}
      />
      <DbNotice />
      <AdminTable
        headers={["Наслов", "Статус", "Категорија"]}
        rows={articles.map((article) => ({
          href: `/admin/articles/${article.id}`,
          cells: [article.title, statusLabels[article.status] ?? article.status, article.categoryName || "—"],
        }))}
      />
    </>
  );
}
