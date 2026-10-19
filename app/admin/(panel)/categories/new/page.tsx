import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";

export const metadata: Metadata = { title: "Нова категорија" };

export default function NewCategoryPage() {
  return (
    <>
      <AdminHeading title="Нова категорија" />
      <DbNotice />
      <SaveForm
        endpoint="/api/categories"
        redirectTo="/admin/categories"
        fields={[
          { name: "name", label: "Назив", required: true },
          { name: "slug", label: "Слаг", helperText: "Ако остане празно, прави се из назива." },
          { name: "description", label: "Опис", multiline: true, rows: 3 },
        ]}
      />
    </>
  );
}
