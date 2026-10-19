import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { statusOptions } from "@/components/admin/contentFields";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";
import { getPageById } from "@/services/pages";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "Измена странице" };

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) {
    notFound();
  }

  return (
    <>
      <AdminHeading title={page.title} />
      <DbNotice />
      <SaveForm
        endpoint={`/api/pages/${page.id}`}
        method="PUT"
        redirectTo="/admin/pages"
        deleteEndpoint={`/api/pages/${page.id}`}
        fields={[
          { name: "title", label: "Наслов", required: true, value: page.title },
          { name: "slug", label: "Слаг", value: page.slug },
          { name: "content", label: "Садржај", multiline: true, rows: 12, value: page.content },
          { name: "featuredImage", label: "Слика", value: page.featuredImage ?? "" },
          { name: "status", label: "Статус", type: "select", value: page.status, options: statusOptions },
          { name: "seoTitle", label: "SEO наслов", value: page.seoTitle ?? "" },
          { name: "seoDescription", label: "SEO опис", multiline: true, rows: 2, value: page.seoDescription ?? "" },
        ]}
      />
    </>
  );
}
