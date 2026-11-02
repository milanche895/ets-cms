import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { statusOptions } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";
import { getArticleById } from "@/services/articles";
import { getCategories } from "@/services/categories";

type EditArticleProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "Измена вести" };

export default async function EditArticlePage({ params }: EditArticleProps) {
  const { id } = await params;
  const [article, categories] = await Promise.all([getArticleById(id), getCategories()]);
  if (!article) {
    notFound();
  }

  return (
    <>
      <AdminHeading title={article.title} />
      <DbNotice />
      <SaveForm
        endpoint={`/api/articles/${article.id}`}
        method="PUT"
        redirectTo="/admin/articles"
        deleteEndpoint={`/api/articles/${article.id}`}
        fields={[
          { name: "title", label: "Наслов", required: true, value: article.title },
          { name: "slug", label: "Слаг", value: article.slug },
          { name: "excerpt", label: "Кратак опис", multiline: true, rows: 3, value: article.excerpt },
          { name: "content", label: "Садржај", multiline: true, rows: 10, value: article.content },
          { name: "featuredImage", label: "Слика", type: "image", value: article.featuredImage ?? "" },
          {
            name: "categoryId",
            label: "Категорија",
            type: "select",
            value: article.categoryId,
            options: [{ value: "", label: "Без категорије" }, ...categories.map((category) => ({ value: category.id, label: category.name }))],
          },
          { name: "status", label: "Статус", type: "select", value: article.status, options: statusOptions },
          { name: "seoTitle", label: "SEO наслов", value: article.seoTitle ?? "" },
          { name: "seoDescription", label: "SEO опис", multiline: true, rows: 2, value: article.seoDescription ?? "" },
        ]}
      />
    </>
  );
}
