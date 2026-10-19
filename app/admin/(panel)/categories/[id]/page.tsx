import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";
import { getCategoryById } from "@/services/categories";

type EditCategoryProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "Измена категорије" };

export default async function EditCategoryPage({ params }: EditCategoryProps) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) {
    notFound();
  }

  return (
    <>
      <AdminHeading title={category.name} />
      <DbNotice />
      <SaveForm
        endpoint={`/api/categories/${category.id}`}
        method="PUT"
        redirectTo="/admin/categories"
        deleteEndpoint={`/api/categories/${category.id}`}
        fields={[
          { name: "name", label: "Назив", required: true, value: category.name },
          { name: "slug", label: "Слаг", value: category.slug },
          { name: "description", label: "Опис", multiline: true, rows: 3, value: category.description },
        ]}
      />
    </>
  );
}
