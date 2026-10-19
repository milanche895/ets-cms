import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { statusOptions } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";
import { getCategories } from "@/services/categories";

export const metadata: Metadata = { title: "Нова вест" };

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <>
      <AdminHeading title="Нова вест" />
      <DbNotice />
      <SaveForm
        endpoint="/api/articles"
        redirectTo="/admin/articles"
        fields={[
          { name: "title", label: "Наслов", required: true },
          { name: "slug", label: "Слаг", helperText: "Ако остане празно, прави се из наслова." },
          { name: "excerpt", label: "Кратак опис", multiline: true, rows: 3 },
          { name: "content", label: "Садржај", multiline: true, rows: 10, helperText: "Нови пасус: празан ред." },
          { name: "featuredImage", label: "Слика", helperText: "Путања попут /uploads/slika.jpg или /images/..." },
          {
            name: "categoryId",
            label: "Категорија",
            type: "select",
            options: [{ value: "", label: "Без категорије" }, ...categories.map((category) => ({ value: category.id, label: category.name }))],
          },
          { name: "status", label: "Статус", type: "select", value: "DRAFT", options: statusOptions },
          { name: "seoTitle", label: "SEO наслов" },
          { name: "seoDescription", label: "SEO опис", multiline: true, rows: 2 },
        ]}
      />
    </>
  );
}
