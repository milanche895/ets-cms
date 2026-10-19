import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { statusOptions } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";

export const metadata: Metadata = { title: "Нова страница" };

export default function NewPage() {
  return (
    <>
      <AdminHeading title="Нова страница" />
      <DbNotice />
      <SaveForm
        endpoint="/api/pages"
        redirectTo="/admin/pages"
        fields={[
          { name: "title", label: "Наслов", required: true },
          { name: "slug", label: "Слаг", helperText: "За страницу О школи оставите o-skoli." },
          { name: "content", label: "Садржај", multiline: true, rows: 12 },
          { name: "featuredImage", label: "Слика" },
          { name: "status", label: "Статус", type: "select", value: "PUBLISHED", options: statusOptions },
          { name: "seoTitle", label: "SEO наслов" },
          { name: "seoDescription", label: "SEO опис", multiline: true, rows: 2 },
        ]}
      />
    </>
  );
}
