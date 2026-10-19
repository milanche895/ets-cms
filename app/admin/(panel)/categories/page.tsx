import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { AdminTable } from "@/components/admin/AdminTable";
import { DbNotice } from "@/components/admin/DbNotice";
import { getCategories } from "@/services/categories";

export const metadata: Metadata = { title: "Категорије" };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <AdminHeading
        title="Категорије"
        description="Категорије се додељују вестима."
        action={{ href: "/admin/categories/new", label: "Нова категорија" }}
      />
      <DbNotice />
      <AdminTable
        headers={["Назив", "Слаг"]}
        rows={categories.map((category) => ({
          href: `/admin/categories/${category.id}`,
          cells: [category.name, category.slug],
        }))}
      />
    </>
  );
}
