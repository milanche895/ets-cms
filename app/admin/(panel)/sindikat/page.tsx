import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/AdminHeading";
import { DbNotice } from "@/components/admin/DbNotice";
import { SaveForm } from "@/components/admin/SaveForm";
import { UnionNav } from "@/components/admin/UnionNav";
import { getUnionProfile } from "@/services/union";

export const metadata: Metadata = { title: "Синдикат" };

export default async function AdminUnionPage() {
  const profile = await getUnionProfile();

  return (
    <>
      <AdminHeading
        title="Синдикат"
        description="Подаци о организацији. Обавештења и активности додају се дугмадима десно или из менија."
        actions={[
          { href: "/admin/sindikat/obavestenja/new", label: "Ново обавештење" },
          { href: "/admin/sindikat/aktivnosti/new", label: "Нова активност" },
        ]}
      />
      <UnionNav current="profile" />
      <DbNotice />
      <SaveForm
        endpoint="/api/union"
        method="PUT"
        redirectTo="/admin/sindikat"
        fields={[
          { name: "name", label: "Назив организације", required: true, value: profile.name },
          { name: "logo", label: "Лого", type: "image", imageFit: "contain", value: profile.logo ?? "" },
          { name: "summary", label: "Кратак увод", multiline: true, rows: 2, value: profile.summary },
          {
            name: "about",
            label: "О организацији",
            multiline: true,
            rows: 8,
            value: profile.about,
            helperText: "Нови пасус: празан ред.",
          },
          { name: "presidentName", label: "Председник", value: profile.presidentName },
          { name: "affiliation", label: "Грански синдикат", value: profile.affiliation, helperText: "На пример: Синдикат образовања Србије." },
          { name: "email", label: "Е-пошта", type: "email", value: profile.email },
          { name: "phone", label: "Телефон", value: profile.phone },
          { name: "office", label: "Канцеларија", value: profile.office, helperText: "Просторија у школи или адреса." },
          { name: "officeHours", label: "Термини за чланове", multiline: true, rows: 2, value: profile.officeHours },
          { name: "membership", label: "Како се учланити", multiline: true, rows: 4, value: profile.membership },
          { name: "benefits", label: "Шта чланство доноси", multiline: true, rows: 4, value: profile.benefits },
          { name: "facebookUrl", label: "Facebook", value: profile.facebookUrl ?? "" },
          { name: "seoTitle", label: "SEO наслов", value: profile.seoTitle },
          { name: "seoDescription", label: "SEO опис", multiline: true, rows: 2, value: profile.seoDescription },
        ]}
      />
    </>
  );
}
